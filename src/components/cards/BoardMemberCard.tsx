'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface BoardMemberCardProps {
  name: string
  position: string
  bio: string
  image: string
  index: number
  imagePosition?: string
}

const gradients = [
  'from-primary-600 to-violet-600',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-sky-500 to-cyan-500',
  'from-fuchsia-500 to-purple-500',
]

const bgGradients = [
  'from-primary-50 to-violet-50',
  'from-emerald-50 to-teal-50',
  'from-rose-50 to-pink-50',
  'from-amber-50 to-orange-50',
  'from-sky-50 to-cyan-50',
  'from-fuchsia-50 to-purple-50',
]

export function BoardMemberCard({ name, position, bio, image, index, imagePosition = 'object-top' }: BoardMemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const gradient = gradients[index % gradients.length]
  const bgGradient = bgGradients[index % bgGradients.length]
  
  // Truncate bio to ~120 characters for preview
  const shouldTruncate = bio.length > 120
  const previewBio = shouldTruncate ? bio.slice(0, 120).trim() + '...' : bio

  return (
    <div 
      className={`group relative bg-linear-to-br ${bgGradient} rounded-3xl overflow-hidden border border-white shadow-lg hover:shadow-2xl transition-all duration-500`}
      data-scroll="scale"
      data-delay={index * 100}
    >
      {/* Profile Image at top */}
      <div className="relative">
        <div className="aspect-4/3 overflow-hidden">
          <Image 
            src={image} 
            alt={name} 
            fill 
            className={`object-cover ${imagePosition} group-hover:scale-105 transition-transform duration-700`} 
          />
          {/* Gradient overlay at bottom */}
          <div className={`absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent`} />
        </div>
        {/* Position badge */}
        <span className={`absolute bottom-3 left-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r ${gradient} text-white shadow-lg`}>
          {position}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Name */}
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3">{name}</h3>
        
        {/* Bio Section */}
        <div className="relative">
          <p className="text-gray-600 text-sm leading-relaxed">
            {isExpanded ? bio : previewBio}
          </p>
          
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold bg-linear-to-r ${gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="w-4 h-4 text-primary-600" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown className="w-4 h-4 text-primary-600" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Top decorative accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradient}`} />
    </div>
  )
}
