'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FileText } from 'lucide-react'
import { DownloadButton } from '@/components/ui/DownloadButton'
import { DownloadCountLabel } from '@/components/ui/DownloadCountLabel'

const gradients = [
  'linear-gradient(135deg, #e5243b, #ff6b6b)',
  'linear-gradient(135deg, #4c9f38, #26bde2)',
  'linear-gradient(135deg, #ffa500, #fcc30b)',
  'linear-gradient(135deg, #1f97d4, #28005b)',
]

interface PublicationCardProps {
  publication: {
    id: string
    title: string
    excerpt?: string
    slug: string
    coverImage: string
    category?: string
    year: number
    downloadCount?: number
    fileUrl?: string
  }
  index?: number
}

export function PublicationCard({ publication, index = 0 }: PublicationCardProps) {
  const gradient = gradients[index % gradients.length]
  
  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
      {/* Top Gradient Bar */}
      <div className="h-1.5 w-full" style={{ background: gradient }} />
      
      <Link href={`/publications/${publication.slug}`}>
        {/* Cover Image */}
        <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
          <Image
            src={publication.coverImage}
            alt={publication.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {publication.fileUrl && (
            <div
              className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <DownloadButton
                publicationId={publication.id}
                fileUrl={publication.fileUrl}
                initialDownloadCount={publication.downloadCount ?? 0}
                showCount={false}
                className="inline-flex items-center px-5 py-2.5 rounded-full text-white font-semibold shadow-lg"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: gradient }}
          >
            {publication.year}
          </span>
          {publication.category && (
            <span className="inline-flex items-center text-xs text-gray-500">
              <FileText className="w-3 h-3 mr-1" />
              {publication.category}
            </span>
          )}
        </div>
        <Link href={`/publications/${publication.slug}`}>
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary-900 transition-colors">
            {publication.title}
          </h3>
        </Link>
        {publication.excerpt && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {publication.excerpt}
          </p>
        )}
        <DownloadCountLabel
          count={publication.downloadCount ?? 0}
          className="text-xs text-gray-500 mt-3 block"
        />
      </div>
    </article>
  )
}
