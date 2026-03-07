import type { CollectionConfig, Access } from 'payload'

// Access control: Editors and above can manage tags
const isAdminOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin' || user.role === 'editor'
}

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    description: 'Tags for posts and publications',
    group: 'Media Page',
    hidden: true,
  },
  access: {
    read: () => true, // Public can read tags
    create: isAdminOrAbove,
    update: isAdminOrAbove,
    delete: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
