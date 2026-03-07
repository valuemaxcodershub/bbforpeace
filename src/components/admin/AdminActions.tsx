'use client'

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
            <a href="/admin/logout" className="bb-admin-user__item" role="menuitem">
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
