import type { GlobalConfig } from 'payload'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'contact',
  admin: {
    group: 'Global setting',
  },
  fields: [
    { name: 'contactEmail', type: 'email', defaultValue: 'info@bbforpeace.org' },
    { name: 'phone', type: 'text', defaultValue: '+234-8054151494' },
    { name: 'phoneAlt', type: 'text', defaultValue: '+234-8036473893' },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: '256, 1st Avenue, Federal Housing Authority (FHA), Lugbe, Abuja, Nigeria',
    },
  ],
}
