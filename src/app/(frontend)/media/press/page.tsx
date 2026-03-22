import { PageHero } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMediaUrl } from '@/lib/utils'

export const metadata = {
  title: 'Press Statements | BBFORPEACE',
  description: 'Official press statements and announcements from Building Blocks for Peace Foundation.',
}

const pressHero = {
  title: 'Press Statements',
  subtitle: 'Media',
  description:
    'Official announcements, press releases, and statements from Building Blocks for Peace Foundation.',
  backgroundImage: '/images/_VEE7009 (1).jpg',
}

export default async function PressPage() {
  let pressStatements: any[] = []
  try {
    const payload = await getPayload({ config })
    const [postsResult] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { subMenu: { equals: 'press-statement' }, status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 20,
        depth: 1,
      }),
    ])

    pressStatements = postsResult.docs.map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || '',
      date: post.publishedAt || post.createdAt,
      slug: post.slug,
      image: getMediaUrl(post.featuredImage, '/images/_VEE7009 (1).jpg'),
    }))
  } catch (error) {
    console.error('Failed to fetch press statements:', error)
  }

  return (
    <>
      <PageHero
        title={pressHero.title}
        subtitle={pressHero.subtitle}
        description={pressHero.description}
        backgroundImage={pressHero.backgroundImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Media', href: '/media' },
          { label: 'Press', href: '/media/press' },
        ]}
      />

      <section className="py-20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                Announcements
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Official Press Releases</h2>
            </div>
            <div className="grid gap-10">
              {pressStatements.map((item, idx) => (
                <article 
                  key={item.id}
                  className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all ${
                    idx === 0 ? 'lg:flex' : ''
                  }`}
                  data-scroll={idx === 0 ? 'up' : 'scale'}
                  data-delay={idx * 100}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${idx === 0 ? 'lg:w-1/2 h-72 lg:h-auto' : 'h-56'}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className={`p-7 ${idx === 0 ? 'lg:w-1/2 lg:p-10 flex flex-col justify-center' : ''}`}>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-medium">
                      <Calendar className="w-4 h-4 text-accent-gold" />
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h2 className={`font-bold text-gray-900 mb-4 group-hover:text-primary-900 transition-colors leading-tight ${
                      idx === 0 ? 'text-2xl lg:text-3xl xl:text-4xl' : 'text-xl'
                    }`}>
                      {item.title}
                    </h2>
                    <p className="text-gray-600 mb-6 line-clamp-3 text-lg">
                      {item.excerpt}
                    </p>
                    <Link
                      href={`/media/press/${item.slug}`}
                      className="inline-flex items-center gap-2 text-primary-900 font-bold hover:gap-3 transition-all group/link"
                    >
                      Read Full Statement
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            
            {/* CTA */}
            <div 
              className="mt-20 p-10 lg:p-16 rounded-3xl relative overflow-hidden bg-fixed bg-cover bg-center text-center"
              style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
              data-scroll="up"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-primary-950/95" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
                  <span className="w-8 h-[2px] bg-accent-gold" />
                  Media Inquiries
                  <span className="w-8 h-[2px] bg-accent-gold" />
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Press & Media Contact</h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">For press inquiries, interview requests, or media partnerships, please contact our communications team.</p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent-gold/30"
                >
                  Contact Media Team <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            </div>
          </div>
        </section>
    </>
  )
}
