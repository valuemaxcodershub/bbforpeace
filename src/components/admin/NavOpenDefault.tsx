'use client'

import { useNav } from '@payloadcms/ui'
import { useEffect, useRef } from 'react'

/**
 * Ensures the admin sidebar is always open by default on desktop (≥ 1025px).
 *
 * Payload's internal NavProvider has several effects that can close the nav:
 *   – On mount it loads a stored preference; if the user previously closed the
 *     sidebar the preference says { open: false } and the nav stays collapsed.
 *   – Breakpoint-detection effects may briefly toggle the nav closed during
 *     hydration.
 *
 * This component waits for Payload to finish hydrating, then:
 *   1. Immediately updates the stored preference to { open: true } so Payload's
 *      own preference-loading effect cooperates.
 *   2. After a short delay (to run *after* all internal effects settle) it
 *      forces setNavOpen(true).
 *
 * On mobile/tablet the sidebar stays closed — the mobile CSS overlay handles it.
 * After the initial force-open the user can freely toggle via the hamburger.
 */
export const NavOpenDefault: React.FC = () => {
  const { navOpen, setNavOpen, hydrated } = useNav()
  const hasForced = useRef(false)

  useEffect(() => {
    // Only act once, and only after Payload has hydrated the nav state
    if (hasForced.current || !hydrated) return

    const isDesktop = window.matchMedia('(min-width: 1025px)').matches
    if (!isDesktop) return

    hasForced.current = true

    // Force nav open after a short delay so we run *after* Payload's preference
    // loading & breakpoint effects have settled
    const timer = setTimeout(() => {
      setNavOpen(true)
      // Mark CSS to stop force-overriding; from now on, JS state is in control
      // and the user can toggle the sidebar freely via the hamburger button.
      document.documentElement.classList.add('bb-nav-initialized')
    }, 350)

    return () => clearTimeout(timer)
  }, [hydrated, setNavOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
