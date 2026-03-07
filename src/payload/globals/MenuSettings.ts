import type { GlobalConfig } from 'payload'

export const MenuSettings: GlobalConfig = {
  slug: 'menu-settings',
  label: 'Menu setting (content routing)',
  admin: {
    group: 'Global setting',
    description: 'Control top-level and submenu routing labels.',
  },
  fields: [
    {
      name: 'aboutUs',
      type: 'array',
      label: 'About us submenu',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
      ],
      defaultValue: [
        { title: 'who we are', slug: 'who-we-are' },
        { title: 'our strategy', slug: 'our-strategy' },
        { title: 'our team', slug: 'our-team' },
      ],
    },
    {
      name: 'media',
      type: 'array',
      label: 'Media submenu',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
      ],
      defaultValue: [
        { title: 'blog', slug: 'blog' },
        { title: 'press statement', slug: 'press-statement' },
        { title: 'gallery - photo', slug: 'gallery-photo' },
        { title: 'gallery - video', slug: 'gallery-video' },
        { title: 'testimonials', slug: 'testimonials' },
      ],
    },
    {
      name: 'report',
      type: 'array',
      label: 'Report submenu',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
      ],
      defaultValue: [
        { title: 'publications', slug: 'publications' },
        { title: 'annual report', slug: 'annual-report' },
        { title: 'project report', slug: 'project-report' },
        { title: 'strategic plan', slug: 'strategic-plan' },
      ],
    },
  ],
}
