import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface PageHeroProps {
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function PageHero({ 
  title, 
  subtitle, 
  description, 
  backgroundImage = '/images/_VEE6765.jpg',
  breadcrumbs
}: PageHeroProps) {
  return (
    <section className="relative min-h-80 flex items-center overflow-hidden py-16 md:py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary-950/95 via-primary-950/85 to-primary-900/70" />
        <div className="absolute inset-0 bg-linear-to-t from-primary-950/50 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-125 h-125 rounded-full bg-accent-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-100 h-100 rounded-full bg-white/5 blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <nav className="flex items-center gap-2 text-sm mb-6 animate-fade-in-down">
              <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-gray-400 hover:text-white transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-accent-gold font-medium max-w-50 sm:max-w-75 md:max-w-100 truncate inline-block">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {subtitle && (
            <span className="inline-flex items-center gap-3 text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4 animate-fade-in-down">
              <span className="w-8 h-0.5 bg-accent-gold" />
              {subtitle}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up leading-tight" style={{ animationDelay: '0.1s' }}>
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 50L48 45.7C96 41.3 192 32.7 288 30.8C384 29 480 34 576 41.3C672 48.7 768 58.3 864 55.8C960 53.3 1056 38.7 1152 33.8C1248 29 1344 34 1392 36.5L1440 39V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
