import type { CollectionConfig, Access } from 'payload'

// Access control: Only super admin and admin can manage team
const isAdminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin'
}

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'category', 'order'],
    description: 'Team members, board of trustees, and advisors',
    group: 'About us page',
  },
  access: {
    read: () => true, // Public can read team info
    create: isAdminOnly,
    update: isAdminOnly,
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'shortBio',
      type: 'textarea',
      maxLength: 200,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Board of Trustees', value: 'board' },
        { label: 'Staff', value: 'staff' },
        { label: 'Advisors', value: 'advisors' },
        { label: 'Volunteers', value: 'volunteers' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
      ],
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
