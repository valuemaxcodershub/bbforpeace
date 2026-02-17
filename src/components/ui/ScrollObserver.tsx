'use client'

import { useEffect } from 'react'

export function ScrollObserver() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-scroll]:not(.in-view)')
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Element is in viewport when its top is less than 85% of window height
        if (rect.top < windowHeight * 0.85) {
          const htmlEl = el as HTMLElement
          const delay = parseInt(htmlEl.dataset.delay || '0', 10)
          
          if (delay > 0) {
            setTimeout(() => {
              el.classList.add('in-view')
            }, delay)
          } else {
            el.classList.add('in-view')
          }
        }
      })
    }

    // Run on scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Run once on mount after a short delay
    setTimeout(handleScroll, 200)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null
}
