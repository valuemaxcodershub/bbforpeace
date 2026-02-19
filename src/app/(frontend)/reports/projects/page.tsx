import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Calendar, ArrowRight, Search, Filter } from 'lucide-react'

// Project Reports Data
const projectReports = [
  {
    id: '1',
    title: 'West Africa Peace and Security Dialogue (WAPSeD) 2025 Report',
    description: 'Comprehensive documentation of the regional convening that brought together youth leaders, policymakers, and civil society organizations to address security challenges including violent extremism, political instability, and climate-related conflicts across West Africa.',
    year: 2025,
    category: 'Regional Program',
    coverImage: '/images/PXL_20251007_102503598.MP.jpg',
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'Youth Protection Advocacy Network (WAYPAN) Inception Report',
    description: 'Documentation of the establishment and early activities of our West African regional youth protection initiative, including network formation, capacity assessments, and strategic planning processes.',
    year: 2024,
    category: 'Program Report',
    coverImage: '/images/PXL_20251008_094037931.jpg',
    downloadUrl: '#',
  },
  {
    id: '3',
    title: 'Peace Education in Schools: A Three-Year Impact Study',
    description: 'Research findings on the effectiveness of peace education curriculum integration in partner schools across Northern Nigeria, measuring changes in student attitudes, conflict resolution skills, and community engagement.',
    year: 2024,
    category: 'Research',
    coverImage: '/images/_VEE7915 (1).jpg',
    downloadUrl: '#',
  },
  {
    id: '4',
    title: 'Climate Security and Youth Engagement Report',
    description: 'Analysis of climate-related security risks and documentation of youth-led responses in conflict-affected communities, including adaptive strategies and recommendations for policy action.',
    year: 2023,
    category: 'Research',
    coverImage: '/images/_VEE7856.jpg',
    downloadUrl: '#',
  },
  {
    id: '5',
    title: 'Governance and Accountability Program Report 2023',
    description: 'Annual activities and outcomes of our governance strengthening and civic engagement programs, highlighting citizen participation initiatives and accountability mechanisms established.',
    year: 2023,
    category: 'Program Report',
    coverImage: '/images/_VEE7178.jpg',
    downloadUrl: '#',
  },
  {
    id: '6',
    title: 'Champions of Peace Network Assessment Report',
    description: 'Evaluation of the Champions of Peace youth and women network across Nigerian states, documenting membership growth, capacity development outcomes, and community impact.',
    year: 2023,
    category: 'Program Report',
    coverImage: '/images/_VEE7037 (1).jpg',
    downloadUrl: '#',
  },
]

const categories = [
  { label: 'All Reports', value: 'all' },
  { label: 'Regional Program', value: 'Regional Program' },
  { label: 'Program Report', value: 'Program Report' },
  { label: 'Research', value: 'Research' },
]

export const metadata = {
  title: 'Project Reports | BBFORPEACE',
  description: 'Access detailed project reports, research findings, and program documentation from BBFORPEACE peacebuilding initiatives.',
}

export default function ProjectReportsPage() {
  return (
    <>
      <PageHero
        title="Project Reports"
        subtitle="Documentation"
        description="Detailed documentation of our programs, research findings, and initiative outcomes across all our peacebuilding work."
        backgroundImage="/images/_VEE7927.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Annual Reports', href: '/reports' },
          { label: 'Project Reports', href: '/reports/projects' },
        ]}
      />

      {/* Stats Overview */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-scroll="up">
              {[
                { value: '25+', label: 'Total Reports' },
                { value: '12', label: 'Research Papers' },
                { value: '8', label: 'Regional Programs' },
                { value: '5000+', label: 'Downloads' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4">
                  <div className="text-3xl font-black text-primary-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header with Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12" data-scroll="up">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">All Project Reports</h2>
                <p className="text-gray-600 mt-1">Browse and download our project documentation</p>
              </div>
              
              {/* Category Filter (Static for now - can be made interactive with client component) */}
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      cat.value === 'all' 
                        ? 'bg-primary-900 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectReports.map((report, idx) => (
                <article
                  key={report.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                  data-scroll="scale"
                  data-delay={idx * 80}
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={report.coverImage}
                      alt={report.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                    
                    {/* Category & Year */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 text-primary-900 text-xs font-bold shadow-lg backdrop-blur-sm">
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
                    <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>
                    
                    {/* Action */}
                    <Link
                      href={report.downloadUrl}
                      className="inline-flex items-center gap-2 text-primary-700 font-bold text-sm hover:text-primary-900 transition-colors group/link"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12" data-scroll="up">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white transition-all">
                Load More Reports
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Annual Reports CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-950 to-violet-950">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center" data-scroll="up">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Looking for Annual Reports?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Access our comprehensive annual reports documenting organizational impact and financial transparency.
            </p>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white text-primary-900 hover:bg-gray-100 transition-all shadow-lg"
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
