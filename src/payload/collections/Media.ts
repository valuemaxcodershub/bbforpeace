import type { CollectionConfig, Access } from 'payload'

// Access control: Authenticated users can manage media
const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
    group: 'Media Page',
    hidden: true,
  },
  access: {
    read: () => true, // Public can view media
    create: isAuthenticated,
    update: isAuthenticated,
    delete: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin',
  },
  upload: {
    staticDir: '../public/uploads',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
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
