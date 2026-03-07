'use client'

import { Play, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const defaultVideos = [
  { youtubeId: 'nggBR0ErutQ', title: 'Youth Peacebuilding Initiative 2024', description: 'Empowering young people as active agents of peace.' },
  { youtubeId: '81lEFT84dDQ', title: 'Community Engagement & Dialogue', description: 'Fostering meaningful dialogue between communities.' },
  { youtubeId: 'xvQ_AXIQbPM', title: 'Building Blocks for Peace: Our Journey', description: 'Discover how BBFORPEACE is transforming communities across Nigeria.' },
]

export interface VideoSectionProps {
  badge?: string
  heading?: string
  description?: string
  videos?: { youtubeId: string; title: string; description?: string | null }[]
}

export function VideoSection({
  badge = 'Media',
  heading = 'Watch Our Impact',
  description = 'See how we are empowering communities and building peaceful societies.',
  videos: videosProp,
}: VideoSectionProps) {
  const allVideos = videosProp?.length ? videosProp : defaultVideos
  const [activeVideoId, setActiveVideoId] = useState(allVideos[0].youtubeId)
  const [isPlaying, setIsPlaying] = useState(false)

  const activeVideo = allVideos.find(v => v.youtubeId === activeVideoId)!
  const sideVideos = allVideos.filter(v => v.youtubeId !== activeVideoId)

  const handleSideVideoClick = (youtubeId: string) => {
    setActiveVideoId(youtubeId)
    setIsPlaying(true)
  }

  const handleMainVideoClick = () => {
    setIsPlaying(true)
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-14" data-scroll="up">
          <span className="inline-flex items-center justify-center gap-3 text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-[2px] bg-primary-900" />
            {badge}
            <span className="w-8 h-[2px] bg-primary-900" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Video Layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Video - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-4" data-scroll="left">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-900 group">
              {isPlaying ? (
                <iframe
                  key={activeVideo.youtubeId}
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${activeVideo.youtubeId}/maxresdefault.jpg`}
                    alt={activeVideo.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <button
                    onClick={handleMainVideoClick}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Play ${activeVideo.title}`}
                  >
                    <div className="w-20 h-20 rounded-full bg-accent-gold hover:bg-yellow-400 flex items-center justify-center transition-all hover:scale-110 shadow-2xl">
                      <Play className="w-9 h-9 text-primary-950 ml-1" fill="currentColor" />
                    </div>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="text-white font-bold text-xl mb-1">{activeVideo.title}</h3>
                    <p className="text-gray-300 text-sm">{activeVideo.description || ''}</p>
                  </div>
                </>
              )}
            </div>

            {/* View All Link - Under main video on desktop */}
            <Link
              href="/gallery?tab=video"
              className="hidden lg:flex items-center justify-center gap-2 py-4 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors"
            >
              View All Videos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Side Videos - Takes 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-4" data-scroll="right">
            {sideVideos.map((video) => (
              <div
                key={video.youtubeId}
                className="relative aspect-video rounded-xl overflow-hidden shadow-md bg-gray-900 group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSideVideoClick(video.youtubeId)}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-accent-gold flex items-center justify-center transition-all group-hover:scale-110">
                    <Play className="w-5 h-5 text-primary-900 group-hover:text-primary-950 ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <h4 className="text-white font-medium text-sm line-clamp-1">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Link - Last on mobile */}
        <Link
          href="/gallery?tab=video"
          className="flex lg:hidden items-center justify-center gap-2 py-4 mt-6 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors"
        >
          View All Videos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
