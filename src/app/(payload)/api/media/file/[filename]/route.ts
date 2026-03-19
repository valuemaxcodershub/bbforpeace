import path from 'path'
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

async function handleMediaFileRequest(filename: string): Promise<Response> {
  const baseUrl = getBlobBaseUrl()

  if (!baseUrl) {
    return Response.json({ message: 'Blob storage is not configured' }, { status: 404 })
  }

  const payload = await getPayload({ config })
  const decodedFilename = safeDecode(filename)

  const mediaResult = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      or: [
        {
          filename: {
            equals: decodedFilename,
          },
        },
        {
          filename: {
            equals: filename,
          },
        },
      ],
    },
  })

  const doc = mediaResult.docs[0] as { prefix?: string } | undefined
  const prefix = typeof doc?.prefix === 'string' ? doc.prefix : ''
  const fileKey = path.posix.join(prefix, encodeURIComponent(decodedFilename))

  return Response.redirect(`${baseUrl}/${fileKey}`, 307)
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}

export async function HEAD(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  return handleMediaFileRequest(filename)
}