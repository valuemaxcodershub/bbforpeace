import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Calendar, ArrowRight, FolderOpen, Sparkles, ExternalLink } from 'lucide-react'

// Project Reports Data - organized by category with colors
const projectReports = [
  {
    id: '1',
    title: 'West Africa Peace and Security Dialogue (WAPSeD) 2025 Report',
    description: 'Comprehensive documentation of the regional convening that brought together youth leaders, policymakers, and civil society organizations to address security challenges including violent extremism, political instability, and climate-related conflicts across West Africa.',
    year: 2025,
    category: 'Regional Program',
    categoryColor: 'bg-blue-600',
    coverImage: '/images/PXL_20251007_102503598.MP.jpg',
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'Youth Protection Advocacy Network (WAYPAN) Inception Report',
    description: 'Documentation of the establishment and early activities of our West African regional youth protection initiative, including network formation, capacity assessments, and strategic planning processes.',
    year: 2024,
    category: 'Program Report',
    categoryColor: 'bg-emerald-600',
    coverImage: '/images/PXL_20251008_094037931.jpg',
    downloadUrl: '#',
  },
  {
    id: '3',
    title: 'Peace Education in Schools: A Three-Year Impact Study',
    description: 'Research findings on the effectiveness of peace education curriculum integration in partner schools across Northern Nigeria, measuring changes in student attitudes, conflict resolution skills, and community engagement.',
    year: 2024,
    category: 'Research',
    categoryColor: 'bg-purple-600',
    coverImage: '/images/_VEE7915 (1).jpg',
    downloadUrl: '#',
  },
  {
    id: '4',
    title: 'Climate Security and Youth Engagement Report',
    description: 'Analysis of climate-related security risks and documentation of youth-led responses in conflict-affected communities, including adaptive strategies and recommendations for policy action.',
    year: 2023,
    category: 'Research',
    categoryColor: 'bg-purple-600',
    coverImage: '/images/_VEE7856.jpg',
    downloadUrl: '#',
  },
  {
    id: '5',
    title: 'Governance and Accountability Program Report 2023',
    description: 'Annual activities and outcomes of our governance strengthening and civic engagement programs, highlighting citizen participation initiatives and accountability mechanisms established.',
    year: 2023,
    category: 'Program Report',
    categoryColor: 'bg-emerald-600',
    coverImage: '/images/_VEE7178.jpg',
    downloadUrl: '#',
  },
  {
    id: '6',
    title: 'Champions of Peace Network Assessment Report',
    description: 'Evaluation of the Champions of Peace youth and women network across Nigerian states, documenting membership growth, capacity development outcomes, and community impact.',
    year: 2023,
    category: 'Program Report',
    categoryColor: 'bg-emerald-600',
    coverImage: '/images/_VEE7037 (1).jpg',
    downloadUrl: '#',
  },
]

const categories = [
  { label: 'All Reports', value: 'all', count: 6 },
  { label: 'Regional Program', value: 'Regional Program', count: 1 },
  { label: 'Program Report', value: 'Program Report', count: 3 },
  { label: 'Research', value: 'Research', count: 2 },
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
        subtitle="Documentation & Research"
        description="Detailed documentation of our programs, research findings, and initiative outcomes across all our peacebuilding work."
        backgroundImage="/images/_VEE7927.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Annual Reports', href: '/reports' },
          { label: 'Project Reports', href: '/reports/projects' },
        ]}
      />

      {/* Stats Overview */}
      <section className="py-16 bg-gradient-to-r from-primary-50 via-white to-violet-50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-scroll="up">
              {[
                { value: '25+', label: 'Total Reports', icon: FileText },
                { value: '12', label: 'Research Papers', icon: FolderOpen },
                { value: '8', label: 'Regional Programs', icon: Sparkles },
                { value: '5000+', label: 'Downloads', icon: Download },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                  <div className="text-4xl font-black text-primary-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16" data-scroll="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold mb-6">
                <FolderOpen className="w-4 h-4" />
                Project Documentation
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                All Project Reports
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Browse and download comprehensive documentation from our peacebuilding programs, research initiatives, and regional projects.
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-14" data-scroll="scale">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                    cat.value === 'all' 
                      ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30' 
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-900'
                  }`}
                >
                  {cat.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    cat.value === 'all' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Reports Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectReports.map((report, idx) => (
                <article
                  key={report.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                  data-scroll="scale"
                  data-delay={idx * 80}
                >
                  {/* Cover Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={report.coverImage}
                      alt={report.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full ${report.categoryColor} text-white text-xs font-bold shadow-lg`}>
                        {report.category}
                      </span>
                    </div>
                    
                    {/* Year Badge */}
                    <div className="absolute bottom-4 right-4">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-gray-800 text-sm font-bold shadow-lg backdrop-blur-sm">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                        {report.year}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-primary-900 transition-colors leading-snug min-h-[3.5rem]">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>
                    
                    {/* Action */}
                    <Link
                      href={report.downloadUrl}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-50 text-primary-700 font-bold text-sm hover:bg-primary-100 transition-colors group/link"
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
            <div className="text-center mt-16" data-scroll="up">
              <button className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white transition-all shadow-sm">
                Load More Reports
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Annual Reports CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-950 to-violet-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center" data-scroll="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Organizational Overview
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white mb-6">
              Looking for Annual Reports?
            </h3>
            <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">
              Access our comprehensive annual reports documenting organizational impact, financial transparency, and strategic achievements.
            </p>
            <Link
              href="/reports"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold bg-white text-primary-900 hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
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
