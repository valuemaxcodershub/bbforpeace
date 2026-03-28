import type { CollectionConfig, Access } from 'payload'

// Access control: Authenticated users can manage media
const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
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
