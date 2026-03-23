import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Diagnostic endpoint — tests authentication and CRUD through Payload,
 * exactly as the admin panel would. Access while logged-in to the admin
 * so the payload-token cookie is sent.
 *
 * GET /api/diag → returns auth status + CRUD test results
 */
export async function GET(req: NextRequest) {
  const results: Record<string, unknown> = { timestamp: new Date().toISOString() }

  try {
    const payload = await getPayload({ config })

    // 1. Check auth cookie
    const token = req.cookies.get('payload-token')?.value
    results.hasToken = !!token
    results.tokenLength = token?.length ?? 0

    // 2. Verify the token (same way Payload REST handlers do)
    if (token) {
      try {
        const me = await payload.find({
          collection: 'users',
          limit: 1,
          overrideAccess: false,
          user: undefined, // no user yet — we'll verify via JWT
        })
        results.usersReadable = `ok, ${me.docs.length} docs`
      } catch (e: any) {
        results.usersReadable = `FAILED: ${e?.message}`
      }

      // Decode JWT to check expiry
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload64 = parts[1]
          const decoded = JSON.parse(Buffer.from(payload64, 'base64url').toString())
          results.jwtSub = decoded.id || decoded.sub
          results.jwtEmail = decoded.email
          results.jwtRole = decoded.collection
          results.jwtIssuedAt = decoded.iat ? new Date(decoded.iat * 1000).toISOString() : 'missing'
          results.jwtExpiresAt = decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'missing'
          results.jwtExpired = decoded.exp ? Date.now() > decoded.exp * 1000 : 'unknown'
        }
      } catch (e: any) {
        results.jwtDecode = `FAILED: ${e?.message}`
      }

      // Verify via Payload's verifyJWT equivalent
      try {
        const { user } = await payload.auth({ headers: req.headers })
        results.authUser = user
          ? { id: user.id, email: (user as any).email, role: (user as any).role }
          : null
        results.authResult = user ? 'authenticated' : 'not authenticated'
      } catch (authErr: any) {
        results.authResult = `ERROR: ${authErr?.message}`
      }
    } else {
      results.authResult = 'no token cookie — are you logged in?'
    }

    // 3. Test find publications (same query admin makes)
    try {
      const pubs = await payload.find({
        collection: 'publications',
        limit: 1,
        depth: 0,
      })
      results.findPublications = `ok, totalDocs=${pubs.totalDocs}`
    } catch (e: any) {
      results.findPublications = `FAILED: ${e?.message}${e?.cause ? ` | cause: ${e.cause.message || e.cause}` : ''}`
    }

    // 4. Test update with auth user context
    try {
      const pubs = await payload.find({ collection: 'publications', limit: 1, depth: 0 })
      const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
      if (pubs.docs.length > 0 && users.docs.length > 0) {
        const doc = pubs.docs[0]
        await payload.update({
          collection: 'publications',
          id: doc.id,
          data: { title: doc.title as string },
          depth: 0,
          overrideAccess: false,
          user: users.docs[0],
        })
        results.updatePublication = 'ok'
      }
    } catch (e: any) {
      results.updatePublication = `FAILED: ${e?.message}`
    }

    // 5. Test delete (create dummy + delete)
    try {
      const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
      if (users.docs.length > 0) {
        // Create a test tag, then delete it
        const tag = await payload.create({
          collection: 'tags',
          data: { name: `_diag_test_${Date.now()}`, slug: `_diag-test-${Date.now()}` },
          overrideAccess: false,
          user: users.docs[0],
        })
        await payload.delete({
          collection: 'tags',
          id: tag.id,
          overrideAccess: false,
          user: users.docs[0],
        })
        results.createDeleteTag = 'ok'
      }
    } catch (e: any) {
      results.createDeleteTag = `FAILED: ${e?.message}`
    }

    // 6. Check CORS/CSRF config
    results.origin = req.headers.get('origin') || req.headers.get('referer') || 'none'
    results.siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    results.vercelUrl = process.env.VERCEL_URL

    results.status = 'complete'
  } catch (e: any) {
    results.fatalError = e?.message
    results.status = 'error'
  }

  return NextResponse.json(results, { status: 200 })
}
