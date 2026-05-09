import { getPayload } from 'payload'
import config from '@payload-config'

function getR2PublicBaseUrl(): string {
  return (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '')
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Fetch a URL. Returns the response if it exists, null otherwise.
 */
async function fetchUrl(url: string): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    return res.ok ? res : null
  } catch {
    return null
  }
}

function isDocument(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)
}

/**
 * Redirect to a public static file. Checks /documents/ for document types, /images/ otherwise.
 */
function redirectToPublicFile(filename: string): Response {
  const encoded = filename.split('/').map(seg => encodeURIComponent(seg)).join('/')
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bbforpeace.org'
  const dir = isDocument(filename) ? 'documents' : 'images'
  return Response.redirect(`${base}/${dir}/${encoded}`, 307)
}

async function handleMediaFileRequest(filename: string): Promise<Response> {
  const r2BaseUrl = getR2PublicBaseUrl()
  const decodedFilename = safeDecode(filename)

  // Look up media record URL/prefix to preserve existing key behavior.
  let prefix = ''
  let storedUrl = ''
  try {
    const payload = await getPayload({ config })

    // 1st attempt: exact match
    let mediaResult = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        or: [
          { filename: { equals: decodedFilename } },
          { filename: { equals: filename } },
        ],
      },
    })

    // 2nd attempt: some stored filenames include generated suffixes.
    if (!mediaResult.docs.length) {
      const ext = decodedFilename.split('.').pop() || ''
      const nameWithoutExt = decodedFilename.replace(`.${ext}`, '')
      const baseName = nameWithoutExt.replace(/-[A-Za-z0-9_-]{20,}$/, '')
      if (baseName && baseName !== nameWithoutExt) {
        mediaResult = await payload.find({
          collection: 'media',
          depth: 0,
          limit: 1,
          pagination: false,
          where: {
            filename: { contains: baseName },
          },
        })
      }
    }

    // 3rd attempt: search by URL field containing the filename.
    if (!mediaResult.docs.length) {
      mediaResult = await payload.find({
        collection: 'media',
        depth: 0,
        limit: 1,
        pagination: false,
        where: {
          url: { contains: decodedFilename },
        },
      })
    }

    const doc = mediaResult.docs[0] as { prefix?: string; url?: string } | undefined
    prefix = typeof doc?.prefix === 'string' ? doc.prefix : ''
    storedUrl = typeof doc?.url === 'string' ? doc.url : ''
  } catch {
    // If lookup fails, continue with fallback candidates.
  }

  // 0. If the media record already has a public absolute URL, use it directly.
  if (storedUrl && /^https?:\/\//i.test(storedUrl) && !storedUrl.includes('/api/media/file/')) {
    if (isDocument(decodedFilename)) {
      const fileRes = await fetchUrl(storedUrl)
      if (fileRes) {
        return new Response(fileRes.body, {
          headers: {
            'Content-Type': fileRes.headers.get('Content-Type') || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${decodedFilename}"`,
            'Cache-Control': 'public, max-age=86400',
          },
        })
      }
    } else {
      return Response.redirect(storedUrl, 307)
    }
  }

  // 1. Try Cloudflare R2 public URL using known prefixes.
  if (r2BaseUrl) {
    const prefixesToTry = prefix
      ? [prefix, '', 'media']
      : ['', 'media']

    for (const pfx of prefixesToTry) {
      const keyPath = pfx ? `${pfx}/${decodedFilename}` : decodedFilename
      const encodedKey = keyPath.split('/').map(seg => encodeURIComponent(seg)).join('/')
      const r2Url = `${r2BaseUrl}/${encodedKey}`

      const fileRes = await fetchUrl(r2Url)
      if (fileRes) {
        if (isDocument(decodedFilename)) {
          return new Response(fileRes.body, {
            headers: {
              'Content-Type': fileRes.headers.get('Content-Type') || 'application/octet-stream',
              'Content-Disposition': `inline; filename="${decodedFilename}"`,
              'Cache-Control': 'public, max-age=86400',
            },
          })
        }
        return Response.redirect(r2Url, 307)
      }
    }
  }

  // 2. Fall back to public files (CDN/dev server, NOT bundled into function)
  return redirectToPublicFile(decodedFilename)
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}

export async function HEAD(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}