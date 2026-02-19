import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Calendar, ArrowRight } from 'lucide-react'

const projectReports = [
  {
    id: '1',
    title: 'West Africa Peace and Security Dialogue (WAPSeD) 2025 Report',
    description: 'Comprehensive report on the regional convening addressing security challenges including violent extremism, political instability, and climate stress across West Africa.',
    year: 2025,
    coverImage: '/images/PXL_20251007_102503598.MP.jpg',
    downloadUrl: '#',
    category: 'Regional Program',
  },
  {
    id: '2',
    title: 'Champions of Peace Initiative Annual Report 2024',
    description: 'Impact assessment and activities report of our youth and women peace network across Nigerian states.',
    year: 2024,
    coverImage: '/images/_VEE7927.jpg',
    downloadUrl: '#',
    category: 'Annual Report',
  },
  {
    id: '3',
    title: 'Youth Protection Advocacy Network (WAYPAN) Inception Report',
    description: 'Documentation of the establishment and early activities of our West African regional youth protection initiative.',
    year: 2024,
    coverImage: '/images/PXL_20251008_094037931.jpg',
    downloadUrl: '#',
    category: 'Program Report',
  },
  {
    id: '4',
    title: 'Peace Education in Schools: A Three-Year Impact Study',
    description: 'Research findings on the effectiveness of peace education curriculum integration in partner schools across Northern Nigeria.',
    year: 2024,
    coverImage: '/images/_VEE7915 (1).jpg',
    downloadUrl: '#',
    category: 'Research',
  },
  {
    id: '5',
    title: 'Climate Security and Youth Engagement Report',
    description: 'Analysis of climate-related security risks and youth-led responses in conflict-affected communities.',
    year: 2023,
    coverImage: '/images/_VEE7856.jpg',
    downloadUrl: '#',
    category: 'Research',
  },
  {
    id: '6',
    title: 'Governance and Accountability Program Report 2023',
    description: 'Annual activities and outcomes of our governance strengthening and civic engagement programs.',
    year: 2023,
    coverImage: '/images/_VEE7178.jpg',
    downloadUrl: '#',
    category: 'Annual Report',
  },
]

const categories = ['All', 'Annual Report', 'Program Report', 'Research', 'Regional Program']

export const metadata = {
  title: 'Project Reports | BBFORPEACE',
  description: 'Access project reports, research findings, and impact assessments from Building Blocks for Peace Foundation.',
}

export default function ReportsPage() {
  return (
    <>
      <PageHero
        title="Project Reports"
        subtitle="Reports"
        description="Access our project reports, research findings, and impact assessments documenting our peacebuilding work."
        backgroundImage="/images/_VEE7037 (1).jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Reports', href: '/reports' },
        ]}
      />

        <section className="py-20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl border border-gray-100" data-scroll="up">
              {[
                { label: 'Total Reports', value: '25+' },
                { label: 'Research Papers', value: '12' },
                { label: 'Annual Reports', value: '8' },
                { label: 'Downloads', value: '5000+' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Section Title */}
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                Documents
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">All Project Reports</h2>
            </div>

            {/* Reports Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectReports.map((report, idx) => (
                <div
                  key={report.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
                  data-scroll="scale"
                  data-delay={idx * 100}
                >
                  {/* Cover Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={report.coverImage}
                      alt={report.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                      <span className="px-4 py-1.5 rounded-full bg-white/95 text-primary-900 text-xs font-bold shadow-lg backdrop-blur-sm">
                        {report.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-white text-sm font-bold">
                        <Calendar className="w-4 h-4" />
                        {report.year}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-primary-900 transition-colors leading-snug">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href={report.downloadUrl}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-900 text-white font-bold text-sm hover:bg-primary-800 transition-colors shadow-lg shadow-primary-900/30"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Link>
                      <Link
                        href={`/reports/${report.id}`}
                        className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-primary-200 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-16" data-scroll="up">
              <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white transition-all shadow-lg">
                Load More Reports
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            </div>
          </div>
        </section>
    </>
  )
}
