import type { GlobalConfig } from 'payload'

export const AwardSettings: GlobalConfig = {
  slug: 'award-settings',
  label: 'Award setting',
  admin: {
    group: 'Global setting',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Awards & Achievements',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Our commitment to peacebuilding has been recognized by national and regional bodies.',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
    },
    {
      name: 'awards',
      type: 'array',
      label: 'Award Cards',
      minRows: 1,
      maxRows: 20,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'organization', type: 'text', required: true, label: 'Issuing Organization' },
        { name: 'year', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Award Image' },
      ],
      defaultValue: [
        { title: 'National Youth Development Award 2025', organization: 'Federal Ministry of Youth Development, Abuja', year: '2025', description: 'Recognized for outstanding contributions to youth empowerment and peacebuilding across Nigeria.' },
        { title: 'Best Young Peacebuilding Organisation 2023', organization: 'West Africa Network for Peacebuilding (WANEP-Nigeria)', year: '2023', description: 'Awarded for innovative approaches to conflict prevention and youth-led peace initiatives.' },
      ],
    },
  ],
}
