import { getPayloadClient } from '@/lib/payload-client'

export type IncrementDownloadResult = {
  success: boolean
  downloadCount?: number
  error?: string
}

/**
 * Increment download_count for any downloadable CMS document.
 * All site document types (publications, annual reports, project reports,
 * strategic plans) live in the `publications` collection.
 */
export async function incrementPublicationDownloadCount(
  publicationId: number | string,
): Promise<IncrementDownloadResult> {
  try {
    const payload = await getPayloadClient()

    const pub = await payload.findByID({
      collection: 'publications',
      id: publicationId,
      depth: 0,
      overrideAccess: true,
    })

    const downloadCount = (pub.downloadCount ?? 0) + 1

    await payload.update({
      collection: 'publications',
      id: publicationId,
      data: { downloadCount },
      overrideAccess: true,
      context: {
        trackDownload: true,
      },
    })

    const verified = await payload.findByID({
      collection: 'publications',
      id: publicationId,
      depth: 0,
      overrideAccess: true,
    })

    if (verified.downloadCount === downloadCount) {
      return { success: true, downloadCount }
    }

    console.error(
      'Download count verify failed:',
      publicationId,
      'expected',
      downloadCount,
      'got',
      verified.downloadCount,
    )
    return {
      success: false,
      error: 'Count was not saved to the database',
    }
  } catch (error) {
    console.error('Failed to increment download count:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
