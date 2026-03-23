import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout'
import { 
  Users, Target, CheckCircle, ArrowRight, BookOpen, Shield, 
  Globe, Leaf, Heart, Sparkles 
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload-client'
import { getMediaUrl } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  BookOpen, Shield, Leaf, Globe, Heart, Users, Target,
}

const colorMap = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500']

export const metadata: Metadata = {
  title: 'Our Programmes | BBFORPEACE',
  description:
    'Explore our peacebuilding programmes focused on youth empowerment, community dialogue, peace education, and conflict resolution.',
}

const programmesHero = {
  title: 'Our Programmes',
  subtitle: 'Strategic Initiatives',
  description:
    'Five interlinked impact areas guiding our work toward sustainable peace in Nigeria and West Africa.',
  backgroundImage: '/images/_VEE7009 (1).jpg',
}

export default async function ProgrammesPage() {
  let settings: any = {}
  let programmes: any[] = []

  try {
    const payload = await getPayloadClient()
    const [pageSettings, programmesResult] = await Promise.all([
      payload.findGlobal({ slug: 'programme-page-settings' }),
      payload.find({ collection: 'programmes', where: { status: { equals: 'active' } }, sort: 'order', limit: 10, depth: 1 }),
    ])
    settings = pageSettings as any
    programmes = programmesResult.docs
  } catch (error) {
    console.error('Failed to fetch programmes data:', error)
  }

  const overviewBadge = settings.overviewBadge || '2026 - 2030 Strategy'
  const overviewHeading = settings.overviewHeading || 'Strategic Pillars'
  const ctaBadge = settings.ctaBadge || 'Get Involved'
  const ctaHeading = settings.ctaHeading || 'Support Our Programmes'
  const ctaDescription = settings.ctaDescription || 'Your support helps us expand our reach and impact more communities. Join us as a partner, donor, or volunteer.'

  // Fallback pillars when collection is empty
  const defaultPillars = [
    { id: 1, icon: 'BookOpen', title: 'Peace Education & Youth Empowerment', color: 'bg-blue-500', image: '/images/_VEE7124 (1).jpg', shortDescription: 'Integrating peace education into school curricula and empowering young people with leadership skills, conflict resolution techniques, and advocacy training.', objectives: [{ objective: 'Train educators in peace education methodologies' }, { objective: 'Establish youth peace clubs across communities' }, { objective: 'Develop localized peace education curriculum' }], achievements: [{ metric: '5,000+ youth trained' }, { metric: '75 youth peace clubs established' }, { metric: 'Curriculum adopted in 25+ schools' }] },
    { id: 2, icon: 'Shield', title: 'Conflict Prevention, Governance & Accountability', color: 'bg-green-500', image: '/images/_VEE7017 (19) (1).jpg', shortDescription: 'Facilitating constructive conversations between diverse community groups, building early warning systems, and promoting transparent governance.', objectives: [{ objective: 'Conduct community dialogues annually' }, { objective: 'Train dialogue facilitators' }, { objective: 'Establish early warning systems' }], achievements: [{ metric: '150+ community dialogues held' }, { metric: '120 trained facilitators' }, { metric: '15 communities with early warning' }] },
    { id: 3, icon: 'Leaf', title: 'Gender, Climate & Environmental Security', color: 'bg-yellow-500', image: '/images/_VEE6887 (20).jpg', shortDescription: 'Supporting women as key actors in peacebuilding and addressing the nexus between climate change, environmental degradation, and conflict.', objectives: [{ objective: 'Train women in conflict resolution' }, { objective: 'Support women-led peace initiatives' }, { objective: 'Advocate for gender-inclusive peace processes' }], achievements: [{ metric: '250+ women trained' }, { metric: '80 initiatives supported' }, { metric: '5 policy advocacy campaigns' }] },
    { id: 4, icon: 'Globe', title: 'Organizational Sustainability & Partnerships', color: 'bg-purple-500', image: '/images/_VEE7037 (1).jpg', shortDescription: 'Building strategic partnerships with local and international organizations to expand our reach and ensure long-term sustainability.', objectives: [{ objective: 'Expand regional network across West Africa' }, { objective: 'Strengthen GPPAC secretariat role' }, { objective: 'Develop sustainable funding models' }], achievements: [{ metric: 'GPPAC West Africa Secretariat' }, { metric: 'WAYPAN Regional Network' }, { metric: 'Member of UNOY' }] },
    { id: 5, icon: 'Heart', title: 'Livelihoods & Humanitarian', color: 'bg-red-500', image: '/images/_VEE7153 (6).jpg', shortDescription: 'Providing economic empowerment opportunities and humanitarian support to conflict-affected communities.', objectives: [{ objective: 'Economic empowerment for vulnerable youth' }, { objective: 'Humanitarian response in conflict zones' }, { objective: 'Livelihood support programs' }], achievements: [{ metric: 'Economic training workshops' }, { metric: 'Humanitarian aid distribution' }, { metric: 'Community support initiatives' }] },
  ]

  const displayPillars = programmes.length ? programmes.map((p: any, idx: number) => ({
    id: p.id || idx + 1,
    icon: p.icon || 'BookOpen',
    title: p.title,
    color: colorMap[idx % colorMap.length],
    image: getMediaUrl(p.featuredImage),
    shortDescription: p.shortDescription || '',
    objectives: p.objectives || [],
    achievements: p.achievements || [],
  })) : defaultPillars
  return (
    <>
      <PageHero
        title={programmesHero.title}
        subtitle={programmesHero.subtitle}
        description={programmesHero.description}
        backgroundImage={programmesHero.backgroundImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programmes', href: '/programmes' },
        ]}
      />

        {/* Strategic Pillars Overview */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-primary-900" />
                {overviewBadge}
                <span className="w-8 h-[2px] bg-primary-900" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{overviewHeading}</h2>
            </div>
            <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5" data-scroll="scale">
              {displayPillars.map((pillar: any, idx: number) => {
                const Icon = iconMap[pillar.icon] || BookOpen
                return (
                  <a 
                    key={pillar.id} 
                    href={`#pillar-${pillar.id}`}
                    className="group p-6 rounded-2xl border border-gray-100 hover:border-primary-200 bg-white hover:shadow-xl transition-all text-center"
                    data-scroll="scale"
                    data-delay={idx * 100}
                  >
                    <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{pillar.title}</p>
                  </a>
                )
              })}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Programmes */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
            <div className="space-y-32">
              {displayPillars.map((pillar: any, index: number) => {
                const Icon = iconMap[pillar.icon] || BookOpen
                return (
                  <div
                    key={pillar.id}
                    id={`pillar-${pillar.id}`}
                    className="scroll-mt-24"
                    data-scroll={index % 2 === 0 ? 'left' : 'right'}
                  >
                    <div className={`grid lg:grid-cols-2 gap-16 items-center ${
                      index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}>
                      {/* Image */}
                      <div className="relative group">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                          <Image
                            src={pillar.image}
                            alt={pillar.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-950/20 to-transparent" />
                          <div className={`absolute top-6 left-6 w-16 h-16 ${pillar.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className={`absolute -z-10 w-full h-full rounded-3xl ${
                          index % 2 === 0
                            ? '-bottom-5 -right-5 bg-gradient-to-br from-primary-200 to-primary-100'
                            : '-bottom-5 -left-5 bg-gradient-to-br from-gray-200 to-gray-100'
                        }`} />
                      </div>

                      {/* Content */}
                      <div>
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-full mb-5 ${pillar.color} text-white shadow-lg`}>
                          <Sparkles className="w-4 h-4" />
                          Pillar {pillar.id}
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                          {pillar.title}
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                          {pillar.shortDescription}
                        </p>

                        {/* Objectives */}
                        <div className="mb-8">
                          <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
                            <Target className="w-5 h-5 text-primary-900 mr-2" />
                            Key Objectives
                          </h3>
                          <ul className="space-y-3">
                            {pillar.objectives.map((obj: any, i: number) => (
                              <li key={i} className="flex items-start text-gray-600">
                                <span className="w-2 h-2 bg-accent-gold rounded-full mt-2 mr-3 flex-shrink-0" />
                                {obj.objective || obj}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Achievements */}
                        <div className="mb-8">
                          <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            Achievements
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {pillar.achievements.map((ach: any, i: number) => (
                              <span 
                                key={i} 
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                {ach.metric || ach.title || ach}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 text-primary-900 font-bold hover:gap-3 transition-all group"
                        >
                          Learn More <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>            </div>          </div>
        </section>

        {/* CTA Section */}
        <section 
          className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-primary-950/95" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-6">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Get Involved
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {ctaHeading}
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                {ctaDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent-gold/30"
                >
                  Partner With Us <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-primary-900 transition-colors"
                >
                  Support Us
                </a>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}
