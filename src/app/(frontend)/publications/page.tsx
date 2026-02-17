import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout'
import { Search, Filter, FileText, Download, Calendar, ArrowRight, BookOpen, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Publications & Resources | BB4Peace',
  description:
    'Access research papers, reports, and educational materials from Building Blocks for Peace Foundation.',
}

// Placeholder publications with actual images
const publications = [
  {
    id: '1',
    title: 'Youth Peacebuilding in Nigeria: A Comprehensive Guide',
    excerpt: 'A detailed guide on engaging young people in peacebuilding activities and conflict prevention.',
    slug: 'youth-peacebuilding-guide',
    coverImage: '/images/_VEE7124 (1).jpg',
    category: 'Guides',
    year: 2024,
    downloadCount: 1250,
  },
  {
    id: '2',
    title: 'Annual Impact Report 2023',
    excerpt: 'Our achievements, challenges, and lessons learned from 2023.',
    slug: 'annual-report-2023',
    coverImage: '/images/_VEE6792.jpg',
    category: 'Reports',
    year: 2024,
    downloadCount: 890,
  },
  {
    id: '3',
    title: 'Community Dialogue Toolkit',
    excerpt: 'Step-by-step toolkit for facilitating community dialogue sessions.',
    slug: 'community-dialogue-toolkit',
    coverImage: '/images/_VEE7017 (19) (1).jpg',
    category: 'Toolkits',
    year: 2023,
    downloadCount: 2100,
  },
  {
    id: '4',
    title: 'Peace Education Curriculum',
    excerpt: 'A comprehensive curriculum for integrating peace education in schools.',
    slug: 'peace-education-curriculum',
    coverImage: '/images/_VEE7153 (6).jpg',
    category: 'Curriculum',
    year: 2023,
    downloadCount: 3500,
  },
  {
    id: '5',
    title: 'Conflict Analysis Framework',
    excerpt: 'Tools and methods for analyzing conflict dynamics in communities.',
    slug: 'conflict-analysis-framework',
    coverImage: '/images/_VEE7037 (1).jpg',
    category: 'Research',
    year: 2023,
    downloadCount: 1800,
  },
  {
    id: '6',
    title: 'GPPAC West Africa Strategy',
    excerpt: 'Strategic framework for regional peacebuilding network.',
    slug: 'gppac-strategy',
    coverImage: '/images/_VEE6887 (20).jpg',
    category: 'Strategies',
    year: 2022,
    downloadCount: 950,
  },
]

const categories = ['All', 'Reports', 'Guides', 'Toolkits', 'Research', 'Curriculum']
const years = ['All Years', '2024', '2023', '2022', '2021']

export default function PublicationsPage() {
  return (
    <>
      <PageHero
        title="Publications & Resources"
        subtitle="Knowledge Hub"
        description="Access our research papers, reports, toolkits, and educational materials on peacebuilding and conflict resolution."
        backgroundImage="/images/_VEE7037 (1).jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
        ]}
      />

        {/* Stats Bar */}
        <section className="py-12 bg-white border-b">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24" data-scroll="up">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-200 to-primary-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-primary-900" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <p className="text-sm text-gray-500 font-medium">Publications</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-200 to-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download className="w-7 h-7 text-green-700" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">15K+</div>
                  <p className="text-sm text-gray-500 font-medium">Downloads</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <Eye className="w-7 h-7 text-blue-700" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <p className="text-sm text-gray-500 font-medium">Readers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <div className="container">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search publications..."
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Year Filter */}
                <select className="px-5 py-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 text-sm font-medium">
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                        category === 'All'
                          ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                          : 'bg-white text-gray-700 hover:bg-primary-100 hover:text-primary-900 border border-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Publication */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-0 items-stretch bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-3xl overflow-hidden shadow-xl" data-scroll="up">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                <Image 
                  src={publications[0].coverImage} 
                  alt={publications[0].title} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950/30 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-accent-gold text-primary-950 shadow-lg">
                    <BookOpen className="w-3.5 h-3.5" />
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-primary-200 text-primary-900">
                    {publications[0].category}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                    <Calendar className="w-4 h-4" />
                    {publications[0].year}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                  {publications[0].title}
                </h2>
                <p className="text-gray-600 text-lg mb-8">{publications[0].excerpt}</p>
                <div className="flex items-center gap-5">
                  <button className="inline-flex items-center gap-2 px-7 py-4 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors shadow-lg shadow-primary-900/30">
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <span className="text-sm text-gray-500 font-medium">
                    {publications[0].downloadCount.toLocaleString()} downloads
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                Resources
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">All Publications</h2>
            </div>
            <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {publications.slice(1).map((publication, idx) => (
                <article key={publication.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100" data-scroll="scale" data-delay={idx * 100}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image 
                      src={publication.coverImage} 
                      alt={publication.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-primary-900 shadow-lg backdrop-blur-sm">
                        {publication.category}
                      </span>
                      <span className="text-white text-sm font-bold">{publication.year}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-5">{publication.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <Download className="w-4 h-4" />
                        {publication.downloadCount.toLocaleString()}
                      </span>
                      <button className="inline-flex items-center gap-2 text-sm text-primary-900 font-bold group-hover:gap-3 transition-all">
                        Download <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </div>

            {/* Load More */}
            <div className="mt-16 text-center" data-scroll="up">
              <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-900 text-primary-900 font-bold rounded-xl hover:bg-primary-900 hover:text-white transition-all shadow-lg">
                Load More Publications
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-primary-950/95" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-6">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Contribute
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Want to Contribute?
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                We welcome research contributions and collaboration. If you have relevant research or resources to share, get in touch with us.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent-gold/30"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
    </>
  )
}
