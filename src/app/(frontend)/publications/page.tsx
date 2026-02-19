'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '@/components/layout'
import { 
  Search, FileText, Download, Calendar, ArrowRight, BookOpen, 
  Eye, Sparkles, X, ChevronDown, FolderOpen, Filter, Users
} from 'lucide-react'

// Publications data with internal download links
const publications = [
  {
    id: '1',
    title: 'Baseline Study on the Implementation of Nigeria\'s National Action Plan on Youth, Peace and Security',
    excerpt: 'A comprehensive baseline study assessing the implementation progress of Nigeria\'s National Action Plan on Youth, Peace and Security, including key findings and recommendations.',
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
    excerpt: 'An analysis of the shrinking civic space in Nigeria under security-related policies and their impact on civil society organizations and civic engagement.',
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
    excerpt: 'Examining the synergy between the United Nations Security Council Resolution 2250 and the African Union Continental Framework on Youth, Peace and Security.',
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
    excerpt: 'Exploring the aftermath of the #EndSARS movement and pathways to positive governance changes in Nigeria through youth civic engagement.',
    coverImage: '/images/_VEE7153 (6).jpg',
    category: 'Reports',
    type: 'Report',
    year: 2021,
    pages: 52,
    downloadUrl: '/documents/BBFORPEACE-Beyond-EndSARS.pdf',
  },
  {
    id: '5',
    title: 'Connecting and Amplifying Voices of Youth Building Peace in Nigeria',
    excerpt: 'Showcasing youth-led peacebuilding initiatives and amplifying the voices of young peace advocates across Nigeria through documentation and storytelling.',
    coverImage: '/images/_VEE7037 (1).jpg',
    category: 'Reports',
    type: 'Report',
    year: 2022,
    pages: 40,
    downloadUrl: '/documents/BBFORPEACE-Youth-Voices-Peace.pdf',
  },
  {
    id: '6',
    title: 'COVID-19 Pandemic: The Future of Peacebuilding in Nigeria',
    excerpt: 'Analyzing the impact of the COVID-19 pandemic on peacebuilding efforts and the future outlook for sustainable peace in Nigeria.',
    coverImage: '/images/_VEE6887 (20).jpg',
    category: 'Research',
    type: 'Research Paper',
    year: 2020,
    pages: 32,
    downloadUrl: '/documents/BBFORPEACE-COVID19-Peacebuilding.pdf',
  },
  {
    id: '7',
    title: 'Youth Participation in Electoral Processes: Lessons from Nigeria',
    excerpt: 'A comprehensive study on youth engagement in electoral processes across Nigeria, documenting challenges, opportunities, and best practices.',
    coverImage: '/images/_VEE7915 (1).jpg',
    category: 'Research',
    type: 'Study',
    year: 2023,
    pages: 44,
    downloadUrl: '/documents/BBFORPEACE-Youth-Electoral-Participation.pdf',
  },
  {
    id: '8',
    title: 'Climate Security and Peacebuilding: A Youth-Centered Approach',
    excerpt: 'Exploring the intersection of climate change and security, with recommendations for youth-led climate peacebuilding interventions.',
    coverImage: '/images/_VEE7856.jpg',
    category: 'Research',
    type: 'Policy Brief',
    year: 2024,
    pages: 28,
    downloadUrl: '/documents/BBFORPEACE-Climate-Security-Youth.pdf',
  },
]

const categories = ['All', 'Research', 'Reports']
const types = ['All Types', 'Study', 'Research Paper', 'Policy Brief', 'Report']
const years = ['All Years', '2024', '2023', '2022', '2021', '2020']

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedYear, setSelectedYear] = useState('All Years')

  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pub.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory
      const matchesType = selectedType === 'All Types' || pub.type === selectedType
      const matchesYear = selectedYear === 'All Years' || pub.year.toString() === selectedYear
      return matchesSearch && matchesCategory && matchesType && matchesYear
    })
  }, [searchQuery, selectedCategory, selectedType, selectedYear])

  const featuredPublication = publications.find(p => p.featured)
  const otherPublications = filteredPublications.filter(p => !p.featured)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedType('All Types')
    setSelectedYear('All Years')
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedType !== 'All Types' || selectedYear !== 'All Years'

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

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 via-white to-violet-50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-scroll="up">
              {[
                { value: '50+', label: 'Publications', icon: FileText, color: 'from-primary-500 to-primary-600' },
                { value: '15K+', label: 'Downloads', icon: Download, color: 'from-emerald-500 to-emerald-600' },
                { value: '8', label: 'Research Areas', icon: FolderOpen, color: 'from-violet-500 to-violet-600' },
                { value: '50K+', label: 'Readers', icon: Eye, color: 'from-amber-500 to-amber-600' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
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

      {/* Featured Publication */}
      {featuredPublication && !hasActiveFilters && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-10" data-scroll="up">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Publication</h2>
              </div>
              
              <div 
                className="grid lg:grid-cols-2 gap-0 bg-gradient-to-br from-primary-900 via-primary-950 to-violet-950 rounded-3xl overflow-hidden shadow-2xl"
                data-scroll="up"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[450px]">
                  <Image 
                    src={featuredPublication.coverImage} 
                    alt={featuredPublication.title} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-950/60 via-primary-950/30 to-transparent lg:bg-gradient-to-l" />
                  
                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-accent-gold text-primary-950 shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                      {featuredPublication.category}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 backdrop-blur-sm">
                      {featuredPublication.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-300 font-medium">
                      <Calendar className="w-4 h-4" />
                      {featuredPublication.year}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-5 leading-tight">
                    {featuredPublication.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {featuredPublication.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <a 
                      href={featuredPublication.downloadUrl}
                      download
                      className="inline-flex items-center gap-3 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                    <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                      <FileText className="w-4 h-4" />
                      {featuredPublication.pages} pages
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search & Filters */}
      <section className="py-8 bg-gray-50 border-y border-gray-100 sticky top-0 z-30">
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
                  placeholder="Search publications..."
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Type Filter */}
                <div className="relative">
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none px-5 py-3 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 text-sm font-medium cursor-pointer"
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Year Filter */}
                <div className="relative">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none px-5 py-3 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 text-sm font-medium cursor-pointer"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
                          : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-900 border border-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-12" data-scroll="up">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {hasActiveFilters ? 'Search Results' : 'All Publications'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredPublications.length} publication{filteredPublications.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Grid */}
            {filteredPublications.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(hasActiveFilters ? filteredPublications : otherPublications).map((publication, idx) => (
                  <article 
                    key={publication.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                    data-scroll="scale" 
                    data-delay={idx * 80}
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image 
                        src={publication.coverImage} 
                        alt={publication.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-primary-900 shadow-lg backdrop-blur-sm">
                          {publication.type}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 text-white text-xs font-bold backdrop-blur-sm">
                          <Calendar className="w-3.5 h-3.5" />
                          {publication.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-semibold">
                          {publication.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FileText className="w-3.5 h-3.5" />
                          {publication.pages} pages
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug min-h-[3.5rem]">
                        {publication.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                        {publication.excerpt}
                      </p>
                      
                      {/* Download Button */}
                      <a 
                        href={publication.downloadUrl}
                        download
                        className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 rounded-xl bg-primary-50 text-primary-700 font-bold text-sm hover:bg-primary-100 transition-colors group/btn"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No publications found</h3>
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
            {filteredPublications.length > 6 && (
              <div className="mt-16 text-center" data-scroll="up">
                <button className="inline-flex items-center gap-2 px-10 py-4 border-2 border-primary-900 text-primary-900 font-bold rounded-xl hover:bg-primary-900 hover:text-white transition-all shadow-sm">
                  Load More Publications
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-950 to-violet-950">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center" data-scroll="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-6 backdrop-blur-sm">
              <BookOpen className="w-4 h-4" />
              Contribute to Research
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Want to Contribute?
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              We welcome research contributions and collaboration from scholars, practitioners, and organizations working on peacebuilding and conflict resolution.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
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
