'use client'

import { useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

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
      const isMobile = window.matchMedia('(max-width: 1024px)').matches
      if (isMobile) {
        setNavOpen(false)
      }
    }
    prevPathname.current = pathname
  }, [pathname, navOpen, setNavOpen])

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches
    if (navOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
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
