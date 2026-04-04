import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { ArrowRight, Calendar } from 'lucide-react'

const gradients = [
  'linear-gradient(135deg, #e5243b, #ff6b6b)',
  'linear-gradient(135deg, #4c9f38, #26bde2)',
  'linear-gradient(135deg, #ffa500, #fcc30b)',
  'linear-gradient(135deg, #1f97d4, #28005b)',
]

interface BlogCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    slug: string
    featuredImage: string
    category?: string
    publishedAt: string
  }
  index?: number
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const gradient = gradients[index % gradients.length]
  
  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <Link href={`/blog/${post.slug}`}>
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          {post.category && (
            <div 
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: gradient }}
            >
              {post.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4" />
            {formatDate(post.publishedAt)}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-900 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-primary-900 group-hover:text-primary-700">
            Read more
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Bottom Gradient Bar */}
        <div className="h-1 w-full" style={{ background: gradient }} />
      </Link>
    </article>
  )
}
