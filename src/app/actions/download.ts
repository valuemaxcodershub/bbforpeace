'use server'

import { getPayloadClient } from '@/lib/payload-client'

export async function trackDownload(publicationId: number | string) {
  try {
    const payload = await getPayloadClient()
    const pub = await payload.findByID({
      collection: 'publications',
      id: publicationId,
      depth: 0,
    })

    const downloadCount = (pub.downloadCount || 0) + 1

    await payload.update({
      collection: 'publications',
      id: publicationId,
      data: { downloadCount },
    })

    return { success: true, downloadCount }
  } catch (error) {
    console.error('Failed to track download:', error)
    return { success: false }
  }
}
