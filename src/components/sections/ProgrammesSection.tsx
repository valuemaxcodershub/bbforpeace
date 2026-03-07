import Link from 'next/link'
import { ArrowRight, Users, Shield, Leaf, BookOpen, Scale, AlertTriangle, Target, Heart, Globe, Megaphone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Users, Shield, Leaf, BookOpen, Scale, AlertTriangle, Target, Heart, Globe, Megaphone,
}

// Default fallback data
const defaultProgrammes = [
  { title: 'Youth & Women Peace and Security', description: 'Empowering young people and women as active agents of peace through capacity building and advocacy.', icon: 'Users', gradient: 'from-violet-600 via-purple-600 to-indigo-700', link: '/programmes/youth-women-peace-security' },
  { title: 'Conflict Management & Peacebuilding', description: 'Building skills to identify and handle conflicts sensibly, fairly, and efficiently.', icon: 'Shield', gradient: 'from-blue-600 via-indigo-600 to-blue-800', link: '/programmes/conflict-management' },
  { title: 'Prevention of Violent Extremism', description: 'Proactive measures to combat extremism through education and community engagement.', icon: 'AlertTriangle', gradient: 'from-orange-500 via-red-500 to-rose-600', link: '/programmes/preventing-violent-extremism' },
  { title: 'Governance & Accountability', description: 'Promoting inclusive, transparent, and accountable governance through civic awareness.', icon: 'Scale', gradient: 'from-emerald-600 via-teal-600 to-cyan-700', link: '/programmes/governance-accountability' },
  { title: 'Climate & Environmental Security', description: 'Integrating climate action with peacebuilding to address resource conflicts.', icon: 'Leaf', gradient: 'from-green-600 via-emerald-600 to-teal-700', link: '/programmes/climate-environmental-security' },
  { title: 'Peace Education', description: 'Equipping communities with knowledge and skills for peaceful conflict resolution.', icon: 'BookOpen', gradient: 'from-amber-500 via-yellow-500 to-orange-500', link: '/programmes/peace-education' },
]

export interface ProgrammesSectionProps {
  badge?: string
  heading?: string
  description?: string
  backgroundImage?: { url?: string } | string | null
  focusAreas?: { title: string; description: string; icon?: string | null; gradient?: string | null; link?: string | null }[]
}

export function ProgrammesSection({
  badge = 'What We Do',
  heading = 'Our Focus Areas',
  description = 'Six integrated focus areas guide our work in youth-led peacebuilding, conflict prevention, and sustainable development.',
  backgroundImage,
  focusAreas,
}: ProgrammesSectionProps) {
  const programmes = focusAreas?.length ? focusAreas : defaultProgrammes
  const bgImage = typeof backgroundImage === 'string' ? backgroundImage : backgroundImage?.url || '/images/PXL_20251023_124331635.MP~2.jpg'

  return (
    <section 
      className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-950/80" />
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-scroll="up">
          <span className="inline-flex items-center justify-center gap-3 text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-[2px] bg-accent-gold" />
            {badge}
            <span className="w-8 h-[2px] bg-accent-gold" />
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {heading}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Focus Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((programme, index) => {
            const Icon = iconMap[programme.icon || 'Users'] || Users
            const gradient = programme.gradient || 'from-violet-600 via-purple-600 to-indigo-700'
            return (
              <Link
                key={index}
                href={programme.link || '/programmes'}
                className={`group relative rounded-2xl p-6 lg:p-8 bg-gradient-to-br ${gradient} overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
                data-scroll="scale"
                data-delay={(index % 3) * 100}
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/2 right-4 w-16 h-16 bg-white/5 rounded-full" />

                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 text-sm font-bold">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                  {programme.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  {programme.description}
                </p>

                {/* Learn More Link */}
                <span className="inline-flex items-center text-white font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16" data-scroll="up">
          <Link 
            href="/programmes" 
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-accent-gold text-primary-950 hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl"
          >
            Explore All Programmes
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
