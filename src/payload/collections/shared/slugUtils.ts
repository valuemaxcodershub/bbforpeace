/**
 * Shared slug utilities for Payload CMS collections.
 * Auto-generates URL-friendly slugs from the title field.
 */

/** Convert any string to a URL-friendly slug */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '')           // trim leading/trailing hyphens
}

/**
 * Payload beforeValidate hook that auto-generates and sanitizes slugs.
 * - If slug is empty, generates one from the title (or name) field
 * - Always sanitizes the slug to be URL-friendly
 */
export function autoSlugHook({ data }: { data?: Record<string, any> }) {
  if (!data || typeof data !== 'object') return data

  // Auto-generate slug from title or name if slug is empty
  const source = data.title || data.name
  if (!data.slug && source) {
    data.slug = slugify(source)
  }

  // Always sanitize existing slug
  if (data.slug) {
    data.slug = slugify(data.slug)
  }

  return data
}

/** Admin description shown below the slug field */
export const SLUG_ADMIN_DESCRIPTION =
  'URL-friendly identifier. Auto-generated from the title if left empty. Use lowercase letters, numbers, and hyphens only.'
