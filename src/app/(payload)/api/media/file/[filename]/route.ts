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
 * Check if a blob URL actually exists (HEAD request with timeout).
 */
async function blobExists(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(timeout)
    return res.ok
  } catch {
    return false
  }
}

/**
 * Redirect to the file in public/images/ (served by CDN on Vercel, by dev server locally).
 * No fs/path imports — avoids bundling public/images/ into the serverless function.
 */
function redirectToPublicImage(filename: string): Response {
  const encoded = filename.split('/').map(seg => encodeURIComponent(seg)).join('/')
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bbforpeace.org'
  return Response.redirect(`${base}/images/${encoded}`, 307)
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

    if (await blobExists(blobUrl)) {
      return Response.redirect(blobUrl, 307)
    }

    // Also try without prefix (some files were uploaded without one)
    if (prefix) {
      const noPrefixUrl = `${baseUrl}/${encodeURIComponent(decodedFilename)}`
      if (await blobExists(noPrefixUrl)) {
        return Response.redirect(noPrefixUrl, 307)
      }
    }
  }

  // 2. Fall back to public/images/ (served by CDN/dev server, NOT bundled into function)
  return redirectToPublicImage(decodedFilename)
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}

export async function HEAD(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}