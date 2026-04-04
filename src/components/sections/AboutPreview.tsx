'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Target, Eye, CheckCircle, Play } from 'lucide-react'
import { getMediaUrl } from '@/lib/utils'

// Default fallback data
const defaultHighlights = [
  'Youth, Women, Peace and Security',
  'Conflict Prevention & Governance',
  'Peace Education & Empowerment',
  'Climate & Environmental Security',
]

const defaultVideo = {
  id: 'xvQ_AXIQbPM',
  title: 'West Africa Peace and Security Dialogue',
}

// Types for CMS data
interface AboutVideo {
  youtubeId?: string
  title?: string
}

interface AboutImages {
  mainImage?: { url?: string } | string
  secondaryImage?: { url?: string } | string
}

export interface AboutPreviewProps {
  title?: string
  paragraph1?: string
  paragraph2?: string
  highlights?: { text: string }[]
  video?: AboutVideo
  images?: AboutImages
  yearsOfImpact?: string
  mission?: string
  vision?: string
}

export function AboutPreview({
  title = 'Why BBFORPEACE?',
  paragraph1 = 'BBFORPEACE occupies a unique niche as one of the few truly youth-led organizations operating from the grassroots to policy level. We seamlessly link community action, policy advocacy, and regional networking.',
  paragraph2 = 'Founded in 2016, we began as Nigeria Youth 4 Peace Initiative — a movement challenging the exclusion of youth from the decision-making process and advocating for meaningful engagement in peacebuilding.',
  highlights,
  video,
  images,
  yearsOfImpact = '8+',
  mission = 'To equip youth, women and men as peacebuilders to prevent violent conflict and promote sustainable peace.',
  vision = 'A peaceful, just and inclusive Africa where youth, women and men lead resilient communities.',
}: AboutPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Process highlights
  const displayHighlights = highlights?.length 
    ? highlights.map(h => h.text)
    : defaultHighlights

  // Process video
  const aboutVideo = {
    id: video?.youtubeId || defaultVideo.id,
    title: video?.title || defaultVideo.title,
  }

  // Process images
  const mainImage = getMediaUrl(images?.mainImage, '/images/_VEE7009 (1).jpg')
  const secondaryImage = getMediaUrl(images?.secondaryImage, '/images/_VEE7153 (6).jpg')

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          {/* Video/Image */}
          <div className="relative" data-scroll="left">
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gray-900 group">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${aboutVideo.id}?autoplay=1&rel=0`}
                  title={aboutVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <>
                  {/* Main Image as Thumbnail */}
                  <Image
                    src={mainImage}
                    alt="BBFORPEACE team at work"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary-950/70 via-primary-950/20 to-transparent" />
                  
                  {/* Play Button */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-accent-gold flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-primary-950 ml-1" fill="currentColor" />
                    </div>
                  </button>
                  
                  {/* Video Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/80 text-sm mb-1">Watch Video</p>
                    <p className="text-white font-semibold text-lg">{aboutVideo.title}</p>
                  </div>
                </>
              )}
            </div>

            {/* Secondary Image */}
            <div className="absolute -bottom-8 -right-8 w-48 h-36 rounded-xl overflow-hidden shadow-lg border-4 border-white hidden md:block">
              <Image
                src={secondaryImage}
                alt="Community engagement"
                fill
                className="object-cover"
              />
            </div>

            {/* Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-5 shadow-lg border border-gray-100 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-900 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{yearsOfImpact}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Years of</div>
                  <div className="text-sm text-gray-500">Impact</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div data-scroll="right" data-delay="200">
            <span className="inline-block text-sm font-semibold text-primary-900 uppercase tracking-wider mb-4">
              About Us
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {paragraph1}
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {paragraph2}
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {displayHighlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-900 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Vision & Mission */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-900 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Our Mission</h4>
                <p className="text-gray-600 text-sm">{mission}</p>
              </div>
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-accent-gold flex items-center justify-center mb-3">
                  <Eye className="w-5 h-5 text-primary-900" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Our Vision</h4>
                <p className="text-gray-600 text-sm">{vision}</p>
              </div>
            </div>

            <Link 
              href="/about" 
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-primary-900 text-white hover:bg-primary-800 transition-colors"
            >
              Learn More About Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
