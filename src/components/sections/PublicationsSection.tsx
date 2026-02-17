import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Download } from 'lucide-react'

// Placeholder data - will be replaced with actual data from Payload
const publications = [
  {
    id: '1',
    title: 'Beyond #ENDSARS: Effecting Positive Change in Governance in Nigeria',
    coverImage: '/images/PXL_20251209_112904682.MP.jpg',
    slug: 'beyond-endsars',
    year: 2021,
  },
  {
    id: '2',
    title: 'Connecting and Amplifying Voices of Youth Building Peace in Nigeria',
    coverImage: '/images/PXL_20250919_122936323.jpg',
    slug: 'connecting-amplifying-youth-voices',
    year: 2020,
  },
  {
    id: '3',
    title: 'COVID-19 Pandemic: The Future of Peacebuilding in Nigeria',
    coverImage: '/images/PXL_20250919_124429288.MP~2.jpg',
    slug: 'covid-19-future-peacebuilding',
    year: 2020,
  },
  {
    id: '4',
    title: 'Nigeria: Shrinking Civic Space in the Name of Security',
    coverImage: '/images/WhatsApp Image 2024-09-25 at 12.37.49_611b169f.jpg',
    slug: 'shrinking-civic-space',
    year: 2019,
  },
]

export function PublicationsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12" data-scroll="up">
          <span className="inline-block text-sm font-semibold text-primary-900 uppercase tracking-wider mb-4">
            Resources
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Publications
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our research papers, policy briefs, and reports on peacebuilding and youth engagement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publications.map((pub, index) => (
            <Link
              key={pub.id}
              href={`/publications/${pub.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
              data-scroll="scale"
              data-delay={(index % 4) * 100}
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <Image
                  src={pub.coverImage}
                  alt={pub.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-primary-900 font-medium text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <span className="text-xs text-gray-500 font-medium">{pub.year}</span>
                <h4 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-900 transition-colors">
                  {pub.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10" data-scroll="up" data-delay="300">
          <Link 
            href="/publications" 
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-primary-900 border-2 border-primary-900 hover:bg-primary-900 hover:text-white transition-colors"
          >
            View All Publications
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
