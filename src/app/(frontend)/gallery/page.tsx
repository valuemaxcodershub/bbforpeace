'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHero } from '@/components/layout'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Play, Camera, Video } from 'lucide-react'

const galleryImages = [
  { id: '1', src: '/images/_VEE6516 (1).jpg', title: 'Youth Peace Workshop', category: 'Events' },
  { id: '2', src: '/images/_VEE6525.jpg', title: 'Community Dialogue Session', category: 'Community' },
  { id: '3', src: '/images/_VEE6765.jpg', title: 'Regional Peace Summit', category: 'Events' },
  { id: '4', src: '/images/_VEE6792.jpg', title: 'Youth Leadership Training', category: 'Training' },
  { id: '5', src: '/images/_VEE6887 (20).jpg', title: 'Peace Champions Network', category: 'Community' },
  { id: '6', src: '/images/_VEE7009 (1).jpg', title: 'Stakeholder Engagement', category: 'Events' },
  { id: '7', src: '/images/_VEE7017 (19) (1).jpg', title: 'Youth Empowerment Program', category: 'Training' },
  { id: '8', src: '/images/_VEE7037 (1).jpg', title: 'Peace Education Session', category: 'Education' },
  { id: '9', src: '/images/_VEE7124 (1).jpg', title: 'Community Outreach', category: 'Community' },
  { id: '10', src: '/images/_VEE7153 (6).jpg', title: 'Youth Forum', category: 'Events' },
  { id: '11', src: '/images/_VEE7178.jpg', title: 'Capacity Building Workshop', category: 'Training' },
  { id: '12', src: '/images/_VEE7856.jpg', title: 'Environmental Peace Initiative', category: 'Community' },
  { id: '13', src: '/images/_VEE7908.jpg', title: 'Policy Advocacy Meeting', category: 'Advocacy' },
  { id: '14', src: '/images/_VEE7915 (1).jpg', title: 'Regional Networking', category: 'Events' },
  { id: '15', src: '/images/_VEE7927.jpg', title: 'Youth Peace Camp', category: 'Training' },
  { id: '16', src: '/images/_VEE7943.jpg', title: 'Women Peace Builders', category: 'Community' },
  { id: '17', src: '/images/PXL_20251007_102503598.MP.jpg', title: 'WAPSeD Convening', category: 'Events' },
  { id: '18', src: '/images/PXL_20251008_094037931.jpg', title: 'WAYPAN Launch', category: 'Events' },
  { id: '19', src: '/images/PXL_20251008_122828933.jpg', title: 'Award Ceremony', category: 'Awards' },
  { id: '20', src: '/images/PXL_20251023_124331635.MP~2.jpg', title: 'Champions of Peace', category: 'Community' },
]

const galleryVideos = [
  { id: 'xvQ_AXIQbPM', title: 'Building Blocks for Peace: Our Journey', category: 'Impact' },
  { id: 'nggBR0ErutQ', title: 'Youth Peacebuilding Initiative 2024', category: 'Programs' },
  { id: '81lEFT84dDQ', title: 'Community Engagement & Dialogue', category: 'Community' },
]

const photoCategories = ['All', 'Events', 'Training', 'Community', 'Education', 'Advocacy', 'Awards']
const videoCategories = ['All', 'Impact', 'Programs', 'Community']

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo')
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState('All')
  const [selectedVideoCategory, setSelectedVideoCategory] = useState('All')
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)

  // Read tab from URL on mount
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'video') {
      setActiveTab('video')
    }
  }, [searchParams])

  const filteredImages = selectedPhotoCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedPhotoCategory)

  const filteredVideos = selectedVideoCategory === 'All'
    ? galleryVideos
    : galleryVideos.filter(vid => vid.category === selectedVideoCategory)

  const openLightbox = (index: number) => setLightboxImage(index)
  const closeLightbox = () => setLightboxImage(null)
  const nextImage = () => setLightboxImage(prev => prev !== null ? (prev + 1) % filteredImages.length : null)
  const prevImage = () => setLightboxImage(prev => prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null)

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Media"
        description="Capturing moments of impact, community engagement, and youth empowerment across Nigeria and West Africa."
        backgroundImage="/images/_VEE7124.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Gallery', href: '/gallery' },
        ]}
      />

      <section className="py-20">
        <div className="container">
          {/* Main Tabs */}
          <div className="flex justify-center mb-14" data-scroll="up">
            <div className="inline-flex bg-gray-100 rounded-2xl p-2 shadow-inner">
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'photo'
                    ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="w-5 h-5" />
                Photos
                <span className={`ml-1 px-2.5 py-1 rounded-full text-xs ${
                  activeTab === 'photo' ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {galleryImages.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'video'
                    ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Video className="w-5 h-5" />
                Videos
                <span className={`ml-1 px-2.5 py-1 rounded-full text-xs ${
                  activeTab === 'video' ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {galleryVideos.length}
                </span>
              </button>
            </div>
          </div>

          {/* Photo Tab Content */}
          {activeTab === 'photo' && (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12" data-scroll="scale">
                {photoCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedPhotoCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      selectedPhotoCategory === category
                        ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Photo Gallery Grid */}
              <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredImages.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => openLightbox(idx)}
                    className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg"
                    data-scroll="scale"
                    data-delay={idx * 50}
                  >
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-white font-bold">{image.title}</p>
                        <p className="text-gray-300 text-sm">{image.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              </div>
            </>
          )}

          {/* Video Tab Content */}
          {activeTab === 'video' && (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12" data-scroll="scale">
                {videoCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedVideoCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      selectedVideoCategory === category
                        ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Video Gallery Grid */}
              <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video, idx) => (
                  <div
                    key={video.id}
                    className="group relative aspect-video overflow-hidden rounded-2xl shadow-xl bg-gray-900"
                    data-scroll="scale"
                    data-delay={idx * 100}
                  >
                    {playingVideoId === video.id ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                        <button
                          onClick={() => setPlayingVideoId(video.id)}
                          className="absolute inset-0 flex items-center justify-center"
                          aria-label={`Play ${video.title}`}
                        >
                          <div className="w-18 h-18 md:w-22 md:h-22 rounded-full bg-accent-gold hover:bg-yellow-400 flex items-center justify-center transition-all hover:scale-110 shadow-2xl">
                            <Play className="w-9 h-9 md:w-11 md:h-11 text-primary-950 ml-1" fill="currentColor" />
                          </div>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 backdrop-blur-sm">
                            {video.category}
                          </span>
                          <h3 className="text-white font-bold md:text-lg line-clamp-2">{video.title}</h3>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              </div>

              {/* YouTube Channel Link */}
              <div className="text-center mt-14" data-scroll="up">
                <a
                  href="https://www.youtube.com/@bb4peace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-900/30"
                >
                  View More on YouTube
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox for Photos */}
      {lightboxImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <X className="w-7 h-7" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] mx-6">
            <Image
              src={filteredImages[lightboxImage].src}
              alt={filteredImages[lightboxImage].title}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-2xl font-bold">{filteredImages[lightboxImage].title}</p>
              <p className="text-gray-300 font-medium">{filteredImages[lightboxImage].category}</p>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </>
  )
}
