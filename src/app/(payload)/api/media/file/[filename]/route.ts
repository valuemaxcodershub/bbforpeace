import { getPayload } from 'payload'
import config from '@payload-config'

function getBlobBaseUrl(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  const storeMatch = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)

  if (!storeMatch) {
    return null
  }

  return `https://${storeMatch[1].toLowerCase()}.public.blob.vercel-storage.com`
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Fetch a blob URL. Returns the response if it exists, null otherwise.
 */
async function fetchBlob(url: string): Promise<Response | null> {
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
  const baseUrl = getBlobBaseUrl()
  const decodedFilename = safeDecode(filename)

  // Look up the media record to get its stored URL and prefix.
  // With addRandomSuffix, the URL filename has a hash suffix that may not
  // match the DB filename, so we also try a `contains` lookup using the
  // base name (before the Blob suffix).
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

    // 2nd attempt: the URL filename contains a Blob random suffix.
    // Extract the base name (before the suffix hash) and search by contains.
    if (!mediaResult.docs.length) {
      const ext = decodedFilename.split('.').pop() || ''
      const nameWithoutExt = decodedFilename.replace(`.${ext}`, '')
      // Blob suffix pattern: original-name + hyphen + long random string
      // Try matching on the first meaningful part of the filename
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

    // 3rd attempt: search by URL field containing the filename
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
    // If Payload lookup fails, continue with empty prefix
  }

  // 0. If the media record already has a full Blob URL, use it directly
  //    (handles addRandomSuffix filenames that don't match the original)
  if (storedUrl && storedUrl.includes('.blob.vercel-storage.com')) {
    if (isDocument(decodedFilename)) {
      const blobRes = await fetchBlob(storedUrl)
      if (blobRes) {
        return new Response(blobRes.body, {
          headers: {
            'Content-Type': blobRes.headers.get('Content-Type') || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${decodedFilename}"`,
            'Cache-Control': 'public, max-age=86400',
          },
        })
      }
    } else {
      return Response.redirect(storedUrl, 307)
    }
  }

  // 1. Try Vercel Blob directly using the URL filename
  //    Try with known prefixes: no prefix, then "media/"
  if (baseUrl) {
    const prefixesToTry = prefix
      ? [prefix, '', 'media']
      : ['', 'media']

    for (const pfx of prefixesToTry) {
      const fileKey = pfx
        ? `${pfx}/${encodeURIComponent(decodedFilename)}`
        : encodeURIComponent(decodedFilename)
      const blobUrl = `${baseUrl}/${fileKey}`

      const blobRes = await fetchBlob(blobUrl)
      if (blobRes) {
        if (isDocument(decodedFilename)) {
          return new Response(blobRes.body, {
            headers: {
              'Content-Type': blobRes.headers.get('Content-Type') || 'application/octet-stream',
              'Content-Disposition': `inline; filename="${decodedFilename}"`,
              'Cache-Control': 'public, max-age=86400',
            },
          })
        }
        return Response.redirect(blobUrl, 307)
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