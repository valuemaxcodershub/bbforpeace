import type { CollectionConfig, Access, CollectionBeforeDeleteHook } from 'payload'

// Access control: Authenticated users can manage media
const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Map of every collection/field that can reference media.
 * Format: { collectionSlug: { fieldName: displayLabel } }
 * For nested array fields use dot notation for the DB column.
 */
const MEDIA_REFS_COLLECTIONS: Record<string, Record<string, string>> = {
  posts: { featuredImage: 'Blog/Press — Featured Image' },
  publications: { coverImage: 'Report — Cover Image', file: 'Report — PDF File' },
  events: { featuredImage: 'Event — Featured Image' },
  'gallery-items': { image: 'Gallery — Image' },
  programmes: { featuredImage: 'Programme — Featured Image' },
  team: { photo: 'Team — Photo' },
  partners: { logo: 'Partner — Logo' },
  testimonials: { image: 'Testimonial — Image' },
  users: { avatar: 'User — Avatar' },
}

/**
 * Map of globals that reference media.
 * Format: { globalSlug: { fieldPath: displayLabel } }
 * fieldPath uses dot notation matching the Payload field structure.
 */
const MEDIA_REFS_GLOBALS: Record<string, Record<string, string>> = {
  'general-settings': { logo: 'General Settings — Logo', favicon: 'General Settings — Favicon' },
  'seo-settings': { 'og.image': 'SEO Settings — OG Image', ogImage: 'SEO Settings — OG Image' },
  'award-settings': { backgroundImage: 'Award Settings — Background Image' },
  'contact-us-page-settings': { mapBackgroundImage: 'Contact Page — Map Background' },
}

const beforeDeleteCheckUsage: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const usages: string[] = []

  // 1. Check collections
  for (const [slug, fields] of Object.entries(MEDIA_REFS_COLLECTIONS)) {
    for (const [field, label] of Object.entries(fields)) {
      try {
        const result = await req.payload.find({
          collection: slug as any,
          where: { [field]: { equals: id } },
          limit: 3,
          depth: 0,
        })
        for (const doc of result.docs) {
          const title = (doc as any).title || (doc as any).name || (doc as any).alt || (doc as any).email || `ID ${doc.id}`
          usages.push(`${label}: "${title}"`)
        }
      } catch {
        // Collection might not exist or field might be mismatched — skip
      }
    }
  }

  // 2. Check array fields (posts.mediaGallery, programmes.gallery, home-page heroSlides, etc.)
  // These store media IDs in sub-rows; query via the parent collection
  const arrayChecks = [
    { collection: 'posts', arrayField: 'mediaGallery', subField: 'image', label: 'Blog — Gallery Image' },
    { collection: 'programmes', arrayField: 'gallery', subField: 'image', label: 'Programme — Gallery Image' },
  ]
  for (const check of arrayChecks) {
    try {
      const result = await req.payload.find({
        collection: check.collection as any,
        where: { [`${check.arrayField}.${check.subField}`]: { equals: id } },
        limit: 3,
        depth: 0,
      })
      for (const doc of result.docs) {
        const title = (doc as any).title || `ID ${doc.id}`
        usages.push(`${check.label} in "${title}"`)
      }
    } catch {
      // Skip if query structure doesn't match
    }
  }

  // 3. Check globals via Payload's findGlobal API
  for (const [slug, fields] of Object.entries(MEDIA_REFS_GLOBALS)) {
    try {
      const global = await req.payload.findGlobal({ slug: slug as any, depth: 0 })
      if (!global) continue
      for (const [fieldPath, label] of Object.entries(fields)) {
        // Resolve dot-notation paths (e.g. 'og.image')
        const value = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], global)
        if (value === id || value === Number(id)) {
          usages.push(label)
        }
      }
    } catch {
      // Global might not exist — skip
    }
  }

  if (usages.length > 0) {
    const list = usages.map((u) => `  • ${u}`).join('\n')
    throw new Error(
      `Cannot delete this file — it is currently in use:\n\n${list}\n\nPlease replace it in those locations first, then try deleting again.`
    )
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    group: 'Uploads',
    description: 'All uploaded images, PDFs, and documents. Delete unused files to save storage.',
  },
  access: {
    read: () => true, // Public can view media
    create: isAuthenticated,
    update: isAuthenticated,
    delete: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin',
  },
  hooks: {
    beforeDelete: [beforeDeleteCheckUsage],
    beforeChange: [
      ({ data }) => {
        // Sanitize filename: replace spaces/special chars with hyphens to
        // prevent Vercel Blob double-encoding issues (%20 → %2520)
        if (data?.filename) {
          data.filename = data.filename
            .replace(/%20/g, '-')       // literal %20 → hyphen
            .replace(/\s+/g, '-')       // spaces → hyphen
            .replace(/[()[\]{}]/g, '')  // remove brackets/parens
            .replace(/-{2,}/g, '-')     // collapse multiple hyphens
            .replace(/^-|-$/g, '')      // trim leading/trailing hyphens
        }
        return data
      },
    ],
  },
  upload: {
    staticDir: '../public/uploads',
    // On Vercel, local filesystem is read-only. Disable local storage so uploads
    // fail fast with an error instead of hanging when no cloud adapter is configured.
    disableLocalStorage: !!process.env.VERCEL,
    mimeTypes: [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      // Some browsers/systems misdetect PDFs or Office docs as these types
      'application/octet-stream',
      'text/plain',
    ],
    // No imageSizes — the frontend uses next/image which handles responsive
    // resizing automatically. Generating sizes server-side would require sharp
    // to download, resize ×3, and re-upload to Vercel Blob, causing timeouts.
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
  ],
}
