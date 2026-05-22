import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    const pub = await payload.findByID({
      collection: 'publications',
      id,
      depth: 0,
      overrideAccess: true,
    })

    const downloadCount = (pub.downloadCount || 0) + 1

    await payload.update({
      collection: 'publications',
      id,
      data: { downloadCount },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, downloadCount })
  } catch (error) {
    console.error('Failed to track download:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
