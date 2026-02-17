import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'Building Blocks for Peace Foundation',
            },
            {
              name: 'siteTagline',
              type: 'text',
              defaultValue: 'Youth-led Peacebuilding NGO in Nigeria',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'logoAlt',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (Alternative/Light version)',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
              defaultValue: 'info@bbforpeace.org',
            },
            {
              name: 'phone',
              type: 'text',
              defaultValue: '+234-8054151494',
            },
            {
              name: 'phoneAlt',
              type: 'text',
              defaultValue: '+234-8036473893',
            },
            {
              name: 'address',
              type: 'textarea',
              defaultValue: '256, 1st Avenue, Federal Housing Authority (FHA), Lugbe, Abuja, Nigeria',
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                  defaultValue: 'https://web.facebook.com/bbforpeace',
                },
                {
                  name: 'twitter',
                  type: 'text',
                  defaultValue: 'https://twitter.com/bbforpeace',
                },
                {
                  name: 'instagram',
                  type: 'text',
                  defaultValue: 'https://www.instagram.com/bbforpeace/',
                },
                {
                  name: 'youtube',
                  type: 'text',
                  defaultValue: 'https://www.youtube.com/channel/UC10Im94vib-oh7AvVhZNPIg',
                },
                {
                  name: 'linkedin',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              defaultValue: 'Building Blocks for Peace',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              defaultValue: 'Empowering Nigerian youth to drive peacebuilding and advocate for meaningful youth engagement in the peace process.',
            },
            {
              name: 'impactStats',
              type: 'array',
              label: 'Impact Statistics',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'suffix',
                  type: 'text',
                  admin: {
                    description: 'e.g., "+", "K", etc.',
                  },
                },
              ],
              defaultValue: [
                { label: 'Youth Reached', value: '5000', suffix: '+' },
                { label: 'Programs', value: '20', suffix: '+' },
                { label: 'States Covered', value: '15', suffix: '' },
                { label: 'Publications', value: '30', suffix: '+' },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'aboutShort',
              type: 'richText',
              label: 'Short About (for homepage)',
            },
            {
              name: 'mission',
              type: 'textarea',
            },
            {
              name: 'vision',
              type: 'textarea',
            },
            {
              name: 'coreValues',
              type: 'array',
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerText',
              type: 'textarea',
              defaultValue: 'Building Blocks for Peace Foundation (BBFORPEACE) is a youth-led peacebuilding NGO advocating for the meaningful and effective engagement of youth in peacebuilding processes in Nigeria.',
            },
            {
              name: 'copyrightText',
              type: 'text',
              defaultValue: '© 2026 Building Blocks for Peace Foundation. All Rights Reserved.',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  defaultValue: 'BB4Peace - Building Blocks for Peace Foundation',
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  defaultValue: 'Youth-led peacebuilding NGO in Nigeria advocating for meaningful youth engagement in peace processes and sustainable development.',
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Default Social Share Image',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
