import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { NextRequest } from 'next/server'

// Extend Vercel function timeout — Supabase cold start + bcrypt hashing
// can exceed the default 10s limit on login
export const maxDuration = 60

// Wrap a Payload REST handler to surface errors in the response body
function withErrorLogging(
  handler: (req: NextRequest, ctx: any) => Promise<Response>,
  method: string,
) {
  return async (req: NextRequest, ctx: any): Promise<Response> => {
    try {
      const res = await handler(req, ctx)
      if (res.status >= 400) {
        const body = await res.clone().text().catch(() => '')
        console.error(
          `[Payload ${method}] ${req.nextUrl.pathname} → ${res.status}`,
          body.substring(0, 500),
        )
      }
      return res
    } catch (err: any) {
      console.error(`[Payload ${method}] unhandled error on ${req.nextUrl.pathname}:`, err)
      return Response.json(
        { error: err?.message || 'Internal Server Error', stack: err?.stack?.split('\n').slice(0, 5) },
        { status: 500 },
      )
    }
  }
}

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = withErrorLogging(REST_DELETE(config), 'DELETE')
export const PATCH = withErrorLogging(REST_PATCH(config), 'PATCH')
export const PUT = withErrorLogging(REST_PUT(config), 'PUT')
export const OPTIONS = REST_OPTIONS(config)
