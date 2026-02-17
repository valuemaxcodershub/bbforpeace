import Image from 'next/image'
import { Award, Trophy, Star } from 'lucide-react'

const awards = [
  {
    title: 'National Youth Development Award 2025',
    organization: 'Federal Ministry of Youth Development, Abuja',
    year: '2025',
    image: '/images/PXL_20251008_122828933.jpg',
    description: 'Recognized for outstanding contributions to youth empowerment and peacebuilding across Nigeria.',
  },
  {
    title: 'Best Young Peacebuilding Organisation 2023',
    organization: 'West Africa Network for Peacebuilding (WANEP-Nigeria)',
    year: '2023',
    image: '/images/PXL_20251008_122924872.jpg',
    description: 'Awarded for innovative approaches to conflict prevention and youth-led peace initiatives.',
  },
]

export function AwardsSection() {
  return (
    <section 
      className="py-24 relative overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/_VEE7153%20(6).jpg)' }}
    >
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/90 to-primary-950/95" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-accent-gold/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16" data-scroll="up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/20 mb-6">
            <Trophy className="w-8 h-8 text-accent-gold" />
          </div>
          <span className="inline-flex items-center justify-center gap-3 text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-[2px] bg-accent-gold" />
            Recognition
            <span className="w-8 h-[2px] bg-accent-gold" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Awards & Achievements
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our commitment to peacebuilding has been recognized by national and regional bodies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {awards.map((award, idx) => (
            <div
              key={idx}
              className="group relative"
              data-scroll={idx === 0 ? 'left' : 'right'}
              data-delay={idx * 200}
            >
              {/* Card with glassmorphism */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 hover:border-accent-gold/50 transition-all duration-500">
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={award.image}
                    alt={award.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/50 to-transparent" />
                  
                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold text-primary-950 font-bold text-sm">
                    <Star className="w-4 h-4" fill="currentColor" />
                    {award.year}
                  </div>

                  {/* Award Icon */}
                  <div className="absolute bottom-0 left-6 translate-y-1/2 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-gold to-yellow-500 flex items-center justify-center shadow-xl shadow-accent-gold/30">
                      {idx === 0 ? (
                        <Award className="w-8 h-8 text-primary-950" />
                      ) : (
                        <Trophy className="w-8 h-8 text-primary-950" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-12">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">
                    {award.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {award.organization}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
