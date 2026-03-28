import type { CollectionConfig, Access } from 'payload'
import { autoSlugHook, SLUG_ADMIN_DESCRIPTION } from './shared/slugUtils'

// Access control: Only admins can manage categories
const isAdminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin'
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    description: 'Blog post categories',
    group: 'Media Page',
  },
  access: {
    read: () => true, // Public can read categories
    create: isAdminOnly,
    update: isAdminOnly,
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  hooks: {
    beforeValidate: [autoSlugHook],
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
      admin: {
        description: SLUG_ADMIN_DESCRIPTION,
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code (e.g., #28005b)',
      },
    },
  ],
}
