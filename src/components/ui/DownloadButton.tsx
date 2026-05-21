'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { trackDownload } from '@/app/actions/download'

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

  const handleClick = () => {
    setCount((c) => c + 1)
    trackDownload(publicationId)
      .then((result) => {
        if (result.success && typeof result.downloadCount === 'number') {
          setCount(result.downloadCount)
        }
      })
      .catch(() => {})
  }

  const countLabel = showCount && count > 0 ? ` (${count.toLocaleString()})` : ''

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children || (
        <>
          <Download className="w-4 h-4" />
          Download PDF{countLabel}
        </>
      )}
    </a>
  )
}
