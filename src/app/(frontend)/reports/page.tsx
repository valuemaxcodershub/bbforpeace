import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, Calendar, ArrowRight, BookOpen, Eye, TrendingUp, Users, Target, Award } from 'lucide-react'

// Annual Reports - Featured section
const annualReports = [
  {
    id: 'annual-2025',
    year: 2025,
    title: 'BBFORPEACE Annual Report 2025',
    subtitle: 'Building Tomorrow\'s Peace Today',
    description: 'Our comprehensive annual report highlighting key achievements, impact stories, financial transparency, and strategic milestones in youth-led peacebuilding across West Africa.',
    highlights: [
      'Regional expansion to 5 new states',
      '15,000+ youth reached',
      'WAPSeD 2025 convening success',
      'New strategic partnerships',
    ],
    coverImage: '/images/PXL_20251023_124331635.MP~2.jpg',
    downloadUrl: '/documents/BBFORPEACE ANNUAL REPORT 2025.pdf',
    color: 'from-violet-600 via-purple-600 to-indigo-600',
    accentColor: 'violet',
  },
  {
    id: 'annual-2024',
    year: 2024,
    title: 'BBFORPEACE Annual Report 2024',
    subtitle: 'A Year of Impact & Growth',
    description: 'Documenting our transformative journey in 2024 - from grassroots peace education to policy advocacy, showcasing the power of youth-led peacebuilding.',
    highlights: [
      'Champions of Peace expansion',
      '10,000+ community members engaged',
      'Policy advocacy wins',
      'Organizational growth milestones',
    ],
    coverImage: '/images/_VEE7037 (1).jpg',
    downloadUrl: '/documents/BBFORPEACE ANNUAL REPORT 2024.pdf',
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    accentColor: 'emerald',
  },
]

// Project/Program Reports
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
    title: 'Youth Protection Advocacy Network (WAYPAN) Inception Report',
    description: 'Documentation of the establishment and early activities of our West African regional youth protection initiative.',
    year: 2024,
    coverImage: '/images/PXL_20251008_094037931.jpg',
    downloadUrl: '#',
    category: 'Program Report',
  },
  {
    id: '3',
    title: 'Peace Education in Schools: A Three-Year Impact Study',
    description: 'Research findings on the effectiveness of peace education curriculum integration in partner schools across Northern Nigeria.',
    year: 2024,
    coverImage: '/images/_VEE7915 (1).jpg',
    downloadUrl: '#',
    category: 'Research',
  },
  {
    id: '4',
    title: 'Climate Security and Youth Engagement Report',
    description: 'Analysis of climate-related security risks and youth-led responses in conflict-affected communities.',
    year: 2023,
    coverImage: '/images/_VEE7856.jpg',
    downloadUrl: '#',
    category: 'Research',
  },
  {
    id: '5',
    title: 'Governance and Accountability Program Report 2023',
    description: 'Annual activities and outcomes of our governance strengthening and civic engagement programs.',
    year: 2023,
    coverImage: '/images/_VEE7178.jpg',
    downloadUrl: '#',
    category: 'Program Report',
  },
]

export const metadata = {
  title: 'Project Reports | BBFORPEACE',
  description: 'Access project reports, research findings, and impact assessments from Building Blocks for Peace Foundation.',
}

export default function ReportsPage() {
  return (
    <>
      <PageHero
        title="Reports & Publications"
        subtitle="Transparency"
        description="Access our annual reports, project documentation, and research findings showcasing our impact and accountability."
        backgroundImage="/images/_VEE7037 (1).jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Reports', href: '/reports' },
        ]}
      />

      {/* Annual Reports - Featured Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Annual Reports
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Impact Story</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Comprehensive documentation of our journey, achievements, and commitment to transparency.
              </p>
            </div>

            {/* Annual Reports Cards */}
            <div className="grid lg:grid-cols-2 gap-8">
              {annualReports.map((report, idx) => (
                <div
                  key={report.id}
                  className="group relative bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  data-scroll="scale"
                  data-delay={idx * 150}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${report.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Cover Image with Overlay */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={report.coverImage}
                      alt={report.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${report.color} opacity-60`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Year Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                        <BookOpen className="w-4 h-4 text-primary-900" />
                        <span className="font-bold text-primary-900">Annual Report</span>
                      </div>
                    </div>
                    
                    {/* Large Year */}
                    <div className="absolute bottom-4 right-6">
                      <span className="text-7xl font-black text-white/30">{report.year}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-8 group-hover:text-white transition-colors duration-500">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-primary-600 group-hover:text-white/80 font-semibold mb-4 transition-colors">
                      {report.subtitle}
                    </p>
                    <p className="text-gray-600 group-hover:text-white/90 mb-6 transition-colors leading-relaxed">
                      {report.description}
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {report.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full bg-${report.accentColor}-500 group-hover:bg-white/80`} />
                          <span className="text-gray-600 group-hover:text-white/90 transition-colors">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Link
                        href={report.downloadUrl}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary-900 group-hover:bg-white text-white group-hover:text-primary-900 font-bold transition-all shadow-lg hover:shadow-xl"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </Link>
                      <Link
                        href={report.downloadUrl}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-200 group-hover:border-white/50 text-gray-700 group-hover:text-white font-bold transition-all hover:bg-white/10"
                      >
                        <Eye className="w-5 h-5" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-primary-950">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-scroll="up">
              {[
                { icon: TrendingUp, label: 'Years of Impact', value: '8+' },
                { icon: Users, label: 'Youth Reached', value: '50,000+' },
                { icon: Target, label: 'Projects Completed', value: '45+' },
                { icon: Award, label: 'Awards Received', value: '12' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                    <stat.icon className="w-7 h-7 text-accent-gold" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Reports Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-5xl mx-auto">

            {/* Section Title */}
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                Documentation
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Project Reports</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Detailed documentation of our programs, research findings, and initiative outcomes.
              </p>
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
                      <button
                        className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-primary-200 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center p-10 bg-gradient-to-br from-primary-50 via-violet-50 to-fuchsia-50 rounded-[2rem] border border-primary-100" data-scroll="up">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Need More Information?</h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Contact us for specific reports, research collaborations, or detailed impact assessments.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary-900 text-white hover:bg-primary-800 transition-all shadow-lg"
              >
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            </div>
          </div>
        </section>
    </>
  )
}
