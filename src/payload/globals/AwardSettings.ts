import type { GlobalConfig } from 'payload'

export const AwardSettings: GlobalConfig = {
  slug: 'award-settings',
  label: 'Award setting',
  admin: {
    group: 'Global setting',
  },
  fields: [
    {
      name: 'awards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'year', type: 'number', required: true },
        { name: 'issuer', type: 'text' },
      ],
      defaultValue: [
        { title: 'Best Young Peacebuilding Organisation Award', year: 2023, issuer: 'WANEP' },
        { title: 'National Youth Development Award', year: 2025, issuer: 'Nigeria Youth Summit' },
      ],
    },
  ],
}
