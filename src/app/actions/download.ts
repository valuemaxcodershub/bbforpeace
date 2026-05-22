'use server'

import { incrementPublicationDownloadCount } from '@/lib/increment-download-count'

export async function trackDownload(publicationId: number | string) {
  return incrementPublicationDownloadCount(publicationId)
}
