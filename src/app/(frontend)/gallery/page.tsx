import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import GalleryContent from './GalleryContent'
import type { GalleryImage, GalleryVideo, GalleryHero } from './GalleryContent'

export const metadata: Metadata = {
  title: 'Gallery | BBFORPEACE',
  description: 'Explore our photo and video gallery capturing moments of impact, community engagement, and youth empowerment across Nigeria and West Africa.',
}

export default async function GalleryPage() {
  const payload = await getPayload({ config })

  let settings: any = {}

  try {
    settings = await payload.findGlobal({ slug: 'media-page-settings' })
  } catch (error) {
    console.error('Failed to fetch gallery settings:', error)
  }

  const getImageUrl = (media: any) => {
    if (!media) return null
    if (typeof media === 'object' && media.url) return media.url
    return media
  }

  // Build hero data from CMS
  const hero: Partial<GalleryHero> = {
    title: settings.galleryTitle || 'Gallery',
    subtitle: settings.gallerySubtitle || 'Media',
    description: settings.galleryDescription || 'Capturing moments of impact, community engagement, and youth empowerment across Nigeria and West Africa.',
    backgroundImage: getImageUrl(settings.galleryBackgroundImage) || '/images/_VEE7124.jpg',
    photoTabTitle: settings.photoTabTitle || 'Photos',
    videoTabTitle: settings.videoTabTitle || 'Videos',
    youtubeChannelUrl: settings.youtubeChannelUrl || 'https://www.youtube.com/@bbforpeace',
  }

  // Map CMS gallery images to the shape the client component expects
  const images: GalleryImage[] = settings.galleryImages?.length
    ? settings.galleryImages.map((item: any, idx: number) => ({
        id: String(item.id || idx + 1),
        src: getImageUrl(item.image) || '/images/_VEE6516 (1).jpg',
        title: item.title || 'Gallery Image',
        category: item.category || 'Events',
      }))
    : []

  // Map CMS gallery videos
  const videos: GalleryVideo[] = settings.galleryVideos?.length
    ? settings.galleryVideos.map((item: any, idx: number) => ({
        id: item.youtubeId || '',
        title: item.title || 'Video',
        category: item.category || 'Impact',
      }))
    : []

  return (
    <GalleryContent
      images={images.length ? images : undefined}
      videos={videos.length ? videos : undefined}
      hero={hero}
    />
  )
}
