import type { CollectionConfig, Access } from 'payload'

// Access control: Only admins can view/manage subscribers
const isAdminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin'
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'subscribedAt'],
    description: 'Newsletter subscribers',
    group: 'user',
  },
  access: {
    read: isAdminOnly, // Only admins can view subscribers
    create: () => true, // Public can subscribe (via forms)
    update: isAdminOnly,
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
      ],
      defaultValue: 'active',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
}
