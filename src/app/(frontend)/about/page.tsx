import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout'
import { BoardMemberCard } from '@/components/cards/BoardMemberCard'
import { 
  Target, Eye, CheckCircle, Shield, Users, Lightbulb, 
  Handshake, Heart, UserCheck, Award, Calendar, MapPin,
  Linkedin, Twitter, Mail, ArrowRight,
  GraduationCap, Scale, Leaf, Building2, HeartHandshake
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload-client'
import { getMediaUrl } from '@/lib/utils'

const coreValueIconMap: Record<string, LucideIcon> = {
  Shield, Users, Lightbulb, Handshake, Heart, UserCheck,
}
const pillarIconMap: Record<string, LucideIcon> = {
  GraduationCap, Scale, Leaf, Building2, HeartHandshake,
}
const pillarShadowMap: Record<string, string> = {
  'from-blue-500 to-cyan-400': 'shadow-blue-500/30',
  'from-emerald-500 to-green-400': 'shadow-emerald-500/30',
  'from-amber-500 to-yellow-400': 'shadow-amber-500/30',
  'from-violet-500 to-purple-400': 'shadow-violet-500/30',
  'from-rose-500 to-pink-400': 'shadow-rose-500/30',
}

export const metadata: Metadata = {
  title: 'About Us | BBFORPEACE',
  description: 'Learn about Building Blocks for Peace Foundation - a youth-led peacebuilding NGO working to create sustainable peace through knowledge-sharing, policy advocacy, partnerships and programs.',
}

const aboutHero = {
  title: 'About Us',
  subtitle: 'Who We Are',
  description:
    'A youth-led organization bridging grassroots action, policy advocacy, and regional networking for sustainable peace.',
  backgroundImage: '/images/_VEE7009 (1).jpg',
}

export default async function AboutPage() {
  // Fetch all data in parallel
  let as: Record<string, any> = {}
  let teamMembers: any[] = []
  let boardOfTrustees: any[] = []
  let partnersData: any = null
  let awardData: any = null
  let partnersDocs: any[] = []

  try {
    const payload = await getPayloadClient()
    const [aboutSettings, teamResult, boardResult, partners, awards, partnersCollection] = await Promise.all([
        payload.findGlobal({ slug: 'about-us-page-settings' }).catch(() => ({})),
        payload.find({ collection: 'team', where: { category: { equals: 'staff' }, isActive: { equals: true } }, sort: 'order', limit: 20, depth: 1 }).catch(() => ({ docs: [] })),
        payload.find({ collection: 'team', where: { category: { equals: 'board' }, isActive: { equals: true } }, sort: 'order', limit: 20, depth: 1 }).catch(() => ({ docs: [] })),
        payload.findGlobal({ slug: 'partners-settings' }).catch(() => null),
        payload.findGlobal({ slug: 'award-settings' }).catch(() => null),
        payload.find({ collection: 'partners', where: { isActive: { equals: true } }, sort: 'order', limit: 20, depth: 1 }).catch(() => ({ docs: [] })),
      ])
      as = (aboutSettings ?? {}) as Record<string, any>
      teamMembers = (teamResult as any)?.docs ?? []
      boardOfTrustees = (boardResult as any)?.docs ?? []
      partnersData = partners as any
      awardData = awards as any
      partnersDocs = (partnersCollection as any)?.docs ?? []
  } catch (error) {
    console.error('Failed to fetch about page data:', error)
  }

  // Defaults
  const storyP1 = as.storyParagraph1 || 'Building Blocks for Peace (BBFORPEACE) Foundation is a non-governmental organization working on Conflict Prevention, Prevention of Violent Extremism, Peacebuilding and Sustainable Development in Nigeria.'
  const storyP2 = as.storyParagraph2 || 'Founded by Rafiu Adeniran Lawal, BBFORPEACE began with the Nigeria Youth 4 Peace Initiative in 2016 — a movement of young people dissatisfied with the increasing participation of youth in violent extremism and their exclusion from decision-making processes.'
  const storyP3 = as.storyParagraph3 || 'Through our Youth4Peace initiative, we have trained and empowered over 5,000 youth and children with support from several local and international stakeholders.'

  const milestones = as.milestones?.length ? as.milestones : [
    { year: '2016', event: 'Nigeria Youth 4 Peace Initiative founded' },
    { year: '2017', event: 'BBFORPEACE incorporated with Corporate Affairs Commission' },
    { year: '2020', event: 'Became GPPAC West Africa Regional Secretariat' },
    { year: '2023', event: 'Best Young Peacebuilding Organisation Award (WANEP)' },
    { year: '2024', event: 'WAYPAN Regional Network established' },
    { year: '2025', event: 'National Youth Development Award' },
  ]

  const storyImages = [
    getMediaUrl(as.storyImage1, '/images/_VEE6792.jpg'),
    getMediaUrl(as.storyImage2, '/images/_VEE7124 (1).jpg'),
    getMediaUrl(as.storyImage3, '/images/_VEE7037 (1).jpg'),
    getMediaUrl(as.storyImage4, '/images/PXL_20251008_122828933.jpg'),
  ]

  const visionText = as.vision || 'A peaceful, just and inclusive Africa where youth, women and men lead resilient communities, accountable governance, and sustainable development.'
  const missionText = as.mission || 'To equip youth, women and men as peacebuilders to prevent violent conflict, protect civic space, and promote sustainable peace through knowledge-sharing, policy advocacy, partnerships and programs.'

  const coreValues = as.coreValues?.length ? as.coreValues : [
    { icon: 'Shield', title: 'Integrity & Accountability', description: 'Transparency in all our actions and decisions' },
    { icon: 'Users', title: 'Inclusivity & Gender Equality', description: 'Ensuring all voices are heard and represented' },
    { icon: 'Lightbulb', title: 'Innovation & Learning', description: 'Continuously improving our approaches' },
    { icon: 'Handshake', title: 'Collaboration & Solidarity', description: 'Working together for greater impact' },
    { icon: 'Heart', title: 'Non-Violence & Do No Harm', description: 'Peace in all our methods and actions' },
    { icon: 'UserCheck', title: 'Youth Leadership', description: 'Young people at the center of decision-making' },
  ]

  const strategyPeriod = as.strategyPeriod || '2026 - 2030'
  const strategicPillars = as.strategicPillars?.length ? as.strategicPillars : [
    { title: 'Peace Education & Youth Empowerment', icon: 'GraduationCap', gradient: 'from-blue-500 to-cyan-400' },
    { title: 'Conflict Prevention, Governance & Accountability', icon: 'Scale', gradient: 'from-emerald-500 to-green-400' },
    { title: 'Gender, Climate & Environmental Security', icon: 'Leaf', gradient: 'from-amber-500 to-yellow-400' },
    { title: 'Organizational Sustainability & Partnerships', icon: 'Building2', gradient: 'from-violet-500 to-purple-400' },
    { title: 'Livelihoods and Humanitarian', icon: 'HeartHandshake', gradient: 'from-rose-500 to-pink-400' },
  ]

  const uniqueIntro = as.uniqueIntro || "In Nigeria's peacebuilding ecosystem, BBFORPEACE occupies a unique niche as one of the few truly youth-led organizations operating from the grassroots to policy level."
  const uniquePoints = as.uniquePoints?.length ? as.uniquePoints : [
    { title: 'Youth-Led & Grassroots-Informed', description: 'Co-founded and run by young peacebuilders with authenticity among youth constituencies.' },
    { title: 'Policy-Engaged', description: 'Contributing to YPS and WPS action plans across West Africa.' },
    { title: 'GPPAC Regional Secretariat', description: 'West Africa secretariat for Global Partnership for Prevention of Armed Conflict.' },
    { title: 'Global Youth Networks', description: 'Active in United Network of Young Peacebuilders.' },
  ]

  const aboutAwards = awardData?.awards?.length ? awardData.awards : as.aboutAwards?.length ? as.aboutAwards : [
    { title: 'National Youth Development Award', organization: 'Federal Ministry of Youth Development, Abuja', year: '2025' },
    { title: 'Best Young Peacebuilding Organisation', organization: 'West Africa Network for Peacebuilding (WANEP-Nigeria)', year: '2023' },
  ]

  const teamHeading = as.teamHeading || 'Meet Our Team'
  const teamDescription = as.teamDescription || 'Passionate young leaders dedicated to building peace and empowering communities.'
  const boardHeading = as.boardHeading || 'Board of Trustees'
  const boardDescription = as.boardDescription || 'Our distinguished board members provide strategic oversight and guidance for the organization.'

  const ctaHeading = as.ctaHeading || 'Join Us in Building Peace'
  const ctaDescription = as.ctaDescription || 'Whether as a volunteer, partner, or supporter, there are many ways to contribute to our mission.'
  const headOfficeAddress = as.headOfficeAddress || '256, 1st Avenue, FHA, Lugbe'
  const headOfficeCity = as.headOfficeCity || 'Abuja, Nigeria'
  const headOfficePhone = as.headOfficePhone || '+234-8054151494'
  const regionOfficeAddress = as.regionOfficeAddress || '35, Edward Ujege Street, High Level'
  const regionOfficeCity = as.regionOfficeCity || 'Makurdi, Benue State'
  const regionOfficeEmail = as.regionOfficeEmail || 'info@bbforpeace.org'

  // Name-based fallback so DB partners without uploaded logos still get the right image
  const partnerLogoFallback: Record<string, string> = {
    'GPPAC': '/images/partners/gppac.jfif',
    'GPPAC Foundation': '/images/partners/gppac.jfif',
    'WANEP': '/images/partners/wanep.png',
    'West Africa Network for Peacebuilding': '/images/partners/wanep.png',
    'British Council': '/images/partners/British_Council_logo.svg.png',
    'MacArthur Foundation': '/images/partners/maaurthor.jfif',
    'Open Society Foundations': '/images/partners/open%20society%20foundation.png',
    'Ford Foundation': '/images/partners/ford.png',
  }

  // Partners - prefer collection data, fallback to hardcoded
  const partners = partnersDocs.length ? partnersDocs.map((p: any) => ({
    name: p.name,
    description: p.description || '',
    logo: getMediaUrl(p.logo, partnerLogoFallback[p.name] || '/images/partners/gppac.jfif'),
  })) : [
    { name: 'GPPAC', description: 'Global Partnership for Prevention of Armed Conflict', logo: '/images/partners/gppac.jfif' },
    { name: 'WANEP', description: 'West Africa Network for Peacebuilding', logo: '/images/partners/wanep.png' },
    { name: 'British Council', description: 'Education & Cultural Relations', logo: '/images/partners/British_Council_logo.svg.png' },
    { name: 'MacArthur Foundation', description: 'Funding Partner', logo: '/images/partners/maaurthor.jfif' },
    { name: 'Open Society Foundations', description: 'Civic Space Protection', logo: '/images/partners/open%20society%20foundation.png' },
    { name: 'Ford Foundation', description: 'Social Justice Funding', logo: '/images/partners/ford.png' },
  ]

  // Fallback team data when collection is empty
  const defaultTeam = [
    { name: 'Rafiu Adeniran Lawal', position: 'Executive Director', shortBio: 'Founder of BBFORPEACE with extensive experience in youth peacebuilding, policy advocacy, and regional networking across West Africa.', photo: { url: '/images/ourteam/1. Rafiu Adeniran Lawal, Executive Director.jpeg' }, email: 'r.lawal@bbforpeace.org', socialLinks: { linkedin: '#', twitter: '#' } },
    { name: 'Anthonia Folashade', position: 'Communications Manager', shortBio: 'Passionate about storytelling for social change and amplifying youth voices across media platforms.', photo: { url: '/images/ourteam/2. Anthonia Folashade, Communications Manager.png' }, email: 'comms@bbforpeace.org' },
    { name: 'Eseimokumo Albert', position: 'Project Officer (Youth, Peace and Security)', shortBio: 'Expert in youth engagement and peacebuilding program design and implementation.', photo: { url: '/images/ourteam/3. Eseimokumo Albert, Project Officer (Youth, Peace and Security).jpeg' }, email: 'yps@bbforpeace.org' },
    { name: 'Samson Shabu', position: 'Project Officer (Climate, Peace and Security)', shortBio: 'Focused on the nexus between climate change, environmental security, and peacebuilding.', photo: { url: '/images/ourteam/5. Samson Shabu, Project Officer (Climate, Peace and Security).jpeg' }, email: 'climate@bbforpeace.org' },
    { name: 'Mercy Oyip', position: 'Wellbeing and Admin Assistant', shortBio: 'Ensuring organizational wellbeing and smooth administrative operations.', photo: { url: '/images/ourteam/4. Mercy Oyip, Wellbeing and Admin Assistant.jpeg' }, email: 'admin@bbforpeace.org' },
    { name: 'Project Intern', position: 'Gender, Monitoring and Evaluation', shortBio: 'Supporting gender mainstreaming and monitoring & evaluation across all programs.', photo: { url: '/images/ourteam/6. Project Intern (Gender, Monitoring and Evaluation).jpeg' }, email: 'me@bbforpeace.org' },
  ]
  const defaultBoard = [
    { name: 'Professor Charles Ukeje', position: 'Board Chair', shortBio: 'Professor of International Relations at Obafemi Awolowo University with global research experience.', photo: { url: '/images/board/Professor Charles Ukeje (Board Chair).png' } },
    { name: 'Rafiu Adeniran Lawal', position: 'Board Secretary', shortBio: 'Founder and Executive Director of BBFORPEACE. Master\'s in Peace and Conflict Studies from University of Ibadan.', photo: { url: '/images/board/Rafiu Adeniran Lawal (Board Secretary).jpeg' } },
    { name: 'Lantana Bako Abdullahi', position: 'Member', shortBio: 'Extensive experience in mediation and interreligious dialogues. Member of African Union FEMWISE.', photo: { url: '/images/board/Lantana Bako Abdullahi (Member).jpeg' } },
    { name: 'Mautin Akapo, ACA, ACTI', position: 'Member', shortBio: 'Principal at MHL & Associates with 15 years of experience in tax, accounting, and grants management.', photo: { url: '/images/board/Mautin Akapo, ACA, ACTI (Member).jpeg' } },
    { name: 'Olayinka Risikat Lawal', position: 'Member', shortBio: 'Nigerian Business Administrator, Philanthropist, and Managing Director of Albarka Group of Companies.', photo: { url: '/images/board/Olayinka Risikat Lawal (Member).jpeg' } },
    { name: 'Princess Moyinoluwa Olubunmi Falowo', position: 'Member', shortBio: 'Former Regent at Ibule-Soro Kingdom focusing on grassroots community development initiatives.', photo: { url: '/images/board/Princess Moyinoluwa Olubunmi Falowo (Member).jpeg' } },
  ]

  const displayTeam = teamMembers.length ? teamMembers : defaultTeam
  const displayBoard = boardOfTrustees.length ? boardOfTrustees : defaultBoard
  return (
    <>
      <PageHero
        title={aboutHero.title}
        subtitle={aboutHero.subtitle}
        description={aboutHero.description}
        backgroundImage={aboutHero.backgroundImage}
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* History Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div data-scroll="left">
                <span className="inline-flex items-center gap-3 text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                  <span className="w-8 h-[2px] bg-accent-gold" />
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Building Peace <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-900">Since 2016</span>
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{storyP1}</p>
                  <p>{storyP2}</p>
                  <p>{storyP3}</p>
                </div>

                {/* Timeline */}
                <div className="mt-10 relative bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-white shadow-lg">
                  <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-accent-gold via-primary-600 to-primary-200" />
                  <div className="space-y-5">
                    {milestones.map((milestone: any, idx: number) => {
                      const colors = [
                        'from-rose-400 to-pink-500',
                        'from-amber-400 to-orange-500',
                        'from-emerald-400 to-teal-500',
                        'from-sky-400 to-cyan-500',
                        'from-violet-400 to-purple-500',
                        'from-fuchsia-400 to-pink-500',
                      ]
                      return (
                      <div key={idx} className="flex items-start gap-4 relative">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center flex-shrink-0 z-10 shadow-lg`}>
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 pt-1">
                          <span className="text-sm font-bold text-accent-gold">{milestone.year}</span>
                          <p className="text-gray-700">{milestone.event}</p>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              </div>

              <div className="relative" data-scroll="right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform">
                      <Image src={storyImages[0]} alt="Team" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden shadow-xl -rotate-1 hover:rotate-0 transition-transform">
                      <Image src={storyImages[1]} alt="Workshop" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-transform">
                      <Image src={storyImages[2]} alt="Community" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-xl -rotate-2 hover:rotate-0 transition-transform">
                      <Image src={storyImages[3]} alt="Award" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="text-center mb-10" data-scroll="up">
                <span className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold uppercase tracking-wider mb-3">
                  <span className="w-6 h-px bg-primary-400" />
                  Our Purpose
                  <span className="w-6 h-px bg-primary-400" />
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Vision & Mission</h2>
              </div>
              
              {/* Cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Vision */}
                <div className="group bg-white rounded-xl p-6 border-l-4 border-violet-500 shadow-sm hover:shadow-md transition-shadow" data-scroll="left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{visionText}</p>
                </div>
                
                {/* Mission */}
                <div className="group bg-white rounded-xl p-6 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow" data-scroll="right">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{missionText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                What Guides Us
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreValues.map((value: any, idx: number) => {
                const Icon = coreValueIconMap[value.icon] || Shield
                const colors = [
                  'from-rose-100 to-pink-50 hover:from-rose-200 hover:to-pink-100',
                  'from-sky-100 to-cyan-50 hover:from-sky-200 hover:to-cyan-100',
                  'from-violet-100 to-purple-50 hover:from-violet-200 hover:to-purple-100',
                  'from-amber-100 to-orange-50 hover:from-amber-200 hover:to-orange-100',
                  'from-emerald-100 to-teal-50 hover:from-emerald-200 hover:to-teal-100',
                  'from-fuchsia-100 to-pink-50 hover:from-fuchsia-200 hover:to-pink-100',
                ]
                const iconColors = [
                  'from-rose-500 to-pink-500',
                  'from-sky-500 to-cyan-500',
                  'from-violet-500 to-purple-500',
                  'from-amber-500 to-orange-500',
                  'from-emerald-500 to-teal-500',
                  'from-fuchsia-500 to-pink-500',
                ]
                return (
                  <div key={idx} className={`group p-6 rounded-[1.5rem] bg-gradient-to-br ${colors[idx % colors.length]} border border-white shadow-sm hover:shadow-xl transition-all duration-300`} data-scroll="scale" data-delay={idx * 100}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconColors[idx % iconColors.length]} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                )
              })}
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Pillars */}
        <section 
          id="strategy"
          className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
        >
          <div className="absolute inset-0 bg-primary-950/90" />
          <div className="container relative z-10">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                {strategyPeriod}
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Strategic Pillars</h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">Our five interlinked impact areas guiding our work over the next five years.</p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {strategicPillars.map((pillar: any, idx: number) => {
                  const IconComponent = pillarIconMap[pillar.icon] || GraduationCap
                  const shadow = pillarShadowMap[pillar.gradient] || 'shadow-blue-500/30'
                  return (
                    <div key={idx} className="group bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/20 hover:border-accent-gold/30 transition-all text-center" data-scroll="scale" data-delay={idx * 100}>
                      <div className={`w-14 h-14 bg-gradient-to-br ${pillar.gradient} rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg ${shadow} flex items-center justify-center`}>
                        <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-white font-semibold leading-snug">{pillar.title}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Unique Positioning */}
        <section className="py-20 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                  <span className="w-8 h-[2px] bg-accent-gold" />
                  What Sets Us Apart
                  <span className="w-8 h-[2px] bg-accent-gold" />
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Unique Positioning</h2>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[2rem] shadow-xl border border-white">
                <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">{uniqueIntro}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {uniquePoints.map((point: any, idx: number) => {
                    const bgGradients = [
                      'from-emerald-50 to-teal-50 border-emerald-100',
                      'from-sky-50 to-cyan-50 border-sky-100',
                      'from-violet-50 to-purple-50 border-violet-100',
                      'from-rose-50 to-pink-50 border-rose-100',
                    ]
                    const iconGradients = [
                      'from-emerald-400 to-teal-500',
                      'from-sky-400 to-cyan-500',
                      'from-violet-400 to-purple-500',
                      'from-rose-400 to-pink-500',
                    ]
                    return (
                      <div key={idx} className={`flex gap-4 p-4 rounded-2xl bg-gradient-to-br ${bgGradients[idx % bgGradients.length]} border`}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradients[idx % iconGradients.length]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{point.title}</h4>
                          <p className="text-gray-600 text-sm">{point.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-24 bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50">
          <div className="container">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Leadership
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{teamHeading}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">{teamDescription}</p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {displayTeam.map((member: any, idx: number) => {
                const bgColors = [
                  'from-rose-200 to-pink-300',
                  'from-sky-200 to-cyan-300',
                  'from-violet-200 to-purple-300',
                  'from-amber-200 to-orange-300',
                ]
                const photoUrl = getMediaUrl(member.photo, '/images/ourteam/placeholder.jpg')
                return (
                <div key={idx} className="group text-center" data-scroll="scale" data-delay={idx * 100}>
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgColors[idx % bgColors.length]} rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform`} />
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl">
                      <Image src={photoUrl} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                          {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-gold hover:text-primary-950 transition-all"><Linkedin className="w-4 h-4" /></a>}
                          {member.socialLinks?.twitter && <a href={member.socialLinks.twitter} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-gold hover:text-primary-950 transition-all"><Twitter className="w-4 h-4" /></a>}
                          {member.email && <a href={`mailto:${member.email}`} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-gold hover:text-primary-950 transition-all"><Mail className="w-4 h-4" /></a>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">{member.name}</h3>
                  <p className="text-accent-gold text-sm font-semibold mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.shortBio || member.bio}</p>
                </div>
              )})}              </div>
            </div>
          </div>
        </section>

        {/* Board of Trustees Section */}
        <section id="board" className="py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
          <div className="container">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Governance
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{boardHeading}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">{boardDescription}</p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayBoard.map((member: any, idx: number) => {
                  const photoUrl = getMediaUrl(member.photo, '/images/board/placeholder.jpg')
                  return (
                  <BoardMemberCard
                    key={idx}
                    name={member.name}
                    position={member.position}
                    bio={member.shortBio || member.bio || ''}
                    image={photoUrl}
                    index={idx}
                    imagePosition={member.imagePosition}
                  />
                )})}              </div>
            </div>
          </div>
        </section>

        {/* Partners Section - Infinite Scroll Carousel */}
        <section 
          id="partners" 
          className="py-20 relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251008_095815014~2.jpg)' }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-primary-950/85" />
          
          <div className="container relative z-10">
            <div className="text-center mb-12" data-scroll="up">
              <span className="inline-flex items-center gap-2 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Our Partners
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Working <span className="text-accent-gold">Together</span> for Peace
              </h2>
              <p className="text-gray-300 max-w-xl mx-auto">
                We collaborate with international organizations, foundations, and networks to amplify our impact across communities.
              </p>
            </div>
          </div>

          {/* Infinite Scroll Carousel */}
          <div className="relative group/carousel z-10">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-primary-950/90 via-primary-950/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-primary-950/90 via-primary-950/50 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Track */}
            <div className="flex animate-scroll-infinite group-hover/carousel:[animation-play-state:paused]">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 mx-4 md:mx-8"
                >
                  <div
                    className="group flex items-center justify-center w-36 h-24 md:w-44 md:h-28 rounded-2xl bg-white border border-gray-100 hover:border-primary-300 hover:shadow-lg transition-all duration-300 p-5"
                    title={partner.name}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain group-hover:grayscale transition-all duration-300 opacity-100 group-hover:opacity-70"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner CTA */}
          <div className="container relative z-10 mt-12 text-center" data-scroll="up">
            <p className="text-gray-400 text-sm mb-4">Want to partner with us?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-accent-gold font-semibold hover:text-yellow-400 transition-colors"
            >
              Become a Partner
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Awards */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-violet-100 via-fuchsia-100 to-pink-100">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-accent-gold/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-primary-200/30 to-transparent rounded-full blur-3xl" />
          <div className="container relative z-10">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Recognition
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {aboutAwards.map((award: any, idx: number) => {
                const awardColors = [
                  { border: 'border-amber-200', bg: 'from-amber-400 to-orange-500', badge: 'bg-amber-100 text-amber-700', scroll: 'left' },
                  { border: 'border-violet-200', bg: 'from-violet-400 to-purple-500', badge: 'bg-violet-100 text-violet-700', scroll: 'right' },
                  { border: 'border-emerald-200', bg: 'from-emerald-400 to-teal-500', badge: 'bg-emerald-100 text-emerald-700', scroll: 'left' },
                  { border: 'border-rose-200', bg: 'from-rose-400 to-pink-500', badge: 'bg-rose-100 text-rose-700', scroll: 'right' },
                ]
                const color = awardColors[idx % awardColors.length]
                return (
                  <div key={idx} className={`group bg-white p-8 rounded-[2rem] border ${color.border} shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1`} data-scroll={color.scroll}>
                    <div className="flex gap-5 items-start">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full ${color.badge} text-sm font-bold mb-2`}>{award.year}</span>
                        <h3 className="font-bold text-gray-900 text-lg">{award.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{award.organization}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact CTA - Modern Redesign */}
        <section className="py-28 relative overflow-hidden">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900" />
          <div className="absolute inset-0 bg-[url('/images/PXL_20251023_124331635.MP~2.jpg')] bg-cover bg-center opacity-10" />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/20 to-cyan-500/15 rounded-full blur-3xl" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-14" data-scroll="up">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Get Involved</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {ctaHeading.includes('Building Peace') ? (
                    <>Join Us in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Building Peace</span></>
                  ) : ctaHeading}
                </h2>
                <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">{ctaDescription}</p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-5 justify-center mb-16" data-scroll="up">
                <Link href="/contact" className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-white">Get Involved</span>
                  <ArrowRight className="relative w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="/contact" className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 backdrop-blur-sm transition-all">
                  <Heart className="w-5 h-5" />
                  Support Our Work
                </a>
              </div>
              
              {/* Office Cards */}
              <div className="grid md:grid-cols-2 gap-6" data-scroll="up">
                <div className="group relative rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-colors" />
                  <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl" />
                  <div className="relative p-7">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">Head Office</span>
                        <p className="text-white font-medium mb-1">{headOfficeAddress}</p>
                        <p className="text-white/60">{headOfficeCity}</p>
                        <p className="text-amber-400 font-medium mt-2">{headOfficePhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-colors" />
                  <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl" />
                  <div className="relative p-7">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">Regional Office</span>
                        <p className="text-white font-medium mb-1">{regionOfficeAddress}</p>
                        <p className="text-white/60">{regionOfficeCity}</p>
                        <p className="text-amber-400 font-medium mt-2">{regionOfficeEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom decorative element */}
              <div className="flex justify-center mt-14" data-scroll="up">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/40 text-sm mx-2">Building blocks for a peaceful future</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}
