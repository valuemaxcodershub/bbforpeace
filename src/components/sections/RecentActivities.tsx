import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'

// Placeholder data - will be replaced with actual data from Payload
const recentPosts = [
  {
    id: '1',
    title: 'National Youth Development Award 2025 Recognition',
    excerpt: 'BBFORPEACE receives the National Youth Development Award from the Federal Ministry of Youth Development in recognition of our impact.',
    slug: 'national-youth-development-award-2025',
    featuredImage: '/images/PXL_20251008_095815014~2.jpg',
    category: 'Award',
    publishedAt: '2025-10-08',
  },
  {
    id: '2',
    title: 'West Africa Peace and Security Dialogue (WAPSeD) Regional Convening',
    excerpt: 'Building regional networks to address security challenges including violent extremism, political instability, and climate stress across West Africa.',
    slug: 'wapsed-regional-convening',
    featuredImage: '/images/PXL_20251007_102503598.MP.jpg',
    category: 'Event',
    publishedAt: '2025-10-07',
  },
  {
    id: '3',
    title: 'Champions of Peace Youth Initiative Workshop',
    excerpt: 'Training young peace champions through social media engagement, advocacy, dialogue, and community sensitization programs.',
    slug: 'champions-of-peace-workshop',
    featuredImage: '/images/PXL_20251023_124331635.MP~2.jpg',
    category: 'Workshop',
    publishedAt: '2025-10-23',
  },
]

export function RecentActivities() {
  return (
    <section 
      className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/_VEE7017%20(19)%20(1).jpg)' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-950/85" />

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12" data-scroll="up">
          <div>
            <span className="inline-flex items-center gap-3 text-accent-gold text-sm font-semibold uppercase tracking-widest mb-3">
              <span className="w-8 h-[2px] bg-accent-gold" />
              Latest Updates
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Recent Activities
            </h2>
          </div>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-accent-gold font-medium hover:text-yellow-400 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-accent-gold/50 hover:bg-white/15 transition-all duration-300"
              data-scroll="up"
              data-delay={index * 150}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent-gold text-primary-950 text-xs font-semibold">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-accent-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12" data-scroll="up" data-delay="300">
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-accent-gold text-primary-950 hover:bg-yellow-400 transition-colors"
          >
            View All Activities
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
