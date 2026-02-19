import type { CollectionConfig, Access, FieldAccess } from 'payload'

// Access control helpers
const isSuperAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'super-admin'
}

const isSuperAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.role === 'super-admin') return true
  return user?.id === String(id)
}

const isAdminOrAbove: Access = ({ req: { user } }) => {
  return user?.role === 'super-admin' || user?.role === 'admin'
}

// Field-level access for super admin only
const superAdminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'super-admin'
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    group: 'Admin',
    description: 'Manage admin users and their permissions',
  },
  access: {
    // Only super admins can create new users
    create: isSuperAdmin,
    // Admins can read all users, editors can only read themselves
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin' || user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    // Super admins can update anyone, others can only update themselves (with restrictions)
    update: isSuperAdminOrSelf,
    // Only super admins can delete users
    delete: isSuperAdmin,
    // Only admins and above can unlock accounts
    unlock: isAdminOrAbove,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
      access: {
        // Only super admins can change roles
        update: superAdminFieldAccess,
      },
      admin: {
        description: 'Super Admin: Full access | Admin: Manage content | Editor: Create/edit content only',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Inactive users cannot log in',
      },
      access: {
        update: superAdminFieldAccess,
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Last login timestamp',
      },
    },
  ],
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        // Check if user is active
        if (!user.isActive) {
          throw new Error('Your account has been deactivated. Please contact the administrator.')
        }
        return user
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        // Update last login time
        try {
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: {
              lastLogin: new Date().toISOString(),
            },
          })
        } catch (e) {
          // Silent fail - don't block login
        }
        return user
      },
    ],
  },
}

