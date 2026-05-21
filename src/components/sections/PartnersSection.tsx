'use client'

import { getMediaUrl } from '@/lib/utils'

// Default partner organizations with local logos
const defaultPartners = [
  { id: '1', name: 'GPPAC Foundation', logo: '/images/partners/gppac.jfif' },
  { id: '2', name: 'West Africa Network for Peacebuilding', logo: '/images/partners/wanep.png' },
  { id: '3', name: 'British Council', logo: '/images/partners/British_Council_logo.svg.png' },
  { id: '4', name: 'MacArthur Foundation', logo: '/images/partners/maaurthor.jfif' },
  { id: '5', name: 'Open Society Foundations', logo: '/images/partners/open%20society%20foundation.png' },
  { id: '6', name: 'Ford Foundation', logo: '/images/partners/ford.png' },
]

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

export interface PartnersSectionProps {
  heading?: string
  subheading?: string
  description?: string
  ctaText?: string
  ctaLinkLabel?: string
  partners?: { name: string; logo?: { url?: string } | string | null }[]
}

export function PartnersSection({
  heading = 'Our Partners',
  subheading = 'Working Together for Peace',
  description = 'We collaborate with international organizations, foundations, and networks to amplify our impact across communities.',
  ctaText = 'Want to partner with us?',
  ctaLinkLabel = 'Become a Partner',
  partners: partnersProp,
}: PartnersSectionProps) {
  const partners = partnersProp?.length ? partnersProp.map((p, i) => ({
    id: String(i + 1),
    name: p.name,
    logo: getMediaUrl(p.logo, partnerLogoFallback[p.name] || '/images/partners/gppac.jfif'),
  })) : defaultPartners
  // Double the partners array for seamless infinite scroll
  const doubledPartners = [...partners, ...partners]

  return (
    <section 
      className="py-24 lg:py-28 relative overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/PXL_20251008_095815014~2.jpg)' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-950/85" />
      
      <div className="container relative z-10">
        <div className="text-center mb-12" data-scroll="up">
          <span className="inline-flex items-center gap-2 justify-center text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-accent-gold" />
            {heading}
            <span className="w-8 h-0.5 bg-accent-gold" />
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {subheading?.includes('Together') ? (
              <>
                {subheading.replace('Together', '')}<span className="text-accent-gold">Together</span>
              </>
            ) : (
              subheading || 'Building Peace Together'
            )}
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            {description}
          </p>
        </div>
      </div>

      {/* Infinite Scroll Carousel */}
      <div className="relative group/carousel z-10">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-r from-primary-950/90 via-primary-950/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-l from-primary-950/90 via-primary-950/50 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex animate-scroll-infinite group-hover/carousel:[animation-play-state:paused]">
          {doubledPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="shrink-0 mx-5 md:mx-10"
            >
              <div
                className="group flex items-center justify-center w-48 h-32 sm:w-52 sm:h-36 md:w-60 md:h-40 lg:w-72 lg:h-44 rounded-2xl bg-white border border-gray-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 p-2 sm:p-2.5 md:p-3"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain group-hover:grayscale transition-all duration-300 opacity-100 group-hover:opacity-80"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner CTA */}
      <div className="container relative z-10 mt-12 text-center" data-scroll="up">
        <p className="text-gray-400 text-sm mb-4">{ctaText}</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 text-accent-gold font-semibold hover:text-yellow-400 transition-colors"
        >
          {ctaLinkLabel}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  )
}
