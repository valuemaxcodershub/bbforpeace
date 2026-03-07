import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout'
import { ArrowRight, Calendar, CheckCircle, Eye, Target } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata: Metadata = {
  title: 'Strategic Plan 2026-2030 | BBFORPEACE',
  description:
    'Our strategic direction for 2026-2030, outlining vision, mission and strategic pillars for sustainable peacebuilding.',
}

const defaultPillars = [
  'Peace Education & Youth Empowerment',
  'Conflict Prevention, Governance & Accountability',
  'Gender, Climate & Environmental Security',
  'Organizational Sustainability & Partnerships',
  'Livelihoods and Humanitarian',
]

export default async function StrategicPlanPage() {
  let reportsSettings: any = {}

  try {
    const payload = await getPayload({ config })
    reportsSettings = await payload.findGlobal({ slug: 'reports-settings' }) as any
  } catch (error) {
    console.error('Failed to fetch reports settings:', error)
  }

  const getImageUrl = (media: any) => {
    if (!media) return null
    if (typeof media === 'object' && media.url) return media.url
    return media
  }

  // Page header from CMS
  const heroTitle = reportsSettings.strategicTitle || 'Strategic Plan'
  const heroSubtitle = reportsSettings.strategicSubtitle || '2026 - 2030'
  const heroDescription = reportsSettings.strategicDescription || 'A practical roadmap for building resilient, peaceful and inclusive communities across Africa.'
  const heroBg = getImageUrl(reportsSettings.strategicBackgroundImage) || '/images/PXL_20251023_124331635.MP~2.jpg'

  // Content from CMS
  const coverImage = getImageUrl(reportsSettings.strategicCoverImage) || '/images/reports/2025 annual report.PNG'
  const period = reportsSettings.strategicPeriod || '2026-2030'
  const publishedDate = reportsSettings.strategicPublishedDate || 'Published March, 2026'
  const contentHeading = reportsSettings.strategicContentHeading || 'Building Peace Through Systems Change'
  const contentDescription = reportsSettings.strategicContentDescription || 'Our strategic plan sets clear priorities, outcomes and partnership pathways to deepen local peace architectures, elevate youth and women leadership, and improve policy responsiveness at national and regional levels.'
  const ctaHeading = reportsSettings.strategicCtaHeading || 'Need a detailed presentation of this strategic plan?'
  const ctaDescription = reportsSettings.strategicCtaDescription || 'Contact us for institutional partnerships, implementation support, and co-creation opportunities.'

  // Strategic pillars from CMS or defaults
  const strategicPillars = reportsSettings.strategicPillars && reportsSettings.strategicPillars.length > 0
    ? reportsSettings.strategicPillars.map((p: any) => p.title)
    : defaultPillars

  return (
    <>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        backgroundImage={heroBg}
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
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Strategic Plan {period}</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                This plan guides our interventions in youth peacebuilding, governance advocacy, gender and climate security,
                humanitarian response, and institutional strengthening.
              </p>
            </div>

            <article className="group" data-scroll="up">
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                <div className="w-full lg:w-2/5 flex-shrink-0">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={coverImage}
                      alt="BBFORPEACE Strategic Plan Cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-primary-700 text-white text-sm font-bold shadow-lg">
                      {period}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wide">{publishedDate}</span>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-black text-gray-900">{contentHeading}</h3>

                  <p className="text-gray-600 leading-relaxed text-lg">
                    {contentDescription}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {strategicPillars.map((pillar: string) => (
                      <div key={pillar} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{pillar}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                      href="/reports"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold transition-all shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                      View Reports
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      Partner With Us
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-16 rounded-2xl bg-primary-950 p-8 text-center" data-scroll="up">
              <h4 className="text-2xl font-bold text-white mb-3">{ctaHeading}</h4>
              <p className="text-gray-300 mb-6">{ctaDescription}</p>
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
