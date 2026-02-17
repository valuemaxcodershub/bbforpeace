import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe, Shield, Users } from 'lucide-react'

const initiatives = [
  {
    title: 'Champions of Peace Initiative',
    description: 'A network of youth and women dedicated to building peaceful, just, and inclusive societies through social media engagement, advocacy, dialogue, and community sensitization.',
    icon: Users,
    image: '/images/_VEE7927.jpg',
    href: '/programmes/champions-of-peace',
  },
  {
    title: 'West Africa Peace & Security Dialogue (WAPSeD)',
    description: 'A regional platform bringing together peacebuilding practitioners, policymakers, and researchers to analyze security trends and strengthen coordinated responses across West Africa.',
    icon: Globe,
    image: '/images/_VEE7943.jpg',
    href: '/programmes/wapsed',
  },
  {
    title: 'West Africa Youth Protection Advocacy Network (WAYPAN)',
    description: 'A youth-led initiative responding to shrinking civic space across West Africa, focusing on civic freedoms, non-violent resistance, and youth leadership in governance.',
    icon: Shield,
    image: '/images/PXL_20251008_094037931.jpg',
    href: '/programmes/waypan',
  },
]

export function InitiativesSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12" data-scroll="up">
          <span className="inline-block text-sm font-semibold text-primary-900 uppercase tracking-wider mb-4">
            Our Initiatives
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Regional & Community Initiatives
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Strategic programs connecting grassroots action with regional advocacy for sustainable peace.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {initiatives.map((initiative, idx) => {
            const Icon = initiative.icon
            return (
              <Link
                key={idx}
                href={initiative.href}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                data-scroll="up"
                data-delay={idx * 150}
              >
                {/* Large Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={initiative.image}
                    alt={initiative.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-900" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-900 transition-colors">
                    {initiative.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {initiative.description}
                  </p>
                  <span className="inline-flex items-center text-primary-900 font-semibold text-sm">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
