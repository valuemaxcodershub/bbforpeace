'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
  distance?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 600,
  distance = 30,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const getInitialTransform = () => {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`
        case 'down': return `translateY(-${distance}px)`
        case 'left': return `translateX(${distance}px)`
        case 'right': return `translateX(-${distance}px)`
        case 'fade': return 'none'
        default: return `translateY(${distance}px)`
      }
    }

    // Set initial state
    element.style.opacity = '0'
    element.style.transform = getInitialTransform()
    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
    element.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = '1'
            element.style.transform = 'translateY(0) translateX(0)'
            if (once) {
              observer.unobserve(element)
            }
          } else if (!once) {
            element.style.opacity = '0'
            element.style.transform = getInitialTransform()
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay, direction, distance, duration, once])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// Staggered reveal for lists/grids
interface StaggerRevealProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
}

export function StaggerReveal({
  children,
  className = '',
  staggerDelay = 100,
  direction = 'up',
}: StaggerRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal key={index} delay={index * staggerDelay} direction={direction}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}
