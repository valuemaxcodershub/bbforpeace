import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Eye, BookOpen, Calendar, ArrowRight, FileText, Sparkles } from 'lucide-react'

// Annual Reports with detailed information - using static Tailwind classes
const annualReports = [
  {
    id: 'annual-2025',
    year: 2025,
    title: '2025 Annual Report',
    subtitle: 'Consolidating Peace: Advancing the Implementation of Youth and Women Peace and Security Agenda',
    published: 'Published January, 2026',
    summary: 'This report documents BBFORPEACE\'s strategic efforts in consolidating peace across West Africa through the advancement of Youth, Peace and Security (YPS) and Women, Peace and Security (WPS) agendas. It highlights our expanded regional footprint, policy advocacy achievements at national and continental levels, capacity building initiatives for young peacebuilders, and the strengthening of partnerships with government institutions, civil society organizations, and international development partners throughout 2025.',
    coverImage: '/images/reports/2025 annual report.PNG',
    downloadUrl: '/documents/BBFORPEACE ANNUAL REPORT 2025.pdf',
    gradient: 'from-violet-600 to-indigo-700',
    badgeClass: 'bg-violet-600',
    textClass: 'text-violet-600',
    btnClass: 'bg-violet-600 hover:bg-violet-700',
  },
  {
    id: 'annual-2024',
    year: 2024,
    title: '2024 Annual Report',
    subtitle: 'Building Resilient Communities: Strengthening Youth-Led Peacebuilding in Nigeria',
    published: 'Published January, 2025',
    summary: 'The 2024 Annual Report showcases BBFORPEACE\'s transformative work in building resilient communities through youth-led peacebuilding initiatives across Nigeria. It captures our grassroots peace education programs, the Champions of Peace network expansion, governance and accountability advocacy, climate security interventions, and organizational development milestones that positioned us as a leading youth peacebuilding organization in the region.',
    coverImage: '/images/reports/2024 annual report.PNG',
    downloadUrl: '/documents/BBFORPEACE ANNUAL REPORT 2024.pdf',
    gradient: 'from-emerald-600 to-teal-700',
    badgeClass: 'bg-emerald-600',
    textClass: 'text-emerald-600',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700',
  },
]

export const metadata = {
  title: 'Annual Reports | BBFORPEACE',
  description: 'Access BBFORPEACE annual reports documenting our impact, achievements, and commitment to transparency in youth-led peacebuilding across West Africa.',
}

export default function AnnualReportsPage() {
  return (
    <>
      <PageHero
        title="Annual Reports"
        subtitle="Transparency & Accountability"
        description="Comprehensive documentation of our journey, impact, and commitment to transforming communities through youth-led peacebuilding."
        backgroundImage="/images/PXL_20251023_124331635.MP~2.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Annual Reports', href: '/reports' },
        ]}
      />

      {/* Annual Reports Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16" data-scroll="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Our Annual Reports
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                Impact & Accountability
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Download our comprehensive annual reports documenting our achievements, financial stewardship, and commitment to transparency.
              </p>
            </div>
            
            {/* Reports */}
            <div className="space-y-20">
              {annualReports.map((report, idx) => (
                <article 
                  key={report.id}
                  className="group"
                  data-scroll="up"
                  data-delay={idx * 150}
                >
                  <div className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 items-center`}>
                    
                    {/* Cover Image */}
                    <div className="w-full lg:w-2/5 flex-shrink-0">
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
                        <Image
                          src={report.coverImage}
                          alt={`${report.title} Cover`}
                          fill
                          className="object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${report.gradient} opacity-20 group-hover:opacity-10 transition-opacity`} />
                        
                        {/* Year Badge */}
                        <div className="absolute top-4 right-4">
                          <div className={`px-4 py-2 rounded-full ${report.badgeClass} text-white text-sm font-bold shadow-lg`}>
                            {report.year}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                      {/* Badge */}
                      <div className="flex items-center gap-2">
                        <BookOpen className={`w-5 h-5 ${report.textClass}`} />
                        <span className={`text-sm font-semibold ${report.textClass} uppercase tracking-wider`}>
                          Annual Report
                        </span>
                      </div>

                      {/* Title */}
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                          {report.title}
                        </h2>
                        <p className="text-xl lg:text-2xl font-semibold text-gray-700 leading-tight">
                          {report.subtitle}
                        </p>
                      </div>

                      {/* Published Date */}
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-wide">{report.published}</span>
                      </div>

                      {/* Summary */}
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {report.summary}
                      </p>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                          href={report.downloadUrl}
                          target="_blank"
                          className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl ${report.btnClass} text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                        >
                          <Download className="w-5 h-5" />
                          Download PDF
                        </Link>
                        <Link
                          href={report.downloadUrl}
                          target="_blank"
                          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                          <Eye className="w-5 h-5" />
                          View Online
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {idx < annualReports.length - 1 && (
                    <div className="mt-20 border-b border-gray-200" />
                  )}
                </article>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Project Reports CTA */}
      <section className="py-16 bg-primary-950">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center" data-scroll="up">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Looking for Project Reports?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Access detailed documentation of our programs, research findings, and initiative outcomes.
            </p>
            <Link
              href="/reports/projects"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white text-primary-900 hover:bg-gray-100 transition-all shadow-lg"
            >
              View Project Reports
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
