'use client'

import { useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

const MOBILE_NAV_MEDIA_QUERY = '(max-width: 768px)'

/**
 * Provider that renders a backdrop overlay on mobile when the admin nav is open.
 * Tapping the backdrop closes the nav. Also auto-closes on route changes.
 */
export function MobileNavOverlay({ children }: { children: React.ReactNode }) {
  const { navOpen, setNavOpen } = useNav()
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  // Close nav on route change (mobile navigation)
  useEffect(() => {
    if (prevPathname.current !== pathname && navOpen) {
      const isMobile = window.matchMedia(MOBILE_NAV_MEDIA_QUERY).matches
      if (isMobile) {
        setNavOpen(false)
      }
    }
    prevPathname.current = pathname
  }, [pathname, navOpen, setNavOpen])

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    const isMobile = window.matchMedia(MOBILE_NAV_MEDIA_QUERY).matches
    if (navOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  useEffect(() => {
    const isMobile = window.matchMedia(MOBILE_NAV_MEDIA_QUERY).matches

    document.documentElement.classList.toggle('bb-mobile-nav-open', navOpen && isMobile)

    return () => {
      document.documentElement.classList.remove('bb-mobile-nav-open')
    }
  }, [navOpen])

  return (
    <>
      {navOpen && (
        <div
          className="bb-mobile-nav-backdrop"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}
      {children}
    </>
  )
}
