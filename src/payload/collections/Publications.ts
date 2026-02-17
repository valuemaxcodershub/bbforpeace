import type { CollectionConfig } from 'payload'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'downloadCount'],
    description: 'Research papers, reports, and downloadable resources',
  },
  access: {
    read: () => true,
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
