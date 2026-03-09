import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  const checks: Record<string, any> = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URI: !!process.env.DATABASE_URI,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      PAYLOAD_SECRET: !!process.env.PAYLOAD_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    },
    connectionString: 'not checked',
    rawDb: 'not checked',
    payload: 'not checked',
  }

  // Show connection string (masked) that Payload would use
  const isProduction = process.env.NODE_ENV === 'production'
  const connStr = isProduction
    ? (process.env.POSTGRES_URL || process.env.DATABASE_URI || process.env.POSTGRES_URL_NON_POOLING || '')
    : (process.env.DATABASE_URI || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || '')

  if (connStr) {
    // Show host:port only (mask credentials)
    const match = connStr.match(/@([^/]+)\//)
    checks.connectionString = match ? match[1] : 'present but unparseable'
    checks.connectionStringLength = connStr.length
    checks.connectionStringHas6543 = connStr.includes(':6543')
    checks.connectionStringHas5432 = connStr.includes(':5432')
  } else {
    checks.connectionString = 'MISSING - no DATABASE_URI or POSTGRES_URL'
  }

  // Test raw pg connection directly (bypass Payload)
  const rawStart = Date.now()
  try {
    const { Pool } = await import('pg')
    // Apply same normalization as payload.config.ts
    let normalized = connStr.replace('sslmode=require', 'sslmode=no-verify')
    if (normalized.includes('.pooler.supabase.com:6543/')) {
      normalized = normalized.replace('.pooler.supabase.com:6543/', '.pooler.supabase.com:5432/')
    }
    const pool = new Pool({
      connectionString: normalized,
      ssl: { rejectUnauthorized: false },
      max: 1,
      connectionTimeoutMillis: 15000,
    })
    const result = await pool.query('SELECT now() as time, current_user as user')
    checks.rawDb = `ok in ${Date.now() - rawStart}ms`
    checks.rawDbUser = result.rows[0].user
    await pool.end()
  } catch (error: any) {
    checks.rawDb = `error in ${Date.now() - rawStart}ms: ${error?.message || String(error)}`
  }

  // Test Payload init
  const payloadStart = Date.now()
  try {
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    const payload = await getPayload({ config })
    checks.payload = `connected in ${Date.now() - payloadStart}ms`

    // Test actual user query (same as login does)
    const userQueryStart = Date.now()
    try {
      const users = await payload.find({ collection: 'users', limit: 1 })
      checks.userQuery = `ok in ${Date.now() - userQueryStart}ms, found ${users.docs.length} users`
    } catch (error: any) {
      checks.userQuery = `error in ${Date.now() - userQueryStart}ms: ${error?.message || String(error)}`
    }

    checks.status = 'ok'
  } catch (error: any) {
    checks.payload = `error in ${Date.now() - payloadStart}ms: ${error?.message || String(error)}`
    checks.status = 'error'
  }

  // Show NEXT_PUBLIC_SITE_URL - important for CORS/CSRF
  checks.siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET (defaults to localhost:3000)'

  return NextResponse.json(checks, { status: checks.status === 'ok' ? 200 : 500 })
}
