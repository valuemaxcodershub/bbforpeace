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
      name: 'subheading',
      type: 'text',
      defaultValue: 'Working Together for Peace',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'We collaborate with international organizations, foundations, and networks to amplify our impact across communities.',
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Want to partner with us?',
    },
    {
      name: 'ctaLinkLabel',
      type: 'text',
      defaultValue: 'Become a Partner',
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
