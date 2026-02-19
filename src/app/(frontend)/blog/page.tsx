import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout'
import { Search, Filter, Calendar, ArrowRight, Tag, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog & Activities | BBFORPEACE',
  description:
    'Read the latest news, stories, and updates from Building Blocks for Peace Foundation. Stay informed about our peacebuilding activities across Nigeria.',
}

// Placeholder posts with actual images
const posts = [
  {
    id: '1',
    title: 'Youth Peace Summit 2024: Building Bridges Across Communities',
    excerpt:
      'Over 500 young people gathered for a three-day summit focused on dialogue and understanding. The summit brought together diverse voices to chart a path forward for youth-led peacebuilding.',
    slug: 'youth-peace-summit-2024',
    featuredImage: '/images/_VEE7124 (1).jpg',
    category: 'Events',
    publishedAt: '2024-01-15',
    readTime: '5 min read',
    author: 'BBFORPEACE Team',
  },
  {
    id: '2',
    title: 'New Partnership with GPPAC West Africa Strengthened',
    excerpt:
      'BBFORPEACE continues its role as GPPAC West Africa Regional Secretariat, coordinating peacebuilding efforts across the region.',
    slug: 'gppac-partnership',
    featuredImage: '/images/_VEE7037 (1).jpg',
    category: 'News',
    publishedAt: '2024-01-10',
    readTime: '4 min read',
    author: 'BBFORPEACE Team',
  },
  {
    id: '3',
    title: 'Community Dialogue Series Launches in Northern Nigeria',
    excerpt:
      'Our new dialogue series brings together diverse communities for meaningful conversations on conflict prevention.',
    slug: 'community-dialogue-series',
    featuredImage: '/images/_VEE7017 (19) (1).jpg',
    category: 'Programs',
    publishedAt: '2024-01-05',
    readTime: '3 min read',
    author: 'BBFORPEACE Team',
  },
  {
    id: '4',
    title: 'Peace Education Workshop for Teachers',
    excerpt:
      'Training educators to integrate peace education into their classrooms and empower the next generation.',
    slug: 'peace-education-workshop',
    featuredImage: '/images/_VEE7153 (6).jpg',
    category: 'Training',
    publishedAt: '2024-01-01',
    readTime: '6 min read',
    author: 'BBFORPEACE Team',
  },
  {
    id: '5',
    title: 'National Youth Development Award 2025',
    excerpt:
      'BBFORPEACE receives recognition from the Federal Ministry of Youth Development for outstanding contributions to youth peacebuilding.',
    slug: 'national-youth-award',
    featuredImage: '/images/PXL_20251008_122828933.jpg',
    category: 'Awards',
    publishedAt: '2023-12-28',
    readTime: '3 min read',
    author: 'BBFORPEACE Team',
  },
  {
    id: '6',
    title: 'Volunteer Spotlight: Meet Our Peace Champions',
    excerpt:
      'Celebrating the dedication and impact of our volunteer network across 36 states.',
    slug: 'volunteer-spotlight',
    featuredImage: '/images/_VEE6887 (20).jpg',
    category: 'Stories',
    publishedAt: '2023-12-20',
    readTime: '4 min read',
    author: 'BBFORPEACE Team',
  },
]

const categories = [
  'All',
  'News',
  'Events',
  'Programs',
  'Training',
  'Stories',
  'Awards',
]

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog & Activities"
        subtitle="Latest News"
        description="Stay updated with the latest news, stories, and insights from our peacebuilding work across Nigeria."
        backgroundImage="/images/_VEE6792.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
        ]}
      />

      {/* Filters */}
        <section className="py-6 border-b bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 transition-all"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      category === 'All'
                        ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
            <Link href={`/blog/${posts[0].slug}`} className="group block" data-scroll="up">
              <div className="grid lg:grid-cols-2 gap-0 items-stretch bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[450px]">
                  <Image 
                    src={posts[0].featuredImage} 
                    alt={posts[0].title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 to-transparent lg:opacity-0 group-hover:lg:opacity-100 transition-opacity" />
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-accent-gold text-primary-950 shadow-lg">
                      <Tag className="w-3.5 h-3.5" />
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-primary-100 text-primary-900 mb-5 w-fit">
                    {posts[0].category}
                  </span>
                  <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary-900 transition-colors leading-tight">
                    {posts[0].title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 line-clamp-3">{posts[0].excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(posts[0].publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {posts[0].readTime}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-primary-900 font-bold group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                Recent Posts
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Articles</h2>
            </div>
            <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group" data-scroll="scale" data-delay={idx * 100}>
                  <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all h-full flex flex-col border border-gray-100">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image 
                        src={post.featuredImage} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-primary-900 shadow-lg backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white/90 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-5 flex-1">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-2 text-sm text-primary-900 font-bold mt-auto">
                        Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center" data-scroll="up">
              <nav className="flex items-center gap-2">
                <button className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-white hover:border-primary-200 disabled:opacity-50 bg-white font-semibold transition-all">
                  Previous
                </button>
                <button className="w-11 h-11 bg-primary-900 text-white rounded-xl font-bold shadow-lg shadow-primary-900/30">
                  1
                </button>
                <button className="w-11 h-11 border border-gray-200 rounded-xl text-gray-700 hover:bg-primary-50 hover:border-primary-200 bg-white font-semibold transition-all">
                  2
                </button>
                <button className="w-11 h-11 border border-gray-200 rounded-xl text-gray-700 hover:bg-primary-50 hover:border-primary-200 bg-white font-semibold transition-all">
                  3
                </button>
                <button className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:border-primary-200 bg-white font-semibold transition-all">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section 
          className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-primary-950/95" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-6">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Stay Informed
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Never Miss an Update
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                Subscribe to our newsletter for the latest news and stories delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 border-0 rounded-xl focus:ring-2 focus:ring-accent-gold bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-400 font-medium"
                />
                <button type="submit" className="px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent-gold/30">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
    </>
  )
}
