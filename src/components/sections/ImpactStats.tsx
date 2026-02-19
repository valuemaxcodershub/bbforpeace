'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const stats = [
  {
    value: 5000,
    suffix: '+',
    label: 'Youth Reached Directly',
    description: 'Through our programs and initiatives',
  },
  {
    value: 50000,
    suffix: '+',
    label: 'Indirect Beneficiaries',
    description: 'Extended impact across communities',
  },
  {
    value: 36,
    suffix: '',
    label: 'States Covered',
    description: 'Nationwide presence in Nigeria',
  },
  {
    value: 8,
    suffix: '+',
    label: 'Years of Impact',
    description: 'Building peace since 2017',
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const increment = value / (duration / 16)
          
          const timer = setInterval(() => {
            start += increment
            if (start >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function ImpactStats() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/_VEE7124 (1).jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 to-primary-900/80" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div data-scroll="left">
            <span className="inline-flex items-center gap-2 text-accent-gold text-sm font-semibold uppercase tracking-widest mb-4">
              <span className="w-8 h-[2px] bg-accent-gold" />
              Our Presence
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Creating Lasting
              <span className="block text-accent-gold">Impact</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Since 2017, BBFORPEACE has been at the forefront of youth-led peacebuilding 
              in Nigeria, transforming communities through dialogue, education, and 
              grassroots engagement. Our work has reached thousands directly and 
              continues to create ripple effects across the nation.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                Recognized by national bodies
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                2 National Awards
              </span>
            </div>
          </div>

          {/* Right - Stats Grid */}
          <div className="grid grid-cols-2 gap-6" data-scroll="right">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-accent-gold/30 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white font-semibold text-lg mb-1">{stat.label}</div>
                <div className="text-gray-400 text-sm">{stat.description}</div>
                {/* Decorative Corner */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent-gold/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-auto fill-white">
          <path d="M0,60 L0,30 Q360,0 720,30 T1440,30 L1440,60 Z" />
        </svg>
      </div>
    </section>
  )
}
