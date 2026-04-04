'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

// Slide transition effects - WOW slider inspired
const TRANSITION_EFFECTS = [
  'turn',
  'cube',
  'louvers',
  'carousel',
  'parallax',
  'brick',
  'collage',
  'blast',
  'blind',
  'book',
] as const

type TransitionEffect = typeof TRANSITION_EFFECTS[number]

// Default fallback data - each slide has a unique image
const defaultSlides = [
  {
    image: '/images/_VEE6792.jpg',
    description: 'Bridging grassroots action, policy advocacy, and regional networking for sustainable peace.',
  },
  {
    image: '/images/_VEE7017 (19) (1).jpg',
    description: 'Connecting peacebuilders across West Africa through regional platforms.',
  },
  {
    image: '/images/_VEE7037 (1).jpg',
    description: 'Training over 5,000 youth as peace champions in dialogue and engagement.',
  },
  {
    image: '/images/_VEE7943.jpg',
    description: 'Recognized for outstanding contributions to youth empowerment.',
  },
  {
    image: '/images/PXL_20251023_124331635.MP~2.jpg',
    description: 'Building bridges between communities through dialogue and reconciliation.',
  },
  {
    image: '/images/PXL_20251007_102503598.MP.jpg',
    description: 'Advocating for inclusive policies that prioritize youth and peace.',
  },
  {
    image: '/images/PXL_20251008_123434690.MP.jpg',
    description: 'Fostering partnerships for sustainable development and peace.',
  },
  {
    image: '/images/PXL_20251008_095815014~2.jpg',
    description: 'Equipping young people as active agents through capacity building and mentorship.',
  },
  {
    image: '/images/PXL_20251007_092308643.jpg',
    description: 'Creating pathways for youth engagement in peacebuilding initiatives.',
  },
]

const defaultTypewriterPhrases = [
  'build peaceful communities.',
  'empower youth for change.',
  'prevent violent conflicts.',
  'foster dialogue & healing.',
  'champion policy reforms.',
]

// Get transition classes based on effect type - WOW slider inspired (used as fallback)
function getTransitionClasses(effect: TransitionEffect, isActive: boolean, isLeaving: boolean): string {
  const baseClasses = 'absolute inset-0 will-change-transform backface-visibility-hidden'
  const duration = 'duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)]'
  
  if (isActive) {
    return `${baseClasses} z-20 transition-all ${duration} opacity-100 ${getEnterEffect(effect)}`
  } else if (isLeaving) {
    return `${baseClasses} z-10 transition-all ${duration} ${getLeaveEffect(effect)}`
  } else {
    return `${baseClasses} z-0 opacity-0`
  }
}

// Get leave effect classes only (for inline usage) - WOW slider style effects
function getLeaveEffect(effect: TransitionEffect): string {
  switch (effect) {
    case 'turn':
      // Door-like rotation around vertical axis
      return 'opacity-0 [transform:perspective(1200px)_rotateY(-120deg)] origin-left'
    case 'cube':
      // 3D cube rotation with depth
      return 'opacity-0 [transform:perspective(1500px)_rotateY(-90deg)_translateZ(-300px)_scale(0.8)]'
    case 'louvers':
      // Venetian blinds closing effect
      return 'opacity-0 [clip-path:polygon(0_0,100%_0,100%_0%,0_0%,0_20%,100%_20%,100%_20%,0_20%,0_40%,100%_40%,100%_40%,0_40%,0_60%,100%_60%,100%_60%,0_60%,0_80%,100%_80%,100%_80%,0_80%)]'
    case 'carousel':
      // 3D carousel spin away
      return 'opacity-0 [transform:perspective(1000px)_rotateY(-45deg)_translateX(-50%)_scale(0.7)]'
    case 'parallax':
      // Layered parallax movement with zoom
      return 'opacity-0 scale-125 -translate-x-1/3 blur-sm'
    case 'brick':
      // Breaking apart effect
      return 'opacity-0 [transform:perspective(1000px)_rotateX(15deg)_translateY(20%)_scale(0.9)]'
    case 'collage':
      // Tiles scattering effect
      return 'opacity-0 [transform:scale(1.1)_rotate(3deg)] blur-[2px]'
    case 'blast':
      // Explosion/blast outward
      return 'opacity-0 scale-150 blur-md [transform:perspective(800px)_translateZ(200px)]'
    case 'blind':
      // Rolling blind from top
      return 'opacity-0 [clip-path:inset(100%_0_0_0)] origin-top'
    case 'book':
      // Page turn effect
      return 'opacity-0 [transform:perspective(1500px)_rotateY(-90deg)_translateX(-30%)] origin-left'
    default:
      return 'opacity-0 scale-105'
  }
}

// Get enter effect classes for incoming slide
function getEnterEffect(effect: TransitionEffect): string {
  switch (effect) {
    case 'turn':
      return '[transform:perspective(1200px)_rotateY(0deg)] origin-right'
    case 'cube':
      return '[transform:perspective(1500px)_rotateY(0deg)_translateZ(0)_scale(1)]'
    case 'louvers':
      return '[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]'
    case 'carousel':
      return '[transform:perspective(1000px)_rotateY(0deg)_translateX(0)_scale(1)]'
    case 'parallax':
      return 'scale-100 translate-x-0 blur-0'
    case 'brick':
      return '[transform:perspective(1000px)_rotateX(0deg)_translateY(0)_scale(1)]'
    case 'collage':
      return '[transform:scale(1)_rotate(0deg)] blur-0'
    case 'blast':
      return 'scale-100 blur-0 [transform:perspective(800px)_translateZ(0)]'
    case 'blind':
      return '[clip-path:inset(0_0_0_0)] origin-top'
    case 'book':
      return '[transform:perspective(1500px)_rotateY(0deg)_translateX(0)] origin-left'
    default:
      return 'scale-100'
  }
}

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
  mainTitle = 'Building Blocks for Peace',
  slides,
  typewriterPhrases,
  cta,
}: HeroSectionProps) {
  // Process slides - use CMS data or fallback to defaults
  // Only use CMS slides if they have actual content
  const heroSlides = (slides && slides.length > 0 && slides[0]?.image)
    ? slides.map(slide => ({
        image: getMediaUrl(slide.image, defaultSlides[0].image),
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
  const [previousSlide, setPreviousSlide] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentEffect, setCurrentEffect] = useState<TransitionEffect>('turn')
  const sectionRef = useRef<HTMLElement>(null)

  // Get random effect for next transition
  const getRandomEffect = useCallback((): TransitionEffect => {
    const randomIndex = Math.floor(Math.random() * TRANSITION_EFFECTS.length)
    return TRANSITION_EFFECTS[randomIndex]
  }, [])

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setPreviousSlide(currentSlide)
    setCurrentEffect(getRandomEffect())
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setTimeout(() => {
      setIsAnimating(false)
      setPreviousSlide(null)
    }, 1500)
  }, [isAnimating, currentSlide, getRandomEffect, heroSlides.length])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setPreviousSlide(currentSlide)
    setCurrentEffect(getRandomEffect())
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setTimeout(() => {
      setIsAnimating(false)
      setPreviousSlide(null)
    }, 2000) // Allow effect to complete (matches 1800ms duration + buffer)
  }, [isAnimating, currentSlide, getRandomEffect, heroSlides.length])

  // Auto-play - 8 second interval for dramatic effects
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 8000)
    return () => clearInterval(interval)
  }, [nextSlide, isPaused])

  return (
    <section ref={sectionRef} className="relative h-[65vh] sm:h-[80vh] min-h-[420px] sm:min-h-[500px] max-h-[750px] overflow-hidden">
      {/* Background Slides - all slides in DOM, visibility controlled by CSS */}
      {heroSlides.map((slide, idx) => {
        const isActive = idx === currentSlide
        const isLeaving = idx === previousSlide
        
        return (
          <div
            key={`hero-slide-${idx}`}
            className={`absolute inset-0 will-change-transform ${
              isActive 
                ? `z-20 transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0 blur-0 ${getEnterEffect(currentEffect)}`
                : isLeaving 
                  ? `z-10 transition-all duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${getLeaveEffect(currentEffect)}`
                  : 'z-0 opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.image}
              alt={`BBFORPEACE slide ${idx + 1}`}
              fill
              className={`object-cover ${idx === 0 ? 'object-[center_25%] sm:object-[center_10%]' : 'object-[center_25%]'}`}
              priority={idx < 3}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-950/75 via-primary-900/75 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-primary-940/60 via-transparent to-primary-940/45" />
          </div>
        )
      })}

      {/* Main Content */}
      <div className="container relative z-30 h-full flex flex-col justify-center pt-4 sm:pt-0">
        <div className="max-w-5xl -mt-8 sm:-mt-4">
          {/* Big Caption */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-none mb-2 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {mainTitle}
          </h1>

          {/* Line 3: Typewriter Effect */}
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white/90 mb-3 h-[1.5em] overflow-hidden drop-shadow-lg whitespace-nowrap">
            <span className="text-gray-200">We </span>
            <TypewriterText phrases={phrases} />
          </div>

          {/* Line 4: One-line Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-5 max-w-3xl whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-md">
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
      <div className="absolute bottom-8 left-0 right-0 z-40">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isAnimating && idx !== currentSlide) {
                      setIsAnimating(true)
                      setPreviousSlide(currentSlide)
                      setCurrentEffect(getRandomEffect())
                      setCurrentSlide(idx)
                      setTimeout(() => {
                        setIsAnimating(false)
                        setPreviousSlide(null)
                      }, 2000)
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide
                      ? 'w-10 bg-accent-gold'
                      : 'w-4 bg-white/40 hover:bg-white/70 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
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
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10" />
    </section>
  )
}
