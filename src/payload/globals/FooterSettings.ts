import type { GlobalConfig } from 'payload'

export const FooterSettings: GlobalConfig = {
  slug: 'footer-settings',
  label: 'Footer setting',
  admin: {
    group: 'Global setting',
  },
  fields: [
    {
      name: 'footerText',
      type: 'textarea',
      defaultValue:
        'Building Blocks for Peace Foundation (BBFORPEACE) is a youth-led peacebuilding NGO advocating for meaningful youth engagement in peacebuilding processes in Nigeria.',
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© 2026 Building Blocks for Peace Foundation. All Rights Reserved.',
    },
    {
      name: 'quickLinksTitle',
      type: 'text',
      defaultValue: 'Quick Links',
    },
    {
      name: 'programmesTitle',
      type: 'text',
      defaultValue: 'Programmes',
    },
    {
      name: 'contactTitle',
      type: 'text',
      defaultValue: 'Contact',
    },
    {
      name: 'privacyLabel',
      type: 'text',
      defaultValue: 'Privacy Policy',
    },
    {
      name: 'termsLabel',
      type: 'text',
      defaultValue: 'Terms of Service',
    },
  ],
}
