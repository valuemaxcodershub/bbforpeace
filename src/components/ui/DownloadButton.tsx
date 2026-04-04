'use client'

import { Download } from 'lucide-react'
import { trackDownload } from '@/app/actions/download'

interface DownloadButtonProps {
  publicationId: number | string
  fileUrl: string
  className?: string
  children?: React.ReactNode
}

export function DownloadButton({ publicationId, fileUrl, className, children }: DownloadButtonProps) {
  const handleClick = () => {
    // Fire-and-forget: don't block the download
    trackDownload(publicationId).catch(() => {})
  }

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
          Download PDF
        </>
      )}
    </a>
  )
}
