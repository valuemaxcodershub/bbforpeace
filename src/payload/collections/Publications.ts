import type { CollectionConfig, Access } from 'payload'

// Access control: Admins and above can manage content
const isAdminOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin' || user.role === 'editor'
}

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'downloadCount'],
    description: 'Research papers, reports, and downloadable resources',
    group: 'Reports',
    components: {
      beforeListTable: ['@/components/admin/PublicationsListHeader'],
    },
  },
  access: {
    read: () => true, // Public can read publications
    create: isAdminOrAbove,
    update: isAdminOrAbove,
    delete: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin',
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'PDF File',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Research Paper', value: 'research' },
        { label: 'Report', value: 'report' },
        { label: 'Policy Brief', value: 'policy-brief' },
        { label: 'Factsheet', value: 'factsheet' },
        { label: 'Manual', value: 'manual' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'menuSection',
      type: 'select',
      label: 'Menu Section',
      required: true,
      defaultValue: 'report',
      options: [
        { label: 'Report', value: 'report' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subMenu',
      type: 'select',
      label: 'Report Submenu',
      required: true,
      defaultValue: 'publication',
      options: [
        { label: 'Publication', value: 'publication' },
        { label: 'Annual Report', value: 'annual-report' },
        { label: 'Project Report', value: 'project-report' },
        { label: 'Strategic Plan', value: 'strategic-plan' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Submenu destination under Report.',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 2010,
      max: 2030,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'region',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.subMenu === 'project-report',
      },
    },
    {
      name: 'pages',
      type: 'number',
      min: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.subMenu === 'project-report',
      },
    },
    {
      name: 'accentColor',
      type: 'select',
      defaultValue: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Emerald', value: 'emerald' },
        { label: 'Purple', value: 'purple' },
        { label: 'Amber', value: 'amber' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.subMenu === 'project-report',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
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
