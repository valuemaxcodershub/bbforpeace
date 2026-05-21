import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout'
import { ArrowRight, Calendar, BookOpen, Sparkles, Target } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload-client'
import { getMediaUrl, getPublicationFileUrl, plainTextFromRichText } from '@/lib/utils'
import { DownloadButton } from '@/components/ui/DownloadButton'

export const metadata: Metadata = {
  title: 'Strategic Plan 2026-2030 | BBFORPEACE',
  description:
    'Our strategic direction for 2026-2030, outlining vision, mission and strategic pillars for sustainable peacebuilding.',
}

const strategicPlanHero = {
  title: 'Strategic Plan',
  subtitle: '2026 - 2030',
  description:
    'Our strategic direction for 2026-2030, outlining vision, mission and strategic pillars for sustainable peacebuilding.',
  backgroundImage: '/images/PXL_20251023_124331635.MP~2.jpg',
}

export default async function StrategicPlanPage() {
  let plans: any[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'publications',
      where: { subMenu: { equals: 'strategic-plan' } },
      sort: '-year',
      limit: 20,
      depth: 2,
    })
    plans = result.docs
  } catch (error) {
    console.error('Failed to fetch strategic plans:', error)
  }

  const displayPlans = plans.map((plan: any, idx: number) => ({
    id: plan.id,
    title: plan.title,
    slug: plan.slug,
    excerpt: plainTextFromRichText(plan.excerpt || plan.description, 300),
    year: plan.year || new Date().getFullYear(),
    coverImage: getMediaUrl(plan.coverImage, '/images/reports/2025 annual report.PNG'),
    fileUrl: getPublicationFileUrl(plan),
    downloadCount: plan.downloadCount ?? 0,
    isFeatured: Boolean(plan.isFeatured) || idx === 0,
  }))

  const featuredPlan = displayPlans.find((plan) => plan.isFeatured) || displayPlans[0]
  const otherPlans = displayPlans.filter((plan) => plan.id !== featuredPlan?.id)

  return (
    <>
      <PageHero
        title={strategicPlanHero.title}
        subtitle={strategicPlanHero.subtitle}
        description={strategicPlanHero.description}
        backgroundImage={strategicPlanHero.backgroundImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Reports', href: '/reports' },
          { label: 'Strategic Plan' },
        ]}
      />

      <section className="py-20 lg:py-28 bg-linear-to-b from-gray-50 to-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16" data-scroll="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold mb-6">
                <Target className="w-4 h-4" />
                Strategic Direction
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Strategic Planning Documents</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Access the current and archived strategic planning documents that guide BBFORPEACE across youth peacebuilding, governance advocacy, climate security, and institutional growth.
              </p>
            </div>

            {featuredPlan && (
            <article className="group" data-scroll="up">
              <div className="group relative bg-linear-to-br from-primary-950 to-primary-900 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/PXL_20251023_124331635.MP~2.jpg')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-linear-to-r from-primary-950 via-primary-950/95 to-primary-950/80" />
                
                <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
                  <div className="flex flex-col justify-center order-2 lg:order-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-gold text-primary-950 text-sm font-bold">
                        <Sparkles className="w-4 h-4" />
                        Featured
                      </span>
                      <span className="flex items-center gap-1.5 text-white/70 text-sm">
                        <Calendar className="w-4 h-4" />
                        {featuredPlan.year}
                      </span>
                    </div>

                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
                      {featuredPlan.title}
                    </h2>

                    <p className="text-white/70 text-lg mb-8 leading-relaxed">
                      {featuredPlan.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={`/reports/strategic-plan/${featuredPlan.slug}`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                      >
                        <BookOpen className="w-5 h-5" />
                        Read More
                      </Link>
                      {featuredPlan.fileUrl && (
                        <DownloadButton
                          publicationId={featuredPlan.id}
                          fileUrl={featuredPlan.fileUrl}
                          initialDownloadCount={featuredPlan.downloadCount}
                          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                        />
                      )}
                    </div>
                  </div>

                  <div className="relative aspect-4/3 lg:aspect-auto order-1 lg:order-2">
                    <div className="absolute inset-0 lg:inset-4 rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={featuredPlan.coverImage}
                        alt={featuredPlan.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
            )}

            {otherPlans.length > 0 && (
              <div className="mt-16">
                <div className="mb-8 flex items-center gap-3" data-scroll="up">
                  <div className="h-1 w-12 rounded-full bg-accent-gold" />
                  <h3 className="text-2xl font-bold text-gray-900">More Strategic Plans</h3>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {otherPlans.map((plan, idx) => (
                    <article
                      key={plan.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                      data-scroll="up"
                      data-delay={idx * 100}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                          <Image
                            src={plan.coverImage}
                            alt={plan.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/30 to-transparent" />
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-900">
                              <Target className="w-3.5 h-3.5" />
                              Strategic Plan
                            </span>
                            <span className="text-sm text-gray-500">{plan.year}</span>
                          </div>

                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug">
                            {plan.title}
                          </h3>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {plan.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/reports/strategic-plan/${plan.slug}`}
                              className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm hover:text-primary-900 transition-colors group/link"
                            >
                              <BookOpen className="w-4 h-4" />
                              Read More
                              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                            {plan.fileUrl && (
                              <DownloadButton
                                publicationId={plan.id}
                                fileUrl={plan.fileUrl}
                                initialDownloadCount={plan.downloadCount}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800 hover:text-primary-950 transition-colors"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16 rounded-2xl bg-primary-950 p-8 text-center" data-scroll="up">
              <h4 className="text-2xl font-bold text-white mb-3">Need a detailed presentation of this strategic plan?</h4>
              <p className="text-gray-300 mb-6">Contact us for institutional partnerships, implementation support, and co-creation opportunities.</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white text-primary-900 hover:bg-gray-100 transition-all"
              >
                Contact BBFORPEACE
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
