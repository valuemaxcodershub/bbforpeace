import type { GlobalConfig } from 'payload'

export const PartnersSettings: GlobalConfig = {
  slug: 'partners-settings',
  label: 'Partners settings',
  admin: {
    group: 'Global setting',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Partners',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
      defaultValue: [
        { name: 'GPPAC', description: 'Global Partnership for Prevention of Armed Conflict' },
        { name: 'WANEP', description: 'West Africa Network for Peacebuilding' },
        { name: 'British Council', description: 'Education & Cultural Relations' },
        { name: 'MacArthur Foundation', description: 'Funding Partner' },
        { name: 'Open Society Foundations', description: 'Civic Space Protection' },
        { name: 'Ford Foundation', description: 'Social Justice Funding' },
      ],
    },
  ],
}
