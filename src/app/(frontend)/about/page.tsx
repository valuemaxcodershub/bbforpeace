import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout'
import { 
  Target, Eye, CheckCircle, Shield, Users, Lightbulb, 
  Handshake, Heart, UserCheck, Award, Calendar, MapPin,
  Linkedin, Twitter, Mail, ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | BBFORPEACE',
  description: 'Learn about Building Blocks for Peace Foundation - a youth-led peacebuilding NGO working to create sustainable peace through knowledge-sharing, policy advocacy, partnerships and programs.',
}

const coreValues = [
  { icon: Shield, title: 'Integrity & Accountability', description: 'Transparency in all our actions and decisions' },
  { icon: Users, title: 'Inclusivity & Gender Equality', description: 'Ensuring all voices are heard and represented' },
  { icon: Lightbulb, title: 'Innovation & Learning', description: 'Continuously improving our approaches' },
  { icon: Handshake, title: 'Collaboration & Solidarity', description: 'Working together for greater impact' },
  { icon: Heart, title: 'Non-Violence & Do No Harm', description: 'Peace in all our methods and actions' },
  { icon: UserCheck, title: 'Youth Leadership', description: 'Young people at the center of decision-making' },
]

const strategicPillars = [
  { title: 'Peace Education & Youth Empowerment', color: 'bg-blue-500' },
  { title: 'Conflict Prevention, Governance & Accountability', color: 'bg-green-500' },
  { title: 'Gender, Climate & Environmental Security', color: 'bg-yellow-500' },
  { title: 'Organizational Sustainability & Partnerships', color: 'bg-purple-500' },
  { title: 'Livelihoods and Humanitarian', color: 'bg-red-500' },
]

const teamMembers = [
  {
    name: 'Rafiu Adeniran Lawal',
    position: 'Executive Director & Founder',
    bio: 'Founder of BBFORPEACE with extensive experience in youth peacebuilding, policy advocacy, and regional networking across West Africa.',
    image: '/images/_VEE6516 (1).jpg',
    email: 'r.lawal@bbforpeace.org',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Programs Director',
    position: 'Programs Director',
    bio: 'Expert in conflict resolution and peacebuilding program design and implementation.',
    image: '/images/_VEE7153 (6).jpg',
    email: 'programs@bbforpeace.org',
  },
  {
    name: 'Communications Lead',
    position: 'Communications & Media',
    bio: 'Passionate about storytelling for social change and amplifying youth voices.',
    image: '/images/_VEE7178.jpg',
    email: 'comms@bbforpeace.org',
  },
  {
    name: 'Partnership Coordinator',
    position: 'Partnerships & Development',
    bio: 'Building bridges between communities, civil society, and international partners.',
    image: '/images/_VEE6887 (20).jpg',
    email: 'partnerships@bbforpeace.org',
  },
]

// Board of Trustees - to be updated with actual data
const boardOfTrustees = [
  {
    name: 'Board Chair',
    position: 'Chairperson',
    bio: 'Distinguished leader with decades of experience in conflict resolution and peace advocacy.',
    image: '/images/_VEE7927.jpg',
  },
  {
    name: 'Board Member',
    position: 'Trustee',
    bio: 'Expert in governance, policy development, and strategic leadership.',
    image: '/images/_VEE7856.jpg',
  },
  {
    name: 'Board Member',
    position: 'Trustee',
    bio: 'Committed to youth empowerment and sustainable development initiatives.',
    image: '/images/_VEE7915 (1).jpg',
  },
]

const partners = [
  { name: 'GPPAC', description: 'Global Partnership for Prevention of Armed Conflict', logo: '/images/partners/gppac.jfif' },
  { name: 'WANEP', description: 'West Africa Network for Peacebuilding', logo: '/images/partners/wanep.png' },
  { name: 'British Council', description: 'Education & Cultural Relations', logo: '/images/partners/British_Council_logo.svg.png' },
  { name: 'MacArthur Foundation', description: 'Funding Partner', logo: '/images/partners/maaurthor.jfif' },
  { name: 'Open Society Foundations', description: 'Civic Space Protection', logo: '/images/partners/open%20society%20foundation.png' },
  { name: 'Ford Foundation', description: 'Social Justice Funding', logo: '/images/partners/ford.png' },
]

const milestones = [
  { year: '2016', event: 'Nigeria Youth 4 Peace Initiative founded' },
  { year: '2017', event: 'BBFORPEACE incorporated with Corporate Affairs Commission' },
  { year: '2020', event: 'Became GPPAC West Africa Regional Secretariat' },
  { year: '2023', event: 'Best Young Peacebuilding Organisation Award (WANEP)' },
  { year: '2024', event: 'WAYPAN Regional Network established' },
  { year: '2025', event: 'National Youth Development Award' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Who We Are"
        description="A youth-led organization bridging grassroots action, policy advocacy, and regional networking for sustainable peace."
        backgroundImage="/images/_VEE7009 (1).jpg"
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
                  <p>
                    Building Blocks for Peace (BBFORPEACE) Foundation is a non-governmental organization working on Conflict Prevention, Prevention of Violent Extremism, Peacebuilding and Sustainable Development in Nigeria.
                  </p>
                  <p>
                    Founded by <strong className="text-primary-900">Rafiu Adeniran Lawal</strong>, BBFORPEACE began with the Nigeria Youth 4 Peace Initiative in 2016 — a movement of young people dissatisfied with the increasing participation of youth in violent extremism and their exclusion from decision-making processes.
                  </p>
                  <p>
                    Through our Youth4Peace initiative, we have trained and empowered <strong className="text-accent-gold">over 5,000 youth and children</strong> with support from several local and international stakeholders.
                  </p>
                </div>

                {/* Timeline */}
                <div className="mt-10 relative bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-white shadow-lg">
                  <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-accent-gold via-primary-600 to-primary-200" />
                  <div className="space-y-5">
                    {milestones.map((milestone, idx) => {
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
                      <Image src="/images/_VEE6792.jpg" alt="Team" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden shadow-xl -rotate-1 hover:rotate-0 transition-transform">
                      <Image src="/images/_VEE7124 (1).jpg" alt="Workshop" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-transform">
                      <Image src="/images/_VEE7037 (1).jpg" alt="Community" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-xl -rotate-2 hover:rotate-0 transition-transform">
                      <Image src="/images/PXL_20251008_122828933.jpg" alt="Award" fill className="object-cover" />
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
                  <p className="text-gray-600 leading-relaxed">
                    A peaceful, just and inclusive Africa where youth, women and men lead resilient communities, accountable governance, and sustainable development.
                  </p>
                </div>
                
                {/* Mission */}
                <div className="group bg-white rounded-xl p-6 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow" data-scroll="right">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    To equip youth, women and men as peacebuilders to prevent violent conflict, protect civic space, and promote sustainable peace through knowledge-sharing, policy advocacy, partnerships and programs.
                  </p>
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
                {coreValues.map((value, idx) => {
                const Icon = value.icon
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
          className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
        >
          <div className="absolute inset-0 bg-primary-950/90" />
          <div className="container relative z-10">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                2026 - 2030
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Strategic Pillars</h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">Our five interlinked impact areas guiding our work over the next five years.</p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {strategicPillars.map((pillar, idx) => (
                <div key={idx} className="group bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/20 hover:border-accent-gold/30 transition-all text-center" data-scroll="scale" data-delay={idx * 100}>
                  <div className={`w-12 h-12 ${pillar.color} rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`} />
                  <p className="text-white font-semibold leading-snug">{pillar.title}</p>
                </div>
              ))}
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
                <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
                  In Nigeria's peacebuilding ecosystem, BBFORPEACE occupies a unique niche as one of the few truly <strong className="text-primary-900">youth-led organizations</strong> operating from the grassroots to policy level.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Youth-Led & Grassroots-Informed</h4>
                      <p className="text-gray-600 text-sm">Co-founded and run by young peacebuilders with authenticity among youth constituencies.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Policy-Engaged</h4>
                      <p className="text-gray-600 text-sm">Contributing to YPS and WPS action plans across West Africa.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">GPPAC Regional Secretariat</h4>
                      <p className="text-gray-600 text-sm">West Africa secretariat for Global Partnership for Prevention of Armed Conflict.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Global Youth Networks</h4>
                      <p className="text-gray-600 text-sm">Active in United Network of Young Peacebuilders.</p>
                    </div>
                  </div>
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Passionate young leaders dedicated to building peace and empowering communities.</p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, idx) => {
                const bgColors = [
                  'from-rose-200 to-pink-300',
                  'from-sky-200 to-cyan-300',
                  'from-violet-200 to-purple-300',
                  'from-amber-200 to-orange-300',
                ]
                return (
                <div key={idx} className="group text-center" data-scroll="scale" data-delay={idx * 100}>
                  <div className="relative mb-5">
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgColors[idx % bgColors.length]} rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform`} />
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl">
                      <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                          {member.linkedin && <a href={member.linkedin} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-gold hover:text-primary-950 transition-all"><Linkedin className="w-4 h-4" /></a>}
                          {member.twitter && <a href={member.twitter} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-gold hover:text-primary-950 transition-all"><Twitter className="w-4 h-4" /></a>}
                          <a href={`mailto:${member.email}`} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-accent-gold hover:text-primary-950 transition-all"><Mail className="w-4 h-4" /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-accent-gold text-sm font-semibold mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              )})
              }
              </div>
            </div>
          </div>
        </section>

        {/* Board of Trustees Section */}
        <section id="board" className="py-24 bg-white">
          <div className="container">
            <div className="text-center mb-14" data-scroll="up">
              <span className="inline-flex items-center gap-3 justify-center text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-accent-gold" />
                Governance
                <span className="w-8 h-[2px] bg-accent-gold" />
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Board of Trustees</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Our distinguished board members provide strategic oversight and guidance for the organization.</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {boardOfTrustees.map((member, idx) => {
                const bgColors = [
                  'from-emerald-200 to-teal-300',
                  'from-blue-200 to-indigo-300',
                  'from-rose-200 to-pink-300',
                ]
                return (
                <div key={idx} className="group text-center" data-scroll="scale" data-delay={idx * 100}>
                  <div className="relative mb-5">
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgColors[idx % bgColors.length]} rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform`} />
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl">
                      <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-accent-gold text-sm font-semibold mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              )})
              }
              </div>
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
              <div className="group bg-white p-8 rounded-[2rem] border border-amber-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" data-scroll="left">
                <div className="flex gap-5 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-2">2025</span>
                    <h3 className="font-bold text-gray-900 text-lg">National Youth Development Award</h3>
                    <p className="text-gray-600 text-sm mt-1">Federal Ministry of Youth Development, Abuja</p>
                  </div>
                </div>
              </div>
              <div className="group bg-white p-8 rounded-[2rem] border border-violet-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" data-scroll="right">
                <div className="flex gap-5 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-bold mb-2">2023</span>
                    <h3 className="font-bold text-gray-900 text-lg">Best Young Peacebuilding Organisation</h3>
                    <p className="text-gray-600 text-sm mt-1">West Africa Network for Peacebuilding (WANEP-Nigeria)</p>
                  </div>
                </div>
              </div>
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
                  Join Us in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Building Peace</span>
                </h2>
                <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
                  Whether as a volunteer, partner, or supporter, there are many ways to contribute to our mission.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-5 justify-center mb-16" data-scroll="up">
                <Link href="/contact" className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-white">Get Involved</span>
                  <ArrowRight className="relative w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/donate" className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 backdrop-blur-sm transition-all">
                  <Heart className="w-5 h-5" />
                  Support Our Work
                </Link>
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
                        <p className="text-white font-medium mb-1">256, 1st Avenue, FHA, Lugbe</p>
                        <p className="text-white/60">Abuja, Nigeria</p>
                        <p className="text-amber-400 font-medium mt-2">+234-8054151494</p>
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
                        <p className="text-white font-medium mb-1">35, Edward Ujege Street, High Level</p>
                        <p className="text-white/60">Makurdi, Benue State</p>
                        <p className="text-amber-400 font-medium mt-2">info@bbforpeace.org</p>
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
