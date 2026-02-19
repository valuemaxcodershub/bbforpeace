'use client'

import { Target, GraduationCap, Megaphone, Handshake, Radio } from 'lucide-react'

const pillars = [
  {
    icon: Target,
    title: 'Research & Knowledge',
    description: 'Generating evidence-based insights to inform peacebuilding strategies and policy advocacy across communities.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: GraduationCap,
    title: 'Programs & Training',
    description: 'Building capacity through workshops, mentorship, and skill development for young peacebuilders.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Megaphone,
    title: 'Advocacy & Engagement',
    description: 'Influencing policies and decisions at local, national, and regional levels for sustainable peace.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Handshake,
    title: 'Partnerships & Networks',
    description: 'Collaborating with local and international organizations to amplify impact and create synergies.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Radio,
    title: 'Communications & Outreach',
    description: 'Amplifying peace narratives through media, storytelling, and community awareness campaigns.',
    color: 'from-rose-500 to-rose-600',
  },
]

export function OurApproachSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mb-16" data-scroll="up">
          <span className="inline-flex items-center gap-2 text-primary-900 text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-[2px] bg-primary-900" />
            How We Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-primary-900">Approach</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
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
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                data-scroll="scale"
                data-delay={index * 100}
              >
                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-bold group-hover:bg-primary-900 group-hover:text-white transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-900 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pillar.description}
                </p>

                {/* Hover Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-900 to-accent-gold opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
