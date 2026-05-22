import { NextResponse } from 'next/server'
import { incrementPublicationDownloadCount } from '@/lib/increment-download-count'

/** Track downloads for any CMS document with a file (publications, annual/project reports, strategic plans). */

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await incrementPublicationDownloadCount(id)

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error ?? 'Failed to track download' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true, downloadCount: result.downloadCount })
}
