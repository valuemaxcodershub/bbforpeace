import type { GlobalConfig } from 'payload'

export const ReportsSettings: GlobalConfig = {
  slug: 'reports-settings',
  label: 'Reports',
  admin: {
    group: 'Reports',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Annual Reports Page',
          fields: [
            {
              name: 'annualSectionHeading',
              type: 'text',
              defaultValue: 'Impact & Accountability',
              label: 'Section Heading',
            },
            {
              name: 'annualSectionDescription',
              type: 'textarea',
              defaultValue: 'Download our comprehensive annual reports documenting our achievements, financial stewardship, and commitment to transparency.',
              label: 'Section Description',
            },
          ],
        },
      ],
    },
  ],
}
