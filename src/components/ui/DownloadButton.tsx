'use client'

import { useEffect, useState } from 'react'
import { trackDownload } from '@/app/actions/download'
import { formatDownloadCountLabel } from '@/lib/utils'

interface DownloadButtonProps {
  publicationId: number | string
  fileUrl: string
  className?: string
  children?: React.ReactNode
  initialDownloadCount?: number
  showCount?: boolean
}

export function DownloadButton({
  publicationId,
  fileUrl,
  className,
  children,
  initialDownloadCount = 0,
  showCount = true,
}: DownloadButtonProps) {
  const [count, setCount] = useState(initialDownloadCount)

  useEffect(() => {
    setCount(initialDownloadCount)
  }, [initialDownloadCount, publicationId])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    trackDownload(publicationId)
      .then((result) => {
        if (result.success && typeof result.downloadCount === 'number') {
          setCount(result.downloadCount)
        }
      })
      .catch(() => {})
  }

  const label = showCount ? formatDownloadCountLabel(count) : 'Download'

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      download={fileUrl.toLowerCase().includes('.pdf') ? '' : undefined}
      onClick={handleClick}
      className={className}
    >
      {children ?? label}
    </a>
  )
}
