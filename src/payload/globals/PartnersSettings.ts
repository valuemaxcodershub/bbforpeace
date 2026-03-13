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
  ],
}
