import type { CollectionConfig, Access } from 'payload'

// Access control: Only super admin and admin can manage pages
const isAdminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin'
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Static pages (About, Contact, etc.)',
    group: 'Pages',
  },
  access: {
    read: () => true, // Public can read pages
    create: isAdminOnly,
    update: isAdminOnly,
    delete: ({ req: { user } }) => user?.role === 'super-admin',
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
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'template',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Full Width', value: 'full-width' },
        { label: 'Sidebar', value: 'sidebar' },
      ],
      defaultValue: 'default',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'menuSection',
      type: 'select',
      label: 'Menu Section',
      required: true,
      defaultValue: 'about-us',
      options: [
        { label: 'About Us', value: 'about-us' },
        { label: 'Media', value: 'media' },
        { label: 'Report', value: 'report' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subMenu',
      type: 'select',
      label: 'Submenu Destination',
      required: true,
      defaultValue: 'who-we-are',
      options: [
        { label: 'Who We Are', value: 'who-we-are' },
        { label: 'Our Strategy', value: 'our-strategy' },
        { label: 'Our Team', value: 'our-team' },
        { label: 'Blog', value: 'blog' },
        { label: 'Press Statement', value: 'press-statement' },
        { label: 'Gallery - Photo', value: 'gallery-photo' },
        { label: 'Gallery - Video', value: 'gallery-video' },
        { label: 'Publication', value: 'publication' },
        { label: 'Annual Report', value: 'annual-report' },
        { label: 'Project Report', value: 'project-report' },
        { label: 'Strategic Plan', value: 'strategic-plan' },
      ],
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
