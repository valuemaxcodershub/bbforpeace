import type { CollectionConfig, Access } from 'payload'

// Access control: Admins and above can manage content
const isAdminOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin' || user.role === 'editor'
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt', 'author'],
    description: 'Blog posts and activity reports',
    group: 'Media Page',
  },
  access: {
    read: () => true, // Public can read published posts
    create: isAdminOrAbove,
    update: isAdminOrAbove,
    delete: isAdminOrAbove,
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'mediaGallery',
      type: 'array',
      label: 'Media Gallery',
      admin: {
        description: 'Add images or YouTube videos to this post',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'YouTube Video', value: 'youtube' },
          ],
          defaultValue: 'image',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'image',
          },
        },
        {
          name: 'youtubeId',
          type: 'text',
          label: 'YouTube Video ID',
          admin: {
            description: 'The ID from the YouTube URL (e.g., dQw4w9WgXcQ)',
            condition: (data, siblingData) => siblingData?.type === 'youtube',
          },
        },
        {
          name: 'youtubeTitle',
          type: 'text',
          label: 'Video Title',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'youtube',
          },
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for this media item',
          },
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
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
      defaultValue: 'media',
      options: [
        { label: 'About Us', value: 'about-us' },
        { label: 'Media', value: 'media' },
        { label: 'Report', value: 'report' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Top-level website menu where this content belongs.',
      },
    },
    {
      name: 'subMenu',
      type: 'select',
      label: 'Submenu Destination',
      required: true,
      defaultValue: 'blog',
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
        description: 'Specific submenu destination for display/routing.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
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
