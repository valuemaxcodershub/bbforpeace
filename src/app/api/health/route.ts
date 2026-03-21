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
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
      VERCEL: !!process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
    },
    connectionString: 'not checked',
    rawDb: 'not checked',
    payload: 'not checked',
  }

  // Show connection string (masked) that Payload would use
  const isProduction = process.env.NODE_ENV === 'production'
  const connStr = isProduction
    ? (process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URI || process.env.POSTGRES_URL || '')
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
    const normalized = connStr.replace('sslmode=require', 'sslmode=no-verify')
    // Show normalized host:port
    const normMatch = normalized.match(/@([^/?]+)/)
    checks.normalizedHost = normMatch ? normMatch[1] : 'unknown'
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

  // Show resolved site URL - important for CORS/CSRF
  checks.siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'
  checks.vercelUrl = process.env.VERCEL_URL || 'NOT SET'
  checks.resolvedUrl = process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  // Check Vercel Blob storage
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || ''
    const storeMatch = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)
    checks.blobStoreId = storeMatch ? storeMatch[1] : 'unparseable'
    checks.blobBaseUrl = storeMatch ? `https://${storeMatch[1].toLowerCase()}.public.blob.vercel-storage.com` : 'unknown'

    const { list, head } = await import('@vercel/blob')
    const blobs = await list({ limit: 5, token })
    checks.blobFiles = blobs.blobs.map((b: any) => ({ url: b.url, size: b.size, uploaded: b.uploadedAt }))
    checks.blobCount = blobs.blobs.length
    checks.blobHasMore = blobs.hasMore

    // Test head() on the first blob file to verify static handler would work
    if (blobs.blobs.length > 0) {
      try {
        const testUrl = blobs.blobs[0].url
        const headResult = await head(testUrl, { token })
        checks.blobHeadTest = { url: testUrl, contentType: headResult.contentType, size: headResult.size, ok: true }
      } catch (headErr: any) {
        checks.blobHeadTest = { error: headErr?.message || String(headErr) }
      }
      // Also test with the baseUrl + filename pattern the static handler uses
      try {
        const firstBlob = blobs.blobs[0]
        const filename = firstBlob.pathname || new URL(firstBlob.url).pathname.substring(1)
        const constructedUrl = `${checks.blobBaseUrl}/${filename}`
        const headResult2 = await head(constructedUrl, { token })
        checks.blobStaticHandlerTest = { constructedUrl, contentType: headResult2.contentType, size: headResult2.size, ok: true }
      } catch (headErr2: any) {
        checks.blobStaticHandlerTest = { error: headErr2?.message || String(headErr2) }
      }
    }
  } catch (error: any) {
    checks.blob = `error: ${error?.message || String(error)}`
  }

  // ── Database role & RLS diagnostics ──
  try {
    const { Pool } = await import('pg')
    const normalized = connStr.replace('sslmode=require', 'sslmode=no-verify')
    const diagPool = new Pool({
      connectionString: normalized,
      ssl: { rejectUnauthorized: false },
      max: 1,
      connectionTimeoutMillis: 15000,
    })

    // Check if current role has BYPASSRLS
    const roleInfo = await diagPool.query(
      `SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = current_user`,
    )
    checks.dbRole = roleInfo.rows[0] || 'unknown'

    // List tables with RLS enabled but no policies (potential blockers)
    const rlsDiag = await diagPool.query(`
      SELECT c.relname AS table_name,
             c.relrowsecurity AS rls_enabled,
             COALESCE(COUNT(p.polname), 0) AS policy_count
      FROM pg_class c
      LEFT JOIN pg_policy p ON p.polrelid = c.oid
      WHERE c.relnamespace = 'public'::regnamespace
        AND c.relkind = 'r'
        AND c.relrowsecurity = true
      GROUP BY c.relname, c.relrowsecurity
      HAVING COALESCE(COUNT(p.polname), 0) = 0
      ORDER BY c.relname
    `)
    checks.tablesWithRLSNoPolicies = rlsDiag.rows.map((r: any) => r.table_name)

    // Test a write operation (safe: insert + immediately delete from tags)
    try {
      const testSlug = `_health_check_${Date.now()}`
      const ins = await diagPool.query(
        `INSERT INTO tags (name, updated_at, created_at) VALUES ($1, NOW(), NOW()) RETURNING id`,
        [testSlug],
      )
      const testId = ins.rows[0].id
      await diagPool.query(`DELETE FROM tags WHERE id = $1`, [testId])
      checks.writeTest = 'ok (insert+delete on tags succeeded)'
    } catch (writeErr: any) {
      checks.writeTest = `FAILED: ${writeErr?.message || String(writeErr)}`
    }

    // Test write on payload_locked_documents (Payload uses this for document locking)
    try {
      const lockIns = await diagPool.query(
        `INSERT INTO payload_locked_documents (updated_at, created_at) VALUES (NOW(), NOW()) RETURNING id`,
      )
      const lockId = lockIns.rows[0].id
      await diagPool.query(`DELETE FROM payload_locked_documents WHERE id = $1`, [lockId])
      checks.lockTableWriteTest = 'ok'
    } catch (lockErr: any) {
      checks.lockTableWriteTest = `FAILED: ${lockErr?.message || String(lockErr)}`
    }

    await diagPool.end()
  } catch (diagErr: any) {
    checks.rlsDiagnostics = `error: ${diagErr?.message || String(diagErr)}`
  }

  return NextResponse.json(checks, { status: checks.status === 'ok' ? 200 : 500 })
}
