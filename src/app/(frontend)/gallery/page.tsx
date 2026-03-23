import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
import GalleryContent from './GalleryContent'
import type { GalleryImage, GalleryVideo, GalleryHero } from './GalleryContent'
import { getMediaUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Gallery | BBFORPEACE',
  description: 'Explore our photo and video gallery capturing moments of impact, community engagement, and youth empowerment across Nigeria and West Africa.',
}

const galleryHero: GalleryHero = {
  title: 'Gallery',
  subtitle: 'Media',
  description:
    'Capturing moments of impact, community engagement, and youth empowerment across Nigeria and West Africa.',
  backgroundImage: '/images/_VEE7124.jpg',
  photoTabTitle: 'Photos',
  videoTabTitle: 'Videos',
  youtubeChannelUrl: 'https://www.youtube.com/@bbforpeace',
}

export default async function GalleryPage() {
  let settings: any = {}
  let galleryItems: any[] = []

  try {
    const payload = await getPayloadClient()
    const [pageSettings, galleryResult] = await Promise.all([
      payload.findGlobal({ slug: 'media-page-settings' }),
      payload.find({
        collection: 'gallery-items',
        where: { status: { equals: 'published' } },
        sort: 'order',
        limit: 100,
        depth: 1,
      }),
    ])
    settings = pageSettings
    galleryItems = galleryResult.docs
  } catch (error) {
    console.error('Failed to fetch gallery settings:', error)
  }

  const hero: Partial<GalleryHero> = {
    ...galleryHero,
    photoTabTitle: settings.photoTabTitle || 'Photos',
    videoTabTitle: settings.videoTabTitle || 'Videos',
    youtubeChannelUrl: settings.youtubeChannelUrl || 'https://www.youtube.com/@bbforpeace',
  }

  const images: GalleryImage[] = galleryItems
    .filter((item: any) => item.mediaType === 'photo')
    .map((item: any, idx: number) => ({
      id: String(item.id || idx + 1),
      src: getMediaUrl(item.image, '/images/_VEE6516 (1).jpg'),
      title: item.title || 'Gallery Image',
      category: item.category || 'Events',
    }))

  const videos: GalleryVideo[] = galleryItems
    .filter((item: any) => item.mediaType === 'video' && item.youtubeId)
    .map((item: any) => ({
      id: item.youtubeId,
      title: item.title || 'Video',
      category: item.category || 'Impact',
    }))

  return (
    <GalleryContent
      images={images.length ? images : undefined}
      videos={videos.length ? videos : undefined}
      hero={hero}
    />
  )
}
