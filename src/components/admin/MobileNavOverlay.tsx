'use client'

import { useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

const MOBILE_NAV_MEDIA_QUERY = '(max-width: 768px)'

/**
 * Provider that renders a backdrop overlay on mobile when the admin nav is open.
 * Tapping the backdrop closes the nav. Also auto-closes on route changes.
 */
export function MobileNavOverlay({ children }: { children: React.ReactNode }) {
  const { navOpen, setNavOpen } = useNav()
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_NAV_MEDIA_QUERY)

    const syncViewportState = (matches: boolean) => {
      setIsMobileViewport(matches)

      if (matches) {
        setNavOpen(false)
      }
    }

    syncViewportState(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      syncViewportState(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [setNavOpen])

  // Close nav on route change (mobile navigation)
  useEffect(() => {
    if (prevPathname.current !== pathname && navOpen && isMobileViewport) {
        setNavOpen(false)
    }
    prevPathname.current = pathname
  }, [isMobileViewport, pathname, navOpen, setNavOpen])

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (navOpen && isMobileViewport) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileViewport, navOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('bb-mobile-nav-open', navOpen && isMobileViewport)

    return () => {
      document.documentElement.classList.remove('bb-mobile-nav-open')
    }
  }, [isMobileViewport, navOpen])

  return <>{children}</>
}
