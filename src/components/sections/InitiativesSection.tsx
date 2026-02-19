import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe, Shield, Users, Sparkles } from 'lucide-react'

const initiatives = [
  {
    title: 'Champions of Peace Initiative',
    description: 'A network of youth and women dedicated to building peaceful, just, and inclusive societies through social media engagement, advocacy, dialogue, and community sensitization.',
    icon: Users,
    image: '/images/_VEE7927.jpg',
    href: '/programmes#champions-of-peace',
    color: 'from-blue-600 to-indigo-600',
    badge: 'Youth Network',
  },
  {
    title: 'West Africa Peace & Security Dialogue (WAPSeD)',
    description: 'A regional platform bringing together peacebuilding practitioners, policymakers, and researchers to analyze security trends and strengthen coordinated responses across West Africa.',
    icon: Globe,
    image: '/images/_VEE7943.jpg',
    href: '/programmes#wapsed',
    color: 'from-emerald-600 to-teal-600',
    badge: 'Regional Platform',
  },
  {
    title: 'West Africa Youth Protection Advocacy Network (WAYPAN)',
    description: 'A youth-led initiative responding to shrinking civic space across West Africa, focusing on civic freedoms, non-violent resistance, and youth leadership in governance.',
    icon: Shield,
    image: '/images/PXL_20251008_094037931.jpg',
    href: '/programmes#waypan',
    color: 'from-purple-600 to-fuchsia-600',
    badge: 'Advocacy Network',
  },
]

export function InitiativesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mb-16" data-scroll="up">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-primary-900" />
            <span className="inline-flex items-center gap-2 text-primary-900 text-sm font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              Our Initiatives
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Regional & Community <span className="text-primary-900">Initiatives</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Strategic programs connecting grassroots action with regional advocacy for sustainable peace across West Africa.
          </p>
        </div>

        {/* Initiatives Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {initiatives.map((initiative, idx) => {
            const Icon = initiative.icon
            return (
              <Link
                key={idx}
                href={initiative.href}
                className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                data-scroll="scale"
                data-delay={idx * 150}
              >
                {/* Image with Gradient Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={initiative.image}
                    alt={initiative.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${initiative.color} opacity-60 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-900 shadow-lg">
                      {initiative.badge}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute bottom-5 right-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${initiative.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-900 transition-colors leading-tight">
                    {initiative.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {initiative.description}
                  </p>
                  <div className="inline-flex items-center text-primary-900 font-bold text-sm">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className={`h-1.5 bg-gradient-to-r ${initiative.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            )
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-14" data-scroll="up">
          <Link
            href="/programmes"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white transition-all"
          >
            View All Programmes
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
