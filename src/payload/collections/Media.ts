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
  // Run ALL checks in parallel to stay within Vercel's 60s timeout.
  // Each promise resolves to an array of usage strings (empty if not used).
  const checks: Promise<string[]>[] = []

  // 1. Collection field checks (all in parallel)
  for (const [slug, fields] of Object.entries(MEDIA_REFS_COLLECTIONS)) {
    for (const [field, label] of Object.entries(fields)) {
      checks.push(
        req.payload.find({
          collection: slug as any,
          where: { [field]: { equals: id } },
          limit: 3,
          depth: 0,
          select: { title: true, name: true, email: true },
        }).then((result) =>
          result.docs.map((doc: any) => {
            const title = doc.title || doc.name || doc.email || `ID ${doc.id}`
            return `${label}: "${title}"`
          })
        ).catch(() => [])
      )
    }
  }

  // 2. Array field checks (in parallel with everything else)
  const arrayChecks = [
    { collection: 'posts', field: 'mediaGallery.image', label: 'Blog — Gallery Image' },
    { collection: 'programmes', field: 'gallery.image', label: 'Programme — Gallery Image' },
  ]
  for (const check of arrayChecks) {
    checks.push(
      req.payload.find({
        collection: check.collection as any,
        where: { [check.field]: { equals: id } },
        limit: 3,
        depth: 0,
        select: { title: true },
      }).then((result) =>
        result.docs.map((doc: any) => `${check.label} in "${doc.title || `ID ${doc.id}`}"`)
      ).catch(() => [])
    )
  }

  // 3. Global checks (in parallel with everything else)
  for (const [slug, fields] of Object.entries(MEDIA_REFS_GLOBALS)) {
    checks.push(
      req.payload.findGlobal({ slug: slug as any, depth: 0 })
        .then((global: any) => {
          const hits: string[] = []
          if (!global) return hits
          for (const [fieldPath, label] of Object.entries(fields)) {
            const value = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], global)
            if (value === id || value === Number(id)) hits.push(label)
          }
          return hits
        })
        .catch(() => [])
    )
  }

  // Wait for ALL checks at once (single round-trip of parallel queries)
  const results = await Promise.all(checks)
  const usages = results.flat()

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
