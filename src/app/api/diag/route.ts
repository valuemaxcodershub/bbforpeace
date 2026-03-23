import { NextRequest, NextResponse } from 'next/server'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@payload-config'
import { getDatabaseUrlDiagnostics } from '@/lib/database-url'
import type { Post, Publication } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const formatError = (error: unknown): string => {
  if (!error) return 'Unknown error'

  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause
    const causeMessage = cause instanceof Error ? ` | cause: ${cause.message}` : ''
    return `${error.message}${causeMessage}`
  }

  if (typeof error === 'object' && error !== null) {
    const message = 'message' in error ? String((error as { message?: unknown }).message) : String(error)
    const cause = 'cause' in error ? (error as { cause?: unknown }).cause : undefined
    const causeMessage = cause instanceof Error ? ` | cause: ${cause.message}` : ''
    return `${message}${causeMessage}`
  }

  return String(error)
}

const asId = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value)
  if (value && typeof value === 'object' && 'id' in value) {
    const nestedId = (value as { id?: unknown }).id
    if (typeof nestedId === 'number') return nestedId
    if (typeof nestedId === 'string' && /^\d+$/.test(nestedId)) return Number(nestedId)
  }
  return undefined
}

const asIdArray = (value: unknown): number[] | undefined => {
  if (!Array.isArray(value)) return undefined

  const ids = value
    .map((item) => asId(item))
    .filter((item): item is number => item !== undefined)

  return ids.length > 0 ? ids : undefined
}

type LexicalContent = Post['content'] | Publication['description']

const hasLexicalContent = (value: unknown): value is LexicalContent => {
  return Boolean(value && typeof value === 'object' && 'root' in value)
}

const fallbackLexicalContent: LexicalContent = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Diagnostic content',
            version: 1,
          },
        ],
      },
    ],
  },
}

/**
 * Diagnostic endpoint — tests authentication and CRUD through Payload,
 * exactly as the admin panel would. Access while logged-in to the admin
 * so the payload-token cookie is sent.
 *
 * GET /api/diag → returns auth status + CRUD test results
 */
export async function GET(req: NextRequest) {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    db: getDatabaseUrlDiagnostics(),
  }

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
      results.findPublications = `FAILED: ${formatError(e)}`
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
      results.updatePublication = `FAILED: ${formatError(e)}`
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
      results.createDeleteTag = `FAILED: ${formatError(e)}`
    }

    // 6. Internal CRUD smoke tests against the exact content collections the admin uses.
    // These run with overrideAccess so we can isolate DB/schema failures from auth/access.
    try {
      const internalCrud: Record<string, string> = {}
      const [posts, publications, media, categories] = await Promise.all([
        payload.find({ collection: 'posts', limit: 1, depth: 0, overrideAccess: true }),
        payload.find({ collection: 'publications', limit: 1, depth: 0, overrideAccess: true }),
        payload.find({ collection: 'media', limit: 1, depth: 0, overrideAccess: true }),
        payload.find({ collection: 'categories', limit: 1, depth: 0, overrideAccess: true }),
      ])

      try {
        const createdTag = await payload.create({
          collection: 'tags',
          overrideAccess: true,
          depth: 0,
          data: {
            name: `_diag_tag_${Date.now()}`,
            slug: `_diag-tag-${Date.now()}`,
          },
        })

        await payload.update({
          collection: 'tags',
          id: createdTag.id,
          overrideAccess: true,
          depth: 0,
          data: { name: `${createdTag.name} updated` },
        })

        await payload.delete({
          collection: 'tags',
          id: createdTag.id,
          overrideAccess: true,
        })

        internalCrud.tags = 'ok'
      } catch (error) {
        internalCrud.tags = `FAILED: ${formatError(error)}`
      }

      try {
        const sourcePublication = publications.docs[0] as unknown as Record<string, unknown> | undefined
        if (!sourcePublication) {
          internalCrud.publicationUpdate = 'SKIPPED: no publication exists'
        } else {
          await payload.update({
            collection: 'publications',
            id: sourcePublication.id as number | string,
            overrideAccess: true,
            depth: 0,
            data: {
              title: String(sourcePublication.title || 'Diagnostic publication'),
            },
          })

          internalCrud.publicationUpdate = 'ok'
        }
      } catch (error) {
        internalCrud.publicationUpdate = `FAILED: ${formatError(error)}`
      }

      try {
        const publication14 = await payload.findByID({
          collection: 'publications',
          id: 14,
          depth: 0,
          overrideAccess: true,
        })

        const publication14Data: RequiredDataFromCollectionSlug<'publications'> = {
          title: publication14.title,
          slug: publication14.slug,
          coverImage: asId(publication14.coverImage) as number,
          file: asId(publication14.file) as number,
          description: publication14.description,
          excerpt: publication14.excerpt || undefined,
          category: publication14.category,
          menuSection: publication14.menuSection,
          subMenu: publication14.subMenu,
          year: publication14.year,
        }

        if (publication14.author) publication14Data.author = publication14.author
        if (publication14.region) publication14Data.region = publication14.region
        if (typeof publication14.pages === 'number') publication14Data.pages = publication14.pages
        if (publication14.accentColor) publication14Data.accentColor = publication14.accentColor
        if (publication14.seo) publication14Data.seo = publication14.seo
        if (typeof publication14.isFeatured === 'boolean') publication14Data.isFeatured = publication14.isFeatured

        await payload.update({
          collection: 'publications',
          id: 14,
          overrideAccess: true,
          depth: 0,
          data: publication14Data,
        })

        internalCrud.publication14RoundTrip = 'ok'
      } catch (error) {
        internalCrud.publication14RoundTrip = `FAILED: ${formatError(error)}`
      }

      try {
        const sourcePost = posts.docs[0] as unknown as Record<string, unknown> | undefined
        const fallbackMediaId = asId(media.docs[0])
        const fallbackCategoryId = asId(categories.docs[0])
        const featuredImageId = asId(sourcePost?.featuredImage) || fallbackMediaId
        const categoryId = asId(sourcePost?.category) || fallbackCategoryId

        if (!sourcePost && (!fallbackMediaId || !fallbackCategoryId)) {
          internalCrud.postCreate = 'SKIPPED: no source post/media/category available'
        } else if (!featuredImageId || !categoryId) {
          internalCrud.postCreate = 'SKIPPED: missing featuredImage/category ids'
        } else {
          const timestamp = Date.now()
          const postData: RequiredDataFromCollectionSlug<'posts'> = {
            title: `Diagnostic Post ${timestamp}`,
            slug: `diagnostic-post-${timestamp}`,
            featuredImage: featuredImageId,
            excerpt: String(sourcePost?.excerpt || 'Diagnostic post excerpt'),
            content: hasLexicalContent(sourcePost?.content) ? sourcePost.content : fallbackLexicalContent,
            category: categoryId,
            status: 'draft',
            menuSection: String(sourcePost?.menuSection || 'media') as 'about-us' | 'media' | 'report',
            subMenu: String(sourcePost?.subMenu || 'blog') as
              | 'who-we-are'
              | 'our-strategy'
              | 'our-team'
              | 'blog'
              | 'press-statement'
              | 'gallery-photo'
              | 'gallery-video'
              | 'publication'
              | 'annual-report'
              | 'project-report'
              | 'strategic-plan',
            publishedAt: new Date().toISOString(),
          }

          const tagIds = asIdArray(sourcePost?.tags)
          if (tagIds) postData.tags = tagIds

          const authorId = asId(sourcePost?.author)
          if (authorId) postData.author = authorId

          if (sourcePost?.seo && typeof sourcePost.seo === 'object') {
            postData.seo = sourcePost.seo as RequiredDataFromCollectionSlug<'posts'>['seo']
          }

          const createdPost = await payload.create({
            collection: 'posts',
            overrideAccess: true,
            depth: 0,
            draft: false,
            data: postData,
          })

          await payload.update({
            collection: 'posts',
            id: createdPost.id,
            overrideAccess: true,
            depth: 0,
            data: {
              excerpt: 'Diagnostic post updated',
            },
          })

          await payload.delete({
            collection: 'posts',
            id: createdPost.id,
            overrideAccess: true,
          })

          internalCrud.postCreate = 'ok'
        }
      } catch (error) {
        internalCrud.postCreate = `FAILED: ${formatError(error)}`
      }

      try {
        const sourcePublication = publications.docs[0] as unknown as Record<string, unknown> | undefined
        const coverImageId = asId(sourcePublication?.coverImage)
        const fileId = asId(sourcePublication?.file)

        if (!sourcePublication) {
          internalCrud.publicationCreate = 'SKIPPED: no publication exists'
        } else if (!coverImageId || !fileId) {
          internalCrud.publicationCreate = 'SKIPPED: missing coverImage/file ids'
        } else {
          const timestamp = Date.now()
          const publicationData: RequiredDataFromCollectionSlug<'publications'> = {
            title: `Diagnostic Publication ${timestamp}`,
            slug: `diagnostic-publication-${timestamp}`,
            coverImage: coverImageId,
            file: fileId,
            description: hasLexicalContent(sourcePublication.description)
              ? sourcePublication.description
              : fallbackLexicalContent,
            excerpt: String(sourcePublication.excerpt || 'Diagnostic publication excerpt'),
            category: String(sourcePublication.category || 'report') as
              | 'research'
              | 'report'
              | 'policy-brief'
              | 'factsheet'
              | 'manual'
              | 'other',
            menuSection: 'report',
            subMenu: String(sourcePublication.subMenu || 'publication') as
              | 'publication'
              | 'annual-report'
              | 'project-report'
              | 'strategic-plan',
            year: Number(sourcePublication.year || new Date().getFullYear()),
          }

          if (sourcePublication.author) publicationData.author = String(sourcePublication.author)
          if (sourcePublication.region) publicationData.region = String(sourcePublication.region)
          if (typeof sourcePublication.pages === 'number') publicationData.pages = sourcePublication.pages
          if (sourcePublication.accentColor) {
            publicationData.accentColor = String(sourcePublication.accentColor) as 'blue' | 'emerald' | 'purple' | 'amber'
          }
          if (sourcePublication.seo && typeof sourcePublication.seo === 'object') {
            publicationData.seo = sourcePublication.seo as RequiredDataFromCollectionSlug<'publications'>['seo']
          }
          publicationData.isFeatured = false

          const createdPublication = await payload.create({
            collection: 'publications',
            overrideAccess: true,
            depth: 0,
            draft: false,
            data: publicationData,
          })

          await payload.update({
            collection: 'publications',
            id: createdPublication.id,
            overrideAccess: true,
            depth: 0,
            data: {
              excerpt: 'Diagnostic publication updated',
            },
          })

          await payload.delete({
            collection: 'publications',
            id: createdPublication.id,
            overrideAccess: true,
          })

          internalCrud.publicationCreate = 'ok'
        }
      } catch (error) {
        internalCrud.publicationCreate = `FAILED: ${formatError(error)}`
      }

      results.internalCrud = internalCrud
    } catch (error) {
      results.internalCrud = `FAILED: ${formatError(error)}`
    }

    // 7. Check CORS/CSRF config
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
