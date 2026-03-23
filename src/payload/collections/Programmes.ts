import type { CollectionConfig, Access } from 'payload'
import { sanitizeAdminDocumentData } from './shared/adminSanitizers'

// Access control: Admins and above can manage programmes
const isAdminOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin' || user.role === 'editor'
}

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'order'],
    description: 'Programs and initiatives',
    group: 'Programme page',
  },
  access: {
    read: () => true, // Public can read programmes
    create: isAdminOrAbove,
    update: isAdminOrAbove,
    delete: isAdminOrAbove,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data || typeof data !== 'object') return data
        return sanitizeAdminDocumentData(data as Record<string, unknown>, {
          relationFields: ['featuredImage'],
          nestedArrayRelationFields: [{ arrayField: 'gallery', itemField: 'image' }],
        })
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Lucide icon name (e.g., "users", "heart", "globe")',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 200,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'objectives',
      type: 'array',
      label: 'Key Objectives',
      fields: [
        {
          name: 'objective',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Achievements',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'metric',
          type: 'text',
          admin: {
            description: 'e.g., "5000+ youth trained"',
          },
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Photo Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Upcoming', value: 'upcoming' },
      ],
      defaultValue: 'active',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
        },
      ],
    },
  ],
}
