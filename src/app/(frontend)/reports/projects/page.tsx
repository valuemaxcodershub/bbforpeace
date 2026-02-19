'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '@/components/layout'
import { 
  Search, FileText, Download, Calendar, ArrowRight, Eye,
  Sparkles, X, ChevronDown, FolderOpen, Filter, MapPin,
  Users, Target, BarChart3, Globe
} from 'lucide-react'

// Project Reports Data with internal download links
const projectReports = [
  {
    id: '1',
    title: 'West Africa Peace and Security Dialogue (WAPSeD) 2025 Report',
    description: 'Comprehensive documentation of the regional convening that brought together youth leaders, policymakers, and civil society organizations to address security challenges including violent extremism, political instability, and climate-related conflicts across West Africa.',
    year: 2025,
    category: 'Regional Program',
    region: 'West Africa',
    pages: 64,
    coverImage: '/images/PXL_20251007_102503598.MP.jpg',
    downloadUrl: '/documents/BBFORPEACE-WAPSeD-2025-Report.pdf',
    featured: true,
  },
  {
    id: '2',
    title: 'Youth Protection Advocacy Network (WAYPAN) Inception Report',
    description: 'Documentation of the establishment and early activities of our West African regional youth protection initiative, including network formation, capacity assessments, and strategic planning processes.',
    year: 2024,
    category: 'Program Report',
    region: 'West Africa',
    pages: 42,
    coverImage: '/images/PXL_20251008_094037931.jpg',
    downloadUrl: '/documents/BBFORPEACE-WAYPAN-Inception-Report.pdf',
  },
  {
    id: '3',
    title: 'Peace Education in Schools: A Three-Year Impact Study',
    description: 'Research findings on the effectiveness of peace education curriculum integration in partner schools across Northern Nigeria, measuring changes in student attitudes, conflict resolution skills, and community engagement.',
    year: 2024,
    category: 'Research',
    region: 'Nigeria',
    pages: 56,
    coverImage: '/images/_VEE7915 (1).jpg',
    downloadUrl: '/documents/BBFORPEACE-Peace-Education-Impact-Study.pdf',
  },
  {
    id: '4',
    title: 'Climate Security and Youth Engagement Report',
    description: 'Analysis of climate-related security risks and documentation of youth-led responses in conflict-affected communities, including adaptive strategies and recommendations for policy action.',
    year: 2023,
    category: 'Research',
    region: 'Nigeria',
    pages: 38,
    coverImage: '/images/_VEE7856.jpg',
    downloadUrl: '/documents/BBFORPEACE-Climate-Security-Report.pdf',
  },
  {
    id: '5',
    title: 'Governance and Accountability Program Report 2023',
    description: 'Annual activities and outcomes of our governance strengthening and civic engagement programs, highlighting citizen participation initiatives and accountability mechanisms established.',
    year: 2023,
    category: 'Program Report',
    region: 'Nigeria',
    pages: 48,
    coverImage: '/images/_VEE7178.jpg',
    downloadUrl: '/documents/BBFORPEACE-Governance-Accountability-2023.pdf',
  },
  {
    id: '6',
    title: 'Champions of Peace Network Assessment Report',
    description: 'Evaluation of the Champions of Peace youth and women network across Nigerian states, documenting membership growth, capacity development outcomes, and community impact.',
    year: 2023,
    category: 'Program Report',
    region: 'Nigeria',
    pages: 44,
    coverImage: '/images/_VEE7037 (1).jpg',
    downloadUrl: '/documents/BBFORPEACE-Champions-of-Peace-Assessment.pdf',
  },
  {
    id: '7',
    title: 'Community Dialogue Facilitation: Methodology Report',
    description: 'Documentation of our community dialogue approach, including facilitation techniques, conflict transformation methods, and case studies from interventions across multiple communities.',
    year: 2022,
    category: 'Toolkit',
    region: 'Nigeria',
    pages: 32,
    coverImage: '/images/_VEE6525.jpg',
    downloadUrl: '/documents/BBFORPEACE-Community-Dialogue-Methodology.pdf',
  },
  {
    id: '8',
    title: 'Youth Peacebuilding Capacity Assessment: FCT and Plateau State',
    description: 'Baseline assessment of youth peacebuilding capacities in the Federal Capital Territory and Plateau State, identifying gaps, opportunities, and recommendations for intervention.',
    year: 2022,
    category: 'Research',
    region: 'Nigeria',
    pages: 36,
    coverImage: '/images/_VEE6792.jpg',
    downloadUrl: '/documents/BBFORPEACE-Youth-Capacity-Assessment.pdf',
  },
]

const categories = ['All', 'Regional Program', 'Program Report', 'Research', 'Toolkit']
const years = ['All Years', '2025', '2024', '2023', '2022']
const regions = ['All Regions', 'West Africa', 'Nigeria']

export default function ProjectReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [selectedRegion, setSelectedRegion] = useState('All Regions')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredReports = useMemo(() => {
    return projectReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory
      const matchesYear = selectedYear === 'All Years' || report.year.toString() === selectedYear
      const matchesRegion = selectedRegion === 'All Regions' || report.region === selectedRegion
      return matchesSearch && matchesCategory && matchesYear && matchesRegion
    })
  }, [searchQuery, selectedCategory, selectedYear, selectedRegion])

  const featuredReport = projectReports.find(r => r.featured)
  const otherReports = filteredReports.filter(r => !r.featured)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedYear('All Years')
    setSelectedRegion('All Regions')
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedYear !== 'All Years' || selectedRegion !== 'All Regions'

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Regional Program': return 'bg-blue-600'
      case 'Program Report': return 'bg-emerald-600'
      case 'Research': return 'bg-purple-600'
      case 'Toolkit': return 'bg-amber-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <>
      <PageHero
        title="Project Reports"
        subtitle="Documentation & Research"
        description="Access comprehensive documentation from our peacebuilding programs, research initiatives, and regional interventions."
        backgroundImage="/images/_VEE7927.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Annual Reports', href: '/reports' },
          { label: 'Project Reports', href: '/reports/projects' },
        ]}
      />

      {/* Stats Overview */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" data-scroll="up">
              {[
                { value: '25+', label: 'Project Reports', icon: FileText, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
                { value: '12', label: 'Research Papers', icon: BarChart3, color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50' },
                { value: '8', label: 'Regional Programs', icon: Globe, color: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50' },
                { value: '5K+', label: 'Downloads', icon: Download, color: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50' },
              ].map((stat, idx) => (
                <div key={idx} className={`${stat.bgLight} rounded-2xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-100`}>
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Report */}
      {featuredReport && !hasActiveFilters && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-10" data-scroll="up">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Report</h2>
              </div>
              
              <div 
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
                data-scroll="up"
              >
                <div className="grid lg:grid-cols-5 gap-0">
                  {/* Image - 2 columns */}
                  <div className="lg:col-span-2 relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                    <Image 
                      src={featuredReport.coverImage} 
                      alt={featuredReport.title} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent lg:bg-gradient-to-t" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${getCategoryColor(featuredReport.category)} text-white shadow-lg`}>
                        {featuredReport.category}
                      </span>
                    </div>
                  </div>

                  {/* Content - 3 columns */}
                  <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        {featuredReport.year}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        {featuredReport.region}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                        <FileText className="w-4 h-4" />
                        {featuredReport.pages} pages
                      </span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-5 leading-tight">
                      {featuredReport.title}
                    </h3>
                    
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      {featuredReport.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <a 
                        href={featuredReport.downloadUrl}
                        download
                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <Download className="w-5 h-5" />
                        Download Report
                      </a>
                      <a 
                        href={featuredReport.downloadUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        <Eye className="w-5 h-5" />
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters Bar */}
      <section className="py-6 bg-white border-y border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project reports..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category */}
                <div className="relative">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 text-sm font-medium cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Year */}
                <div className="relative">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 text-sm font-medium cursor-pointer"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Region */}
                <div className="relative">
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 text-sm font-medium cursor-pointer"
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-10" data-scroll="up">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {hasActiveFilters ? 'Search Results' : 'All Project Reports'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Grid */}
            {filteredReports.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(hasActiveFilters ? filteredReports : otherReports).map((report, idx) => (
                  <article 
                    key={report.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                    data-scroll="scale" 
                    data-delay={idx * 80}
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={report.coverImage} 
                        alt={report.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getCategoryColor(report.category)} text-white shadow-lg`}>
                          {report.category}
                        </span>
                      </div>
                      
                      {/* Year & Region */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="flex items-center gap-1 text-white text-sm font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {report.region}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-gray-800 text-xs font-bold shadow-lg backdrop-blur-sm">
                          <Calendar className="w-3 h-3" />
                          {report.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug min-h-[3.5rem]">
                        {report.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                        {report.description}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                          <FileText className="w-3.5 h-3.5" />
                          {report.pages} pages
                        </span>
                      </div>
                      
                      {/* Download Button */}
                      <a 
                        href={report.downloadUrl}
                        download
                        className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 rounded-xl bg-primary-900 text-white font-bold text-sm hover:bg-primary-800 transition-colors group/btn"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredReports.length > 6 && (
              <div className="mt-16 text-center" data-scroll="up">
                <button className="inline-flex items-center gap-2 px-10 py-4 border-2 border-primary-900 text-primary-900 font-bold rounded-xl hover:bg-primary-900 hover:text-white transition-all">
                  Load More Reports
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Annual Reports CTA */}
      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-950 to-violet-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center" data-scroll="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Organizational Overview
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
              Looking for Annual Reports?
            </h2>
            <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
              Access our comprehensive annual reports documenting organizational impact, financial transparency, and strategic achievements year by year.
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
