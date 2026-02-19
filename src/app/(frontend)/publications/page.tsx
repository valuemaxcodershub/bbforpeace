import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Calendar, ArrowRight, BookOpen, Eye, Sparkles, ExternalLink } from 'lucide-react'

// Publications data - all files stored locally in /public/documents/
const publications = [
  {
    id: '1',
    title: 'Baseline Study on the Implementation of Nigeria\'s National Action Plan on Youth, Peace and Security',
    excerpt: 'A comprehensive baseline study assessing the implementation progress of Nigeria\'s National Action Plan on Youth, Peace and Security, with key findings and recommendations for stakeholders.',
    coverImage: '/images/_VEE7124 (1).jpg',
    category: 'Research',
    type: 'Study',
    year: 2024,
    pages: 48,
    downloadUrl: '/documents/BBFORPEACE-Baseline-Study-NAP-YPS.pdf',
    featured: true,
  },
  {
    id: '2',
    title: 'Nigeria: Shrinking Civic Space in the Name of Security',
    excerpt: 'An in-depth analysis of how security-related policies are affecting civic space in Nigeria and the implications for civil society organizations.',
    coverImage: '/images/_VEE6792.jpg',
    category: 'Research',
    type: 'Policy Brief',
    year: 2023,
    pages: 24,
    downloadUrl: '/documents/BBFORPEACE-Shrinking-Civic-Space.pdf',
  },
  {
    id: '3',
    title: 'Complementarity of UNSCR 2250 and AU Continental Framework on Youth, Peace and Security',
    excerpt: 'Examining the alignment and synergies between the UN Security Council Resolution 2250 and the African Union Continental Framework on Youth, Peace and Security.',
    coverImage: '/images/_VEE7017 (19) (1).jpg',
    category: 'Research',
    type: 'Research Paper',
    year: 2023,
    pages: 36,
    downloadUrl: '/documents/BBFORPEACE-UNSCR-2250-AU-Framework.pdf',
  },
  {
    id: '4',
    title: 'Beyond #ENDSARS: Effecting Positive Change in Governance in Nigeria',
    excerpt: 'Exploring the aftermath of the #EndSARS movement and pathways to positive governance transformation through youth civic engagement.',
    coverImage: '/images/_VEE7153 (6).jpg',
    category: 'Report',
    type: 'Report',
    year: 2021,
    pages: 52,
    downloadUrl: '/documents/BBFORPEACE-Beyond-EndSARS.pdf',
  },
  {
    id: '5',
    title: 'Connecting and Amplifying Voices of Youth Building Peace in Nigeria',
    excerpt: 'Documentation of youth-led peacebuilding initiatives and strategies for amplifying the voices of young peace advocates across Nigeria.',
    coverImage: '/images/_VEE7037 (1).jpg',
    category: 'Report',
    type: 'Report',
    year: 2022,
    pages: 40,
    downloadUrl: '/documents/BBFORPEACE-Youth-Voices-Peace.pdf',
  },
  {
    id: '6',
    title: 'COVID-19 Pandemic: The Future of Peacebuilding in Nigeria',
    excerpt: 'Analysis of the pandemic\'s impact on peacebuilding efforts and recommendations for sustainable peace during and after crises.',
    coverImage: '/images/_VEE6887 (20).jpg',
    category: 'Research',
    type: 'Research Paper',
    year: 2020,
    pages: 32,
    downloadUrl: '/documents/BBFORPEACE-COVID19-Peacebuilding.pdf',
  },
]

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Research':
      return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' }
    case 'Report':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' }
    case 'Policy Brief':
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  }
}

export const metadata = {
  title: 'Publications | BBFORPEACE',
  description: 'Access research papers, policy briefs, reports, and educational resources on peacebuilding and conflict resolution from BBFORPEACE.',
}

export default function PublicationsPage() {
  const featuredPublication = publications.find(p => p.featured)
  const otherPublications = publications.filter(p => !p.featured)

  return (
    <>
      <PageHero
        title="Publications"
        subtitle="Knowledge Hub"
        description="Access our research papers, policy briefs, reports, and educational resources on peacebuilding and conflict resolution."
        backgroundImage="/images/_VEE7037 (1).jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
        ]}
      />

      {/* Featured Publication */}
      {featuredPublication && (
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {/* Section Label */}
              <div className="flex items-center gap-3 mb-8" data-scroll="up">
                <span className="w-12 h-1 bg-accent-gold rounded-full" />
                <span className="text-sm font-bold text-primary-900 uppercase tracking-wider">Featured Publication</span>
              </div>

              {/* Featured Card */}
              <div className="group relative bg-gradient-to-br from-primary-950 to-primary-900 rounded-3xl overflow-hidden" data-scroll="up">
                <div className="absolute inset-0 bg-[url('/images/_VEE7124%20(1).jpg')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/95 to-primary-950/80" />
                
                <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
                  {/* Content */}
                  <div className="flex flex-col justify-center order-2 lg:order-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-gold text-primary-950 text-sm font-bold">
                        <Sparkles className="w-4 h-4" />
                        Featured
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                        {featuredPublication.type}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/70 text-sm">
                        <Calendar className="w-4 h-4" />
                        {featuredPublication.year}
                      </span>
                    </div>

                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
                      {featuredPublication.title}
                    </h2>

                    <p className="text-white/70 text-lg mb-8 leading-relaxed">
                      {featuredPublication.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={featuredPublication.downloadUrl}
                        download
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </a>
                      <span className="flex items-center gap-2 text-white/60 text-sm">
                        <FileText className="w-4 h-4" />
                        {featuredPublication.pages} pages
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[4/3] lg:aspect-auto order-1 lg:order-2">
                    <div className="absolute inset-0 lg:inset-4 rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={featuredPublication.coverImage}
                        alt={featuredPublication.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Publications */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16" data-scroll="up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">All Publications</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Browse and download our complete collection of research papers, reports, and policy briefs.
              </p>
            </div>

            {/* Publications Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {otherPublications.map((pub, idx) => {
                const categoryStyle = getCategoryStyle(pub.category)
                return (
                  <article
                    key={pub.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    data-scroll="up"
                    data-delay={idx * 100}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                        <Image
                          src={pub.coverImage}
                          alt={pub.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/30 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
                            {pub.type}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {pub.year}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <FileText className="w-3 h-3" />
                            {pub.pages} pages
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug">
                          {pub.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {pub.excerpt}
                        </p>

                        {/* Download */}
                        <a
                          href={pub.downloadUrl}
                          download
                          className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm hover:text-primary-900 transition-colors group/link"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Load More */}
            <div className="text-center mt-12" data-scroll="up">
              <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-900 text-primary-900 font-bold rounded-xl hover:bg-primary-900 hover:text-white transition-all">
                Load More Publications
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/PXL_20251023_124331635.MP~2.jpg')] bg-cover bg-center opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center" data-scroll="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              Contribute
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Want to Contribute Research?
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              We welcome research contributions and collaboration from scholars and practitioners working on peacebuilding and conflict resolution.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg"
            >
              Get In Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
