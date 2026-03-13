import type { CollectionConfig, Access, FieldAccess } from 'payload'

// Access control helpers
const isSuperAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'super-admin'
}

const isSuperAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.role === 'super-admin') return true
  return String(user?.id) === String(id)
}

const isAdminOrAbove: Access = ({ req: { user } }) => {
  return user?.role === 'super-admin' || user?.role === 'admin'
}

// Super admin can only edit these fields on OTHER users, not on themselves.
// All other roles are completely blocked.
const superAdminOnlyOthers: FieldAccess = ({ req: { user }, id }) => {
  if (user?.role !== 'super-admin') return false
  // If editing themselves, block
  if (String(user?.id) === String(id)) return false
  return true
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 3600, // 1 hour - limits window if token is compromised
    maxLoginAttempts: 3, // Lock after 3 failed attempts
    lockTime: 900000, // 15 minutes lockout
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    group: 'user',
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
    // Override the built-in email field to lock it down
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      access: {
        // Super admin can change email of other users only, not their own
        update: superAdminOnlyOthers,
      },
      admin: {
        description: 'Super admin: contact developer to change. Others: contact super admin.',
      },
    },
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
        // Super admin can change role of other users only, not their own
        update: superAdminOnlyOthers,
      },
      admin: {
        description: 'Super admin: contact developer to change. Others: contact super admin.',
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
        update: superAdminOnlyOthers,
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
    beforeChange: [
      ({ req, data, operation, originalDoc }) => {
        // Block password changes: only super admin can change OTHER users' passwords
        if (operation === 'update' && data.password) {
          const user = req.user
          if (!user) return data
          const editingOwnRecord = String(user.id) === String(originalDoc?.id)

          if (user.role === 'super-admin' && editingOwnRecord) {
            // Super admin editing self — strip password change
            delete data.password
          } else if (user.role !== 'super-admin') {
            // Non-super-admin — strip password change
            delete data.password
          }
        }
        return data
      },
    ],
    afterLogin: [
      ({ req, user }) => {
        void req.payload
          .update({
            collection: 'users',
            id: user.id,
            data: {
              lastLogin: new Date().toISOString(),
            },
          })
          .catch(() => undefined)

        return user
      },
    ],
  },
}

