import { NextResponse } from 'next/server'
import { getDatabaseUrlDiagnostics } from '@/lib/database-url'

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
  }

  // Show connection string host (masked)
  const { selectedUrl: connStr, selectedUrlSource } = getDatabaseUrlDiagnostics()

  const hostMatch = connStr.match(/@([^/]+)\//)
  checks.connectionHost = hostMatch ? hostMatch[1] : connStr ? 'unparseable' : 'MISSING'
  checks.connectionSource = selectedUrlSource

  // Test Payload connection (uses its own shared pool — no extra connections)
  const payloadStart = Date.now()
  try {
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    const payload = await getPayload({ config })
    checks.payload = `connected in ${Date.now() - payloadStart}ms`

    const users = await payload.find({ collection: 'users', limit: 1 })
    checks.userQuery = `ok, found ${users.docs.length} users`
    checks.status = 'ok'
  } catch (error: any) {
    checks.payload = `error in ${Date.now() - payloadStart}ms: ${error?.message || String(error)}`
    checks.status = 'error'
  }

  // Resolved URLs — important for CORS/CSRF debugging
  checks.siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'
  checks.vercelUrl = process.env.VERCEL_URL || 'NOT SET'

  // Blob storage check (no extra DB connections)
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || ''
    const storeMatch = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)
    checks.blobStoreId = storeMatch ? storeMatch[1] : 'unparseable'

    const { list } = await import('@vercel/blob')
    const blobs = await list({ limit: 3, token })
    checks.blobCount = blobs.blobs.length
    checks.blobHasMore = blobs.hasMore
  } catch (error: any) {
    checks.blob = `error: ${error?.message || String(error)}`
  }

  return NextResponse.json(checks, { status: checks.status === 'ok' ? 200 : 500 })
}
