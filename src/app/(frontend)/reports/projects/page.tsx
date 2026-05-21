import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Calendar, ArrowRight, BookOpen, Sparkles, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
import { getMediaUrl, plainTextFromRichText } from '@/lib/utils'
import { DownloadButton } from '@/components/ui/DownloadButton'

export const metadata: Metadata = {
  title: 'Project Reports | BBFORPEACE',
  description: 'Access comprehensive documentation from our peacebuilding programs, research initiatives, and regional interventions across West Africa.',
}

const projectReportsHero = {
  title: 'Project Reports',
  subtitle: 'Documentation & Research',
  description:
    'Access comprehensive documentation from our peacebuilding programs, research initiatives, and regional interventions across West Africa.',
  backgroundImage: '/images/_VEE7927.jpg',
}

const colorMap = {
  blue: {
    badge: 'bg-blue-100 text-blue-700',
    accent: 'bg-blue-500',
    border: 'border-blue-500',
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-700',
    accent: 'bg-emerald-500',
    border: 'border-emerald-500',
  },
  purple: {
    badge: 'bg-purple-100 text-purple-700',
    accent: 'bg-purple-500',
    border: 'border-purple-500',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-700',
    accent: 'bg-amber-500',
    border: 'border-amber-500',
  },
}

export default async function ProjectReportsPage() {
  let projectReportsFromCms: any[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'publications',
        where: { subMenu: { equals: 'project-report' } },
        sort: '-year',
        limit: 20,
        depth: 1,
      })

    projectReportsFromCms = result.docs.map((pub: any, idx: number) => {
      return {
        id: pub.id,
        title: pub.title,
        slug: pub.slug,
        description: plainTextFromRichText(pub.excerpt || pub.description, 300),
        fileUrl: pub.externalFileUrl || getMediaUrl(pub.file, ''),
        downloadCount: pub.downloadCount ?? 0,
        year: pub.year || new Date().getFullYear(),
        category: pub.category || 'Program Report',
        region: pub.region || 'Nigeria',
        pages: pub.pages || 0,
        coverImage: getMediaUrl(pub.coverImage, '/images/_VEE7927.jpg'),
        featured: Boolean(pub.isFeatured) || idx === 0,
        color: pub.accentColor || 'blue',
      }
    })
  } catch (error) {
    console.error('Failed to fetch project reports:', error)
  }

  const displayReports = projectReportsFromCms

  const featuredReport = displayReports.find(r => r.featured)
  const otherReports = displayReports.filter(r => !r.featured)

  return (
    <>
      <PageHero
        title={projectReportsHero.title}
        subtitle={projectReportsHero.subtitle}
        description={projectReportsHero.description}
        backgroundImage={projectReportsHero.backgroundImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Annual Reports', href: '/reports' },
          { label: 'Project Reports', href: '/reports/projects' },
        ]}
      />

      {/* Quick Stats Bar */}
      <section className="bg-primary-950 py-8 -mt-1">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {[
              { label: 'Project Reports', value: '25+', icon: FileText },
              { label: 'Downloads', value: '5K+', icon: Download },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white/90">
                <stat.icon className="w-5 h-5 text-accent-gold" />
                <span className="font-bold">{stat.value}</span>
                <span className="text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Report */}
      {featuredReport && (
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8" data-scroll="up">
                <span className="w-12 h-1 bg-accent-gold rounded-full" />
                <span className="text-sm font-bold text-primary-900 uppercase tracking-wider">Featured Report</span>
              </div>

              <div className="group relative bg-linear-to-br from-primary-950 to-primary-900 rounded-3xl overflow-hidden" data-scroll="up">
                <div className="absolute inset-0 bg-[url('/images/_VEE7927.jpg')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-linear-to-r from-primary-950 via-primary-950/95 to-primary-950/80" />
                
                <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
                  <div className="flex flex-col justify-center order-2 lg:order-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-gold text-primary-950 text-sm font-bold">
                        <Sparkles className="w-4 h-4" />
                        Featured
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                        {featuredReport.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/70 text-sm">
                        <Calendar className="w-4 h-4" />
                        {featuredReport.year}
                      </span>
                      {featuredReport.region && (
                        <span className="flex items-center gap-1.5 text-white/70 text-sm">
                          <MapPin className="w-4 h-4" />
                          {featuredReport.region}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
                      {featuredReport.title}
                    </h2>

                    <p className="text-white/70 text-lg mb-8 leading-relaxed">
                      {featuredReport.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={`/reports/projects/${featuredReport.slug}`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                      >
                        <BookOpen className="w-5 h-5" />
                        Read More
                      </Link>
                      {featuredReport.fileUrl && (
                        <DownloadButton
                          publicationId={featuredReport.id}
                          fileUrl={featuredReport.fileUrl}
                          initialDownloadCount={featuredReport.downloadCount}
                          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                        />
                      )}
                    </div>
                  </div>

                  <div className="relative aspect-4/3 lg:aspect-auto order-1 lg:order-2">
                    <div className="absolute inset-0 lg:inset-4 rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={featuredReport.coverImage}
                        alt={featuredReport.title}
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

      {/* All Project Reports */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16" data-scroll="up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">All Project Reports</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Browse our complete collection of project reports documenting our peacebuilding programs and research initiatives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {otherReports.map((report, idx) => {
                const colors = colorMap[report.color as keyof typeof colorMap] || colorMap.blue
                return (
                  <article
                    key={report.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    data-scroll="up"
                    data-delay={idx * 100}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                        <Image
                          src={report.coverImage}
                          alt={report.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/30 to-transparent" />
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                            {report.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {report.year}
                          </span>
                          {report.region && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {report.region}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug">
                          {report.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {report.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            href={`/reports/projects/${report.slug}`}
                            className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm hover:text-primary-900 transition-colors group/link"
                          >
                            <BookOpen className="w-4 h-4" />
                            Read More
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                          {report.fileUrl && (
                            <DownloadButton
                              publicationId={report.id}
                              fileUrl={report.fileUrl}
                              initialDownloadCount={report.downloadCount}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800 hover:text-primary-950 transition-colors"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/_VEE7017%20(19)%20(1).jpg')] bg-cover bg-center opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center" data-scroll="up">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Looking for Annual Reports?
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              View our comprehensive annual reports that summarize our organization&apos;s yearly activities, impact, and financial statements.
            </p>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              View Annual Reports
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
