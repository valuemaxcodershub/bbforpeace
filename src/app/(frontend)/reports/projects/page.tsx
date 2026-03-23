import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Calendar, ArrowRight, Globe, Target, Sparkles, MapPin, FolderOpen } from 'lucide-react'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
import { getMediaUrl } from '@/lib/utils'

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
        description: pub.excerpt || pub.description || '',
        year: pub.year || new Date().getFullYear(),
        category: pub.category || 'Program Report',
        region: pub.region || 'Nigeria',
        pages: pub.pages || 0,
        coverImage: getMediaUrl(pub.coverImage, '/images/_VEE7927.jpg'),
        downloadUrl: getMediaUrl(pub.file, '#'),
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
  const reportsByYear = otherReports.reduce((acc, report) => {
    const year = report.year.toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(report)
    return acc
  }, {} as Record<string, typeof otherReports>)

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
              { label: 'Research Papers', value: '12', icon: Target },
              { label: 'Countries Covered', value: '8', icon: Globe },
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
              <div className="flex items-center gap-3 mb-10" data-scroll="up">
                <Sparkles className="w-5 h-5 text-accent-gold" />
                <span className="text-sm font-bold text-primary-900 uppercase tracking-wider">Latest Report</span>
              </div>

              <div className="group relative" data-scroll="up">
                {/* Card with overlay */}
                <div className="relative h-[500px] rounded-3xl overflow-hidden">
                  <Image
                    src={featuredReport.coverImage}
                    alt={featuredReport.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-sm font-bold">
                        {featuredReport.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/80 text-sm">
                        <MapPin className="w-4 h-4" />
                        {featuredReport.region}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/80 text-sm">
                        <Calendar className="w-4 h-4" />
                        {featuredReport.year}
                      </span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                      {featuredReport.title}
                    </h2>

                    <p className="text-white/70 text-lg mb-8 line-clamp-3">
                      {featuredReport.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={featuredReport.downloadUrl}
                        download
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Download Report
                      </a>
                      <span className="flex items-center gap-2 text-white/60">
                        <FileText className="w-4 h-4" />
                        {featuredReport.pages} pages
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reports by Year */}
      {(Object.entries(reportsByYear) as [string, any[]][])
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, reports]) => (
          <section key={year} className="py-16 odd:bg-gray-50 even:bg-white">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                {/* Year Header */}
                <div className="flex items-center gap-4 mb-10" data-scroll="up">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-900" />
                    <h2 className="text-4xl font-black text-primary-900">{year}</h2>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500 font-medium">{reports.length} reports</span>
                </div>

                {/* Reports Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {reports.map((report, idx) => {
                    const colors = colorMap[report.color as keyof typeof colorMap]
                    return (
                      <article
                        key={report.id}
                        className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 ${colors.border}`}
                        data-scroll="up"
                        data-delay={idx * 100}
                      >
                        <div className="flex">
                          {/* Image */}
                          <div className="relative w-40 h-48 flex-shrink-0 hidden sm:block">
                            <Image
                              src={report.coverImage}
                              alt={report.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${colors.badge}`}>
                                {report.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {report.region}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug">
                              {report.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {report.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {report.pages} pages
                              </span>
                              <a
                                href={report.downloadUrl}
                                download
                                className="inline-flex items-center gap-1.5 text-primary-700 font-semibold text-sm hover:text-primary-900 transition-colors group/link"
                              >
                                <Download className="w-4 h-4" />
                                Download
                                <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all" />
                              </a>
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
        ))}

      {/* Category Legend */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center" data-scroll="up">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Report Categories</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Regional Program', color: 'bg-blue-500' },
                { label: 'Program Report', color: 'bg-emerald-500' },
                { label: 'Research', color: 'bg-purple-500' },
                { label: 'Toolkit', color: 'bg-amber-500' },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="text-sm text-gray-700 font-medium">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/_VEE7017%20(19)%20(1).jpg')] bg-cover bg-center opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center" data-scroll="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-6">
              <FolderOpen className="w-4 h-4" />
              Annual Reports
            </div>
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
