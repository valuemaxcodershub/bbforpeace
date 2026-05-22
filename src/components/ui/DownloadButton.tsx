'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
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

  const persistDownload = async () => {
    try {
      const res = await fetch(`/api/publications/${publicationId}/download`, { method: 'POST' })
      const result = await res.json()
      if (result.success && typeof result.downloadCount === 'number') {
        setCount(result.downloadCount)
        return
      }
    } catch {
      /* try server action fallback */
    }
    const fallback = await trackDownload(publicationId)
    if (fallback.success && typeof fallback.downloadCount === 'number') {
      setCount(fallback.downloadCount)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    persistDownload()
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
      {children ?? (
        <>
          {!showCount && <Download className="w-4 h-4" />}
          {label}
        </>
      )}
    </a>
  )
}
