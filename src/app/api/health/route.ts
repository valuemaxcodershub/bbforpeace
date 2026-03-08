import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, any> = {
    status: 'checking',
    env: {
      DATABASE_URI: !!process.env.DATABASE_URI,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      PAYLOAD_SECRET: !!process.env.PAYLOAD_SECRET,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'not set',
    },
    connectionString: 'not checked',
    payload: 'not checked',
  }

  const connStr = process.env.DATABASE_URI || process.env.POSTGRES_URL || ''
  checks.connectionString = connStr
    ? `${connStr.substring(0, 30)}...${connStr.substring(connStr.length - 30)}`
    : 'MISSING - no DATABASE_URI or POSTGRES_URL'

  try {
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    const payload = await getPayload({ config })
    checks.payload = 'connected'
    checks.status = 'ok'
  } catch (error: any) {
    checks.payload = `error: ${error?.message || String(error)}`
    checks.status = 'error'
  }

  return NextResponse.json(checks, { status: checks.status === 'ok' ? 200 : 500 })
}
