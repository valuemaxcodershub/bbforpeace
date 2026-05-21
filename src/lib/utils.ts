import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    ...options,
  }
  return new Date(date).toLocaleDateString('en-NG', defaultOptions)
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/** Plain text from Payload Lexical JSON, HTML string, or textarea. */
export function plainTextFromRichText(content: unknown, maxLength?: number): string {
  if (!content) return ''
  if (typeof content === 'string') {
    const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return maxLength ? truncate(stripped, maxLength) : stripped
  }
  if (typeof content === 'object' && content !== null) {
    const root = (content as { root?: unknown }).root ?? content
    const text = extractLexicalText(root).replace(/\s+/g, ' ').trim()
    return maxLength ? truncate(text, maxLength) : text
  }
  return ''
}

function extractLexicalText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { type?: string; text?: string; children?: unknown[] }
  if (n.type === 'text' && typeof n.text === 'string') return n.text
  if (!Array.isArray(n.children)) return ''
  return n.children.map(extractLexicalText).join(' ')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Extract a usable image URL from a Payload CMS media field.
 * Handles:
 *   - null/undefined → fallback
 *   - string paths (e.g. '/images/photo.jpg') → encode if needed
 *   - Payload media objects resolved at depth >= 1
 *   - Payload API URLs (/api/media/file/...) backed by cloud storage
 */
export function getMediaUrl(media: unknown, fallback = '/images/_VEE7124%20(1).jpg'): string {
  if (!media) return fallback

  // If it's already a plain string path
  if (typeof media === 'string') {
    if (!media) return fallback
    return safeEncode(media)
  }

  // If it's a Payload media object
  if (typeof media === 'object' && media !== null) {
    const obj = media as Record<string, unknown>
    const url = typeof obj.url === 'string' ? obj.url : ''

    // Prefer direct absolute URLs (R2 public URL, CDN URL, etc.)
    if (url && /^https?:\/\//i.test(url)) {
      return url
    }

    if (url.includes('/api/media/file/') || url.includes('/api/media/file%2F')) {
      return safeEncode(url)
    }

    // If url is a local path (starts with / but not /api/), use it directly
    if (url && !url.includes('/api/media/file/')) {
      return safeEncode(url)
    }

    // Last resort: try filename for local assets
    const filename = typeof obj.filename === 'string' ? obj.filename : ''
    if (filename) return safeEncode('/images/' + filename)
  }

  return fallback
}

/** Direct document URL for a publication (external link or uploaded PDF). No image fallback. */
export function getPublicationFileUrl(pub: {
  externalFileUrl?: string | null
  file?: unknown
}): string {
  const external =
    typeof pub.externalFileUrl === 'string' ? pub.externalFileUrl.trim() : ''
  if (external) {
    try {
      new URL(external)
      return external
    } catch {
      /* invalid external URL */
    }
  }

  if (!pub.file) return ''

  if (typeof pub.file === 'string' || typeof pub.file === 'number') {
    return ''
  }

  if (typeof pub.file === 'object' && pub.file !== null) {
    const obj = pub.file as Record<string, unknown>
    const url = typeof obj.url === 'string' ? obj.url : ''
    if (url && /^https?:\/\//i.test(url)) return url
    if (url.includes('/api/media/file/')) return safeEncode(url)
    if (url) return url.startsWith('http') ? url : absoluteUrl(url)
  }

  return ''
}

export function formatDownloadCountLabel(count: number): string {
  const n = Math.max(0, count).toLocaleString('en-US')
  return count === 1 ? `download ${n} time` : `download ${n} times`
}

function safeEncode(url: string): string {
  if (!url) return url
  // Don't double-encode: if it already has %20 or %28, it's already encoded
  if (url.includes('%20') || url.includes('%28') || url.includes('%29')) return url
  // Encode if it has spaces or parentheses
  if (url.includes(' ') || url.includes('(') || url.includes(')')) return encodeURI(url)
  return url
}
