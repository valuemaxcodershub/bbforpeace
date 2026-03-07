import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiter (per server instance)
// For production at scale, replace with Redis/Upstash
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS = {
  api: { max: 60, windowMs: 60000 },       // 60 req/min for API
  auth: { max: 5, windowMs: 300000 },       // 5 req/5min for auth endpoints
  default: { max: 120, windowMs: 60000 },   // 120 req/min general
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function isRateLimited(key: string, limit: { max: number; windowMs: number }): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  // Clean old entries periodically (every 1000 checks)
  if (Math.random() < 0.001) {
    for (const [k, v] of rateLimitStore) {
      if (now > v.resetAt) rateLimitStore.delete(k)
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + limit.windowMs })
    return false
  }

  if (entry.count >= limit.max) {
    return true
  }

  entry.count++
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    // Stricter limit for auth endpoints
    const isAuth = pathname.includes('/users/login') || pathname.includes('/users/forgot-password')
    const limit = isAuth ? RATE_LIMITS.auth : RATE_LIMITS.api
    const key = `${isAuth ? 'auth' : 'api'}:${ip}`

    if (isRateLimited(key, limit)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(limit.windowMs / 1000)),
          },
        }
      )
    }
  }

  // Rate limit admin login page
  if (pathname.startsWith('/admin') && request.method === 'POST') {
    const key = `admin:${ip}`
    if (isRateLimited(key, RATE_LIMITS.auth)) {
      return new NextResponse('Too many login attempts. Please try again later.', {
        status: 429,
        headers: { 'Retry-After': '300' },
      })
    }
  }

  const response = NextResponse.next()

  // Add security headers (supplement next.config.ts headers)
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  // Prevent admin pages from being cached
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    // Match API routes
    '/api/:path*',
    // Match admin routes
    '/admin/:path*',
    // Match all except static files
    '/((?!_next/static|_next/image|favicon.ico|images|uploads|documents).*)',
  ],
}
