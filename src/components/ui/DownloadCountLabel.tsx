import { formatDownloadCountLabel } from '@/lib/utils'

interface DownloadCountLabelProps {
  count?: number
  className?: string
}

/** Non-clickable download stats (e.g. publications listing). */
export function DownloadCountLabel({ count = 0, className }: DownloadCountLabelProps) {
  return <span className={className}>{formatDownloadCountLabel(count)}</span>
}
