'use client'

import { Target, GraduationCap, Megaphone, Handshake, Radio, Sparkles } from 'lucide-react'

const pillars = [
  {
    icon: Target,
    title: 'Research & Knowledge',
    description: 'Generating evidence-based insights to inform peacebuilding strategies and policy advocacy.',
    gradient: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/25',
  },
  {
    icon: GraduationCap,
    title: 'Programs & Training',
    description: 'Building capacity through workshops, mentorship, and skill development for young peacebuilders.',
    gradient: 'from-violet-500 to-purple-500',
    shadow: 'shadow-violet-500/25',
  },
  {
    icon: Megaphone,
    title: 'Advocacy & Engagement',
    description: 'Influencing policies at local, national, and regional levels for sustainable peace.',
    gradient: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/25',
  },
  {
    icon: Handshake,
    title: 'Partnerships & Networks',
    description: 'Collaborating with organizations to amplify impact and create synergies.',
    gradient: 'from-emerald-500 to-green-500',
    shadow: 'shadow-emerald-500/25',
  },
  {
    icon: Radio,
    title: 'Communications & Outreach',
    description: 'Amplifying peace narratives through media and community awareness campaigns.',
    gradient: 'from-rose-500 to-pink-500',
    shadow: 'shadow-rose-500/25',
  },
]

export function OurApproachSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16" data-scroll="up">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span className="inline-flex items-center gap-2 text-accent-gold text-sm font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              How We Work
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-accent-gold">Approach</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Five integrated pillars guide our work, ensuring comprehensive and sustainable 
            impact in youth-led peacebuilding across Nigeria and West Africa.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-[1.5rem] p-6 border border-white/10 hover:border-accent-gold/50 hover:bg-white/10 transition-all duration-500"
                data-scroll="scale"
                data-delay={index * 100}
              >
                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-sm font-bold group-hover:bg-accent-gold/20 group-hover:text-accent-gold transition-all">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-5 shadow-lg ${pillar.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-accent-gold transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {pillar.description}
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-accent-gold/0 to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
