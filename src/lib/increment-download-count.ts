import pg from 'pg'
import { getPreferredDatabaseUrl } from '@/lib/database-url'

export type IncrementDownloadResult = {
  success: boolean
  downloadCount?: number
  error?: string
}

/**
 * Increment download_count for any downloadable CMS document.
 * Publications, annual reports, project reports, and strategic plans
 * all live in the `publications` table (column: download_count).
 *
 * Uses raw SQL because Payload rejects partial updates that only set downloadCount.
 */
export async function incrementPublicationDownloadCount(
  publicationId: number | string,
): Promise<IncrementDownloadResult> {
  const connectionString = getPreferredDatabaseUrl()
  if (!connectionString) {
    return { success: false, error: 'Database URL is not configured' }
  }

  const id = typeof publicationId === 'string' ? parseInt(publicationId, 10) : publicationId
  if (!Number.isFinite(id)) {
    return { success: false, error: 'Invalid publication id' }
  }

  const client = new pg.Client({ connectionString })

  try {
    await client.connect()

    const result = await client.query<{ download_count: number | null }>(
      `UPDATE publications
       SET download_count = COALESCE(download_count, 0) + 1
       WHERE id = $1
       RETURNING download_count`,
      [id],
    )

    if (result.rowCount === 0) {
      return { success: false, error: 'Publication not found' }
    }

    const downloadCount = result.rows[0]?.download_count ?? 0
    return { success: true, downloadCount }
  } catch (error) {
    console.error('Failed to increment download count:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  } finally {
    await client.end().catch(() => {})
  }
}
