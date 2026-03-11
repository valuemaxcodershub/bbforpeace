import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout'
import { ArrowRight, MessageSquareQuote, Star } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata: Metadata = {
  title: 'Testimonials | BBFORPEACE',
  description:
    'Hear from community members, partners, and youth leaders about the impact of Building Blocks for Peace Foundation.',
}

const testimonialsHero = {
  title: 'Testimonials',
  subtitle: 'Voices of Impact',
  description:
    'Hear from community members, partners, and youth leaders about the transformative impact of our peacebuilding work.',
  backgroundImage: '/images/_VEE7009 (1).jpg',
}



function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
      ))}
    </div>
  )
}

export default async function TestimonialsPage() {
  let mediaSettings: any = {}
  let testimonialDocs: any[] = []

  try {
    const payload = await getPayload({ config })
    const [pageSettings, testimonialResult] = await Promise.all([
      payload.findGlobal({ slug: 'media-page-settings' }),
      payload.find({
        collection: 'testimonials',
        where: { status: { equals: 'published' } },
        sort: 'order',
        limit: 50,
        depth: 1,
      }),
    ])
    mediaSettings = pageSettings as any
    testimonialDocs = testimonialResult.docs
  } catch (error) {
    console.error('Failed to fetch media settings:', error)
  }

  const getImageUrl = (media: any) => {
    if (!media) return null
    if (typeof media === 'object' && media.url) return media.url
    return media
  }

  const sectionHeading = mediaSettings.testimonialsSectionHeading || 'Stories of Transformation'
  const sectionDescription = mediaSettings.testimonialsSectionDescription || 'Every voice tells a story of hope, change, and the power of youth-led peacebuilding.'
  const ctaHeading = mediaSettings.testimonialsCtaHeading || 'Have a Story to Tell?'
  const ctaDescription = mediaSettings.testimonialsCtaDescription || "If our work has impacted your life or community, we'd love to hear from you. Share your experience and inspire others to join the movement for peace."
  const ctaButtonText = mediaSettings.testimonialsCtaButtonText || 'Share Your Testimonial'

  const testimonialsFromCms = testimonialDocs.map((item: any, idx: number) => ({
    id: item.id || String(idx + 1),
    name: item.name,
    role: item.role,
    quote: item.quote,
    image: getImageUrl(item.image) || '/images/_VEE7009 (1).jpg',
    rating: item.rating || 5,
    isFeatured: Boolean(item.isFeatured),
    order: item.order || 0,
  }))

  const testimonials = [...testimonialsFromCms].sort((left, right) => {
    if (left.isFeatured === right.isFeatured) return left.order - right.order
    return left.isFeatured ? -1 : 1
  })

  return (
    <>
      <PageHero
        title={testimonialsHero.title}
        subtitle={testimonialsHero.subtitle}
        description={testimonialsHero.description}
        backgroundImage={testimonialsHero.backgroundImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Media', href: '/media' },
          { label: 'Testimonials' },
        ]}
      />

      {/* Featured Testimonial */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                What People Say
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{sectionHeading}</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
                {sectionDescription}
              </p>
            </div>

            {/* Featured (first) testimonial */}
            <article
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all lg:flex mb-12"
              data-scroll="up"
            >
              <div className="relative overflow-hidden lg:w-2/5 h-72 lg:h-auto min-h-[320px]">
                <Image
                  src={testimonials[0].image}
                  alt={testimonials[0].name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
              </div>
              <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                <MessageSquareQuote className="w-10 h-10 text-primary-200 mb-4" />
                <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonials[0].quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{testimonials[0].name}</p>
                    <p className="text-sm text-gray-500">{testimonials[0].role}</p>
                    <StarRating count={testimonials[0].rating} />
                  </div>
                </div>
              </div>
            </article>

            {/* Grid of remaining testimonials */}
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.slice(1).map((item: any, idx: number) => (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                  data-scroll="scale"
                  data-delay={idx * 100}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent" />
                    <MessageSquareQuote className="absolute bottom-4 right-4 w-8 h-8 text-white/60" />
                  </div>
                  <div className="p-7">
                    <blockquote className="text-gray-600 mb-5 italic leading-relaxed line-clamp-4">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.role}</p>
                        <StarRating count={item.rating} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA section */}
            <div
              className="mt-20 p-10 lg:p-16 rounded-3xl relative overflow-hidden bg-fixed bg-cover bg-center text-center"
              style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
              data-scroll="up"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-primary-950/95" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
                  <span className="w-8 h-[2px] bg-accent-gold" />
                  Share Your Story
                  <span className="w-8 h-[2px] bg-accent-gold" />
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {ctaHeading}
                </h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                  {ctaDescription}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent-gold/30"
                >
                  {ctaButtonText} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
