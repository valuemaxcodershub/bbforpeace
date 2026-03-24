'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export function AdminActions() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="bb-admin-actions">
      {/* Logo visible only on mobile (≤768px), sits between hamburger and user icon */}
      <span className="bb-admin-actions__mobile-logo">
        <Image
          src="/images/logo.jpg"
          alt="BB4Peace"
          width={34}
          height={34}
          className="rounded-full"
        />
      </span>

      <span className="bb-admin-actions__title">BBforPeace Admin Panel</span>

      <div className="bb-admin-user" ref={menuRef}>
        <button
          type="button"
          className="bb-admin-user__trigger"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <span className="bb-admin-user__icon">👤</span>
        </button>

        {isOpen && (
          <div className="bb-admin-user__menu" role="menu">
            <a href="/admin/account" className="bb-admin-user__item" role="menuitem">
              Profile
            </a>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                window.location.href = '/api/auth/logout'
              }}
              className="bb-admin-user__item"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
