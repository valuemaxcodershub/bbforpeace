import path from 'path'
import fs from 'fs'
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
 * Try to serve the file from the local public/images directory.
 * Works both locally (filesystem) and on Vercel (bundled static assets).
 */
function tryLocalFile(filename: string): Response | null {
  // In production (Vercel), static files are served by the CDN at /images/...
  // We redirect to the public path so Next.js / Vercel handles it.
  // Check a few possible sub-paths the file might live under.
  const possiblePaths = [
    filename,                    // e.g. "_VEE6792.jpg"
    `board/${filename}`,         // e.g. "board/Rafiu Adeniran Lawal.jpeg"
    `ourteam/${filename}`,       // e.g. "ourteam/1. Rafiu Adeniran Lawal.jpeg"
    `reports/${filename}`,       // e.g. "reports/2025 annual report.PNG"
    `partners/${filename}`,
  ]

  // On Vercel, we can't read the filesystem — redirect to /images/<path>
  // The static files in public/images/ are served by the CDN.
  if (process.env.VERCEL) {
    // Encode each path segment separately so slashes are preserved
    const encoded = filename.split('/').map(seg => encodeURIComponent(seg)).join('/')
    const publicPath = `/images/${encoded}`
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bbforpeace.org'
    return Response.redirect(`${base}${publicPath}`, 307)
  }

  // Local dev: try actual filesystem
  const publicDir = path.join(process.cwd(), 'public', 'images')
  for (const rel of possiblePaths) {
    const fullPath = path.join(publicDir, rel)
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase()
      const mimeMap: Record<string, string> = {
        '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf', '.jfif': 'image/jpeg',
      }
      const contentType = mimeMap[ext] || 'application/octet-stream'
      const data = fs.readFileSync(fullPath)
      return new Response(data, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  }
  return null
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
    const fileKey = path.posix.join(prefix, encodeURIComponent(decodedFilename))
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

  // 2. Fall back to local public/images/ files
  const localResponse = tryLocalFile(decodedFilename)
  if (localResponse) {
    return localResponse
  }

  return Response.json(
    { message: `File not found: ${decodedFilename}` },
    { status: 404 },
  )
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}

export async function HEAD(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}