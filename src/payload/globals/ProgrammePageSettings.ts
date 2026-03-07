import type { GlobalConfig } from 'payload'

export const ProgrammePageSettings: GlobalConfig = {
  slug: 'programme-page-settings',
  label: 'Programme page',
  admin: {
    group: 'Programme page',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Header',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Our Programmes' },
            { name: 'subtitle', type: 'text', defaultValue: 'Strategic Initiatives' },
            { name: 'description', type: 'textarea', defaultValue: 'Five interlinked impact areas guiding our work toward sustainable peace in Nigeria and West Africa.' },
            { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Overview',
          fields: [
            { name: 'overviewBadge', type: 'text', defaultValue: '2026 - 2030 Strategy' },
            { name: 'overviewHeading', type: 'text', defaultValue: 'Strategic Pillars' },
          ],
        },
        {
          label: 'CTA',
          fields: [
            { name: 'ctaBadge', type: 'text', defaultValue: 'Get Involved' },
            { name: 'ctaHeading', type: 'text', defaultValue: 'Support Our Programmes' },
            { name: 'ctaDescription', type: 'textarea', defaultValue: 'Your support helps us expand our reach and impact more communities. Join us as a partner, donor, or volunteer.' },
          ],
        },
      ],
    },
  ],
}
