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

  // Look up the media record to get prefix (if any)
  let prefix = ''
  try {
    const payload = await getPayload({ config })
    const mediaResult = await payload.find({
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
    const doc = mediaResult.docs[0] as { prefix?: string } | undefined
    prefix = typeof doc?.prefix === 'string' ? doc.prefix : ''
  } catch {
    // If Payload lookup fails, continue with empty prefix
  }

  // 1. Try Vercel Blob first
  if (baseUrl) {
    const fileKey = prefix
      ? `${prefix}/${encodeURIComponent(decodedFilename)}`
      : encodeURIComponent(decodedFilename)
    const blobUrl = `${baseUrl}/${fileKey}`

    const blobRes = await fetchBlob(blobUrl)
    if (blobRes) {
      // For documents (PDFs etc), proxy the content to avoid CORS preflight issues.
      // For images, redirect is fine — browsers handle image redirects without CORS.
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

    // Also try without prefix (some files were uploaded without one)
    if (prefix) {
      const noPrefixUrl = `${baseUrl}/${encodeURIComponent(decodedFilename)}`
      const noPrefixRes = await fetchBlob(noPrefixUrl)
      if (noPrefixRes) {
        if (isDocument(decodedFilename)) {
          return new Response(noPrefixRes.body, {
            headers: {
              'Content-Type': noPrefixRes.headers.get('Content-Type') || 'application/octet-stream',
              'Content-Disposition': `inline; filename="${decodedFilename}"`,
              'Cache-Control': 'public, max-age=86400',
            },
          })
        }
        return Response.redirect(noPrefixUrl, 307)
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