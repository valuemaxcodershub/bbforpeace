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
      R2_BUCKET: !!process.env.R2_BUCKET,
      R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY,
      R2_ENDPOINT: !!process.env.R2_ENDPOINT,
      R2_PUBLIC_URL: !!process.env.R2_PUBLIC_URL,
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

  // R2 storage diagnostics (config presence + endpoint shape)
  checks.r2 = {
    bucket: process.env.R2_BUCKET || 'NOT SET',
    endpoint: process.env.R2_ENDPOINT || 'NOT SET',
    publicUrl: process.env.R2_PUBLIC_URL || 'NOT SET',
  }

  return NextResponse.json(checks, { status: checks.status === 'ok' ? 200 : 500 })
}
