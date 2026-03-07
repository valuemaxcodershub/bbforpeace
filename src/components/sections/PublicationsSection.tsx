import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Download, Sparkles } from 'lucide-react'

// Default fallback data
const defaultPublications = [
  { id: '1', title: '2025 Annual Report: Consolidating Peace', coverImage: '/images/PXL_20251023_124331635.MP~2.jpg', downloadUrl: '/documents/BBFORPEACE ANNUAL REPORT 2025.pdf', year: 2025, type: 'Annual Report' },
  { id: '2', title: '2024 Annual Report: Building Resilient Communities', coverImage: '/images/_VEE7037 (1).jpg', downloadUrl: '/documents/BBFORPEACE ANNUAL REPORT 2024.pdf', year: 2024, type: 'Annual Report' },
  { id: '3', title: 'Beyond #ENDSARS: Effecting Positive Change', coverImage: '/images/PXL_20251209_112904682.MP.jpg', downloadUrl: 'https://drive.google.com/file/d/1ABC123/view', year: 2021, type: 'Policy Brief' },
  { id: '4', title: 'Nigeria: Shrinking Civic Space', coverImage: '/images/WhatsApp Image 2024-09-25 at 12.37.49_611b169f.jpg', downloadUrl: 'https://drive.google.com/file/d/1DEF456/view', year: 2019, type: 'Research' },
]

export interface PublicationsSectionProps {
  publications?: {
    id: string
    title: string
    coverImage?: { url?: string } | string | null
    file?: { url?: string } | string | null
    year?: number | null
    category?: string | null
  }[]
}

export function PublicationsSection({ publications: pubsProp }: PublicationsSectionProps) {
  const publications = pubsProp?.length ? pubsProp.map(p => ({
    id: p.id,
    title: p.title,
    coverImage: typeof p.coverImage === 'string' ? p.coverImage : p.coverImage?.url || '/images/PXL_20251023_124331635.MP~2.jpg',
    downloadUrl: typeof p.file === 'string' ? p.file : p.file?.url || '#',
    year: p.year || new Date().getFullYear(),
    type: p.category || 'Report',
  })) : defaultPublications
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14\" data-scroll="up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-primary-900" />
            <span className="inline-flex items-center gap-2 text-primary-900 text-sm font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              Resources
            </span>
            <span className="w-10 h-[2px] bg-primary-900" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Recent Publications
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our research papers, policy briefs, and reports on peacebuilding and youth engagement.
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {publications.map((pub, index) => (
            <div
              key={pub.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              data-scroll="scale"
              data-delay={(index % 4) * 100}
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <Image
                  src={pub.coverImage}
                  alt={pub.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-primary-900 shadow-lg">
                    {pub.type}
                  </span>
                </div>
                {/* Download Overlay */}
                <Link 
                  href={pub.downloadUrl}
                  target="_blank"
                  className="absolute inset-0 bg-primary-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent-gold flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Download className="w-8 h-8 text-primary-950" />
                  </div>
                  <span className="text-white font-bold text-lg">Download Report</span>
                </Link>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600 font-semibold">{pub.year}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary-900 transition-colors leading-snug">
                  {pub.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12" data-scroll="up" data-delay="300">
          <Link 
            href="/publications" 
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-primary-900 border-2 border-primary-900 hover:bg-primary-900 hover:text-white transition-all"
          >
            View All Publications
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
