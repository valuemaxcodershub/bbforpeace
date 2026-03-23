import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

/**
 * Minimal diagnostic endpoint that tests DB connectivity
 * WITHOUT Payload — uses raw pg to show the actual PostgreSQL error.
 */
export async function GET() {
  const info: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
  }

  // 1. Show which env vars are set (masked)
  const envVars = [
    'DATABASE_URI',
    'POSTGRES_URL',
    'POSTGRES_URL_NON_POOLING',
    'PAYLOAD_SECRET',
    'BLOB_READ_WRITE_TOKEN',
    'VERCEL',
  ] as const

  const envStatus: Record<string, string> = {}
  for (const key of envVars) {
    const val = process.env[key]
    if (!val) {
      envStatus[key] = 'NOT SET'
    } else {
      // Show length + first 10 chars (masked)
      envStatus[key] = `SET (len=${val.length}, starts="${val.slice(0, 10)}...")`
    }
  }
  info.envVars = envStatus

  // 2. Parse connection strings to show hosts/ports
  const connStrNames = ['POSTGRES_URL_NON_POOLING', 'DATABASE_URI', 'POSTGRES_URL'] as const
  const connDetails: Record<string, unknown> = {}

  for (const name of connStrNames) {
    const raw = process.env[name]
    if (!raw) {
      connDetails[name] = 'NOT SET'
      continue
    }
    try {
      const url = new URL(raw)
      connDetails[name] = {
        protocol: url.protocol,
        host: url.hostname,
        port: url.port || 'default',
        database: url.pathname.replace('/', ''),
        user: url.username ? `${url.username.slice(0, 8)}...` : 'none',
        hasPassword: !!url.password,
        params: url.searchParams.toString(),
      }
    } catch {
      connDetails[name] = 'INVALID URL FORMAT'
    }
  }
  info.connectionDetails = connDetails

  // 3. Determine which connection string would be used
  const isProduction = process.env.NODE_ENV === 'production'
  const selectedConnStr = isProduction
    ? (process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URI || '')
    : (process.env.DATABASE_URI || process.env.POSTGRES_URL_NON_POOLING || '')

  info.selectedConnStr = selectedConnStr
    ? `len=${selectedConnStr.length}, host=${(() => { try { return new URL(selectedConnStr).hostname } catch { return 'unparseable' } })()}`
    : 'EMPTY STRING — THIS IS THE PROBLEM'

  // 4. Test raw pg connection (no Payload, no Drizzle)
  if (selectedConnStr) {
    try {
      const { Pool } = await import('pg')
      const normalized = selectedConnStr.replace('sslmode=require', 'sslmode=no-verify')
      const pool = new Pool({
        connectionString: normalized,
        ssl: { rejectUnauthorized: false },
        max: 1,
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 5000,
      })

      // Test connection
      const connectStart = Date.now()
      const client = await pool.connect()
      info.rawConnect = `connected in ${Date.now() - connectStart}ms`

      // Test simple query
      const queryStart = Date.now()
      const result = await client.query('SELECT 1 AS test')
      info.rawQuery = `ok in ${Date.now() - queryStart}ms, result=${JSON.stringify(result.rows)}`

      // List tables
      const tablesResult = await client.query(
        `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename LIMIT 30`
      )
      info.publicTables = tablesResult.rows.map((r: { tablename: string }) => r.tablename)
      info.tableCount = tablesResult.rows.length

      // Test count on publications if table exists
      try {
        const countResult = await client.query('SELECT count(*) FROM publications')
        info.publicationsCount = countResult.rows[0]?.count
      } catch (e: unknown) {
        const err = e as { message?: string; code?: string }
        info.publicationsQuery = `FAILED: code=${err.code}, message=${err.message}`
      }

      client.release()
      await pool.end()
    } catch (e: unknown) {
      const err = e as { message?: string; code?: string; detail?: string }
      info.rawConnect = `FAILED: code=${err.code}, message=${err.message}, detail=${err.detail}`
    }
  } else {
    info.rawConnect = 'SKIPPED — no connection string'
  }

  return NextResponse.json(info, { status: 200 })
}
