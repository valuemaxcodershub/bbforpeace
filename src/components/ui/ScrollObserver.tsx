'use client'

import { useEffect } from 'react'

export function ScrollObserver() {
  useEffect(() => {
    // Use IntersectionObserver for reliable scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = parseInt(el.dataset.delay || '0', 10)
            
            if (delay > 0) {
              setTimeout(() => {
                el.classList.add('in-view')
              }, delay)
            } else {
              el.classList.add('in-view')
            }
            
            // Stop observing once animated
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.1,  // Trigger when 10% visible
        rootMargin: '0px 0px -10% 0px',  // Trigger slightly before fully in view
      }
    )

    // Observe all scroll-animated elements
    const elements = document.querySelectorAll('[data-scroll]')
    elements.forEach((el) => observer.observe(el))

    // Fallback: manually trigger for elements already in view on load
    const triggerVisibleElements = () => {
      const stillHidden = document.querySelectorAll('[data-scroll]:not(.in-view)')
      stillHidden.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const htmlEl = el as HTMLElement
          const delay = parseInt(htmlEl.dataset.delay || '0', 10)
          if (delay > 0) {
            setTimeout(() => el.classList.add('in-view'), delay)
          } else {
            el.classList.add('in-view')
          }
        }
      })
    }

    // Run fallback multiple times to ensure elements are revealed
    setTimeout(triggerVisibleElements, 100)
    setTimeout(triggerVisibleElements, 500)
    setTimeout(triggerVisibleElements, 1000)

    return () => observer.disconnect()
  }, [])

  return null
}
