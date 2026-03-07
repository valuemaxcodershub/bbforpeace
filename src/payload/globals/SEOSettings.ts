import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO',
  admin: {
    group: 'Global setting',
  },
  fields: [
    { name: 'metaTitle', type: 'text', defaultValue: 'BBFORPEACE - Building Blocks for Peace Foundation' },
    {
      name: 'metaDescription',
      type: 'textarea',
      defaultValue:
        'Youth-led peacebuilding NGO in Nigeria advocating for meaningful youth engagement in peace processes and sustainable development.',
    },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
