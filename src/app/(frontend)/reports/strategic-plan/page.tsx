import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout'
import { ArrowRight, Calendar, Download, Eye, Sparkles, Target } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

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

const defaultPlans = [
  {
    id: 'strategic-plan-2026-2030',
    title: 'Strategic Plan 2026-2030',
    excerpt:
      'A practical roadmap for building resilient, peaceful and inclusive communities across Africa through five interlinked strategic pillars.',
    year: 2026,
    coverImage: '/images/reports/2025 annual report.PNG',
    fileUrl: '#',
    isFeatured: true,
  },
]

export default async function StrategicPlanPage() {
  let plans: any[] = []

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'publications',
      where: { subMenu: { equals: 'strategic-plan' } },
      sort: '-year',
      limit: 20,
      depth: 1,
    })
    plans = result.docs
  } catch (error) {
    console.error('Failed to fetch strategic plans:', error)
  }

  const getImageUrl = (media: any) => {
    if (!media) return null
    if (typeof media === 'object' && media.url) return media.url
    return media
  }

  const displayPlans = plans.length
    ? plans.map((plan: any, idx: number) => ({
        id: plan.id,
        title: plan.title,
        excerpt: plan.excerpt || plan.description || '',
        year: plan.year || new Date().getFullYear(),
        coverImage: getImageUrl(plan.coverImage) || '/images/reports/2025 annual report.PNG',
        fileUrl: typeof plan.file === 'object' && plan.file?.url ? plan.file.url : '#',
        isFeatured: Boolean(plan.isFeatured) || idx === 0,
      }))
    : defaultPlans

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

      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
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
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                <div className="w-full lg:w-2/5 flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={featuredPlan.coverImage}
                      alt={featuredPlan.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-primary-700 text-white text-sm font-bold shadow-lg">
                      {featuredPlan.year}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wide">Strategic Plan {featuredPlan.year}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-800">
                    <Sparkles className="w-4 h-4" />
                    Featured Document
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-black text-gray-900">{featuredPlan.title}</h3>

                  <p className="text-gray-600 leading-relaxed text-lg">
                    {featuredPlan.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                      href={featuredPlan.fileUrl}
                      target="_blank"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold transition-all shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download Plan
                    </Link>
                    <Link
                      href={featuredPlan.fileUrl}
                      target="_blank"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      View Online
                    </Link>
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

                <div className="grid gap-6 md:grid-cols-2">
                  {otherPlans.map((plan, idx) => (
                    <article
                      key={plan.id}
                      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
                      data-scroll="up"
                      data-delay={idx * 100}
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-900">
                          <Target className="w-3.5 h-3.5" />
                          Strategic Plan
                        </span>
                        <span className="text-sm font-semibold text-gray-500">{plan.year}</span>
                      </div>
                      <h4 className="mb-3 text-xl font-bold text-gray-900">{plan.title}</h4>
                      <p className="mb-5 text-sm leading-relaxed text-gray-600">{plan.excerpt}</p>
                      <Link
                        href={plan.fileUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 font-bold text-primary-900 transition-all hover:gap-3"
                      >
                        Open Document
                        <ArrowRight className="w-4 h-4" />
                      </Link>
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
