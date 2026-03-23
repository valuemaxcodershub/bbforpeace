import type { CollectionConfig, Access } from 'payload'
import { sanitizeAdminDocumentData } from './shared/adminSanitizers'


const isAdminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin'
}

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'website', 'order', 'isActive'],
    description: 'Partners and collaborating organizations',
    group: 'Content',
  },
  access: {
    read: () => true, // Public can read partners
    create: isAdminOnly,
    update: isAdminOnly,
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data || typeof data !== 'object') return data
        return sanitizeAdminDocumentData(data as Record<string, unknown>, {
          nullableRelationFields: ['logo'],
        })
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Funding Partner', value: 'funding' },
        { label: 'Implementing Partner', value: 'implementing' },
        { label: 'Strategic Partner', value: 'strategic' },
        { label: 'Network', value: 'network' },
      ],
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
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
