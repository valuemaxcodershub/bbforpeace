'use client'

import Image from 'next/image'

export function Icon() {
  return (
    <Image
      src="/images/logo.jpg"
      alt="BB4Peace"
      width={36}
      height={36}
      className="rounded-full ring-2 ring-white/30 shadow-md"
    />
  )
}
