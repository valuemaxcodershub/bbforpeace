'use client'

import Image from 'next/image'

export function Logo() {
  return (
    <div className="bb-admin-logo flex items-center gap-3">
      <Image
        src="/images/logo.jpg"
        alt="BB4Peace"
        width={44}
        height={44}
        className="rounded-full ring-2 ring-white/40 shadow-md"
      />
      <div className="leading-tight">
        <span className="block text-base font-semibold text-gray-900 dark:text-white">
          BB4Peace Admin
        </span>
        <span className="block text-xs text-gray-600 dark:text-gray-300">Content Management</span>
      </div>
    </div>
  )
}
