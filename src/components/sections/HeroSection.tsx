'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

// Default fallback data
const defaultSlides = [
  {
    image: '/images/_VEE6792.jpg',
    description: 'Bridging grassroots action, policy advocacy, and regional networking for sustainable peace.',
  },
  {
    image: '/images/_VEE7124 (1).jpg',
    description: 'Equipping young people as active agents through capacity building and mentorship.',
  },
  {
    image: '/images/PXL_20251007_102503598.MP.jpg',
    description: 'Connecting peacebuilders across West Africa through regional platforms.',
  },
  {
    image: '/images/_VEE7017 (19) (1).jpg',
    description: 'Training over 5,000 youth as peace champions in dialogue and engagement.',
  },
  {
    image: '/images/PXL_20251008_095815014~2.jpg',
    description: 'Recognized for outstanding contributions to youth empowerment.',
  },
]

const defaultTypewriterPhrases = [
  'build peaceful communities.',
  'empower youth for change.',
  'prevent violent conflicts.',
  'foster dialogue & healing.',
  'champion policy reforms.',
]

// Types for CMS data
interface HeroSlide {
  image?: { url?: string } | string
  description: string
}

interface HeroCta {
  primaryText?: string
  primaryLink?: string
  secondaryText?: string
  secondaryLink?: string
}

export interface HeroSectionProps {
  slogan?: string
  mainTitle?: string
  slides?: HeroSlide[]
  typewriterPhrases?: { phrase: string }[]
  cta?: HeroCta
}

function TypewriterText({ phrases }: { phrases: string[] }) {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[currentPhrase]
    const typeSpeed = isDeleting ? 30 : 80
    const pauseDuration = 2000

    if (!isDeleting && displayText === phrase) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
      return
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(phrase.substring(0, displayText.length - 1))
      } else {
        setDisplayText(phrase.substring(0, displayText.length + 1))
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentPhrase, phrases])

  return (
    <span className="relative inline-flex items-center">
      <span className="text-accent-gold font-semibold drop-shadow-[0_0_20px_rgba(252,195,11,0.5)]">
        {displayText}
      </span>
      <span className="inline-block w-[4px] h-[1.1em] bg-accent-gold ml-0.5 animate-blink rounded-full shadow-[0_0_8px_rgba(252,195,11,0.8)]" />
    </span>
  )
}

export function HeroSection({
  slogan = 'Empowering Communities for Peace',
  mainTitle = 'Building Blocks for Peace',
  slides,
  typewriterPhrases,
  cta,
}: HeroSectionProps) {
  // Process slides - use CMS data or fallback to defaults
  const heroSlides = slides?.length 
    ? slides.map(slide => ({
        image: typeof slide.image === 'string' ? slide.image : slide.image?.url || defaultSlides[0].image,
        description: slide.description,
      }))
    : defaultSlides
  
  // Process typewriter phrases
  const phrases = typewriterPhrases?.length 
    ? typewriterPhrases.map(p => p.phrase)
    : defaultTypewriterPhrases

  // CTA buttons
  const primaryCtaText = cta?.primaryText || 'Explore Our Work'
  const primaryCtaLink = cta?.primaryLink || '/programmes'
  const secondaryCtaText = cta?.secondaryText || 'Get Involved'
  const secondaryCtaLink = cta?.secondaryLink || '/contact'

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 800)
  }, [isAnimating])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setTimeout(() => setIsAnimating(false), 800)
  }, [isAnimating])

  // Auto-play
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide, isPaused])

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[650px] max-h-[900px] overflow-hidden">
      {/* Background Slides */}
      {heroSlides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={slide.image}
            alt="BB4Peace"
            fill
            className="object-cover"
            priority={idx === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-900/85 to-primary-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/30" />
        </div>
      ))}

      {/* Main Content */}
      <div className="container relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-5xl">
          {/* Line 1: Slogan */}
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span className="text-accent-gold text-xs sm:text-sm font-semibold uppercase tracking-widest">
              {slogan}
            </span>
          </div>

          {/* Line 2: Big Caption */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-none mb-4 whitespace-nowrap">
            {mainTitle}
          </h1>

          {/* Line 3: Typewriter Effect */}
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white/90 mb-6 h-[1.5em] overflow-hidden">
            <span className="text-gray-300">We </span>
            <TypewriterText phrases={phrases} />
          </div>

          {/* Line 4: One-line Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-3xl line-clamp-1">
            {heroSlides[currentSlide].description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryCtaLink}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold bg-accent-gold text-primary-950 hover:bg-yellow-400 transition-all"
            >
              {primaryCtaText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={secondaryCtaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              {secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true)
                      setCurrentSlide(idx)
                      setTimeout(() => setIsAnimating(false), 800)
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? 'w-10 bg-accent-gold'
                      : 'w-4 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                aria-label={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? (
                  <Play className="w-4 h-4 text-white ml-0.5" />
                ) : (
                  <Pause className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  )
}
