import type { GlobalConfig } from 'payload'

export const ContactUsPageSettings: GlobalConfig = {
  slug: 'contact-us-page-settings',
  label: 'Contact us page',
  admin: {
    group: 'Contact us page',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Header',
          fields: [
            { name: 'headerTitle', type: 'text', defaultValue: 'Contact Us' },
            { name: 'headerSubtitle', type: 'text', defaultValue: 'Get in Touch' },
            {
              name: 'intro',
              type: 'textarea',
              defaultValue:
                "Have a question or want to collaborate? We'd love to hear from you. Reach out and let's build peace together.",
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Hero background image for the contact page' },
            },
          ],
        },
        {
          label: 'Office Details',
          fields: [
            { name: 'officeHours', type: 'text', defaultValue: 'Mon - Fri: 9:00 AM - 5:00 PM' },
            { name: 'website', type: 'text', defaultValue: 'bbforpeace.org' },
            {
              name: 'offices',
              type: 'array',
              label: 'Office Locations',
              admin: { description: 'Add your office locations' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'address', type: 'textarea', required: true },
                { name: 'phone', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Map Section',
          fields: [
            { name: 'mapHeading', type: 'text', defaultValue: 'Visit Our Office' },
            { name: 'mapAddress', type: 'text', defaultValue: '256, 1st Avenue, FHA, Lugbe, Abuja, Nigeria' },
            { name: 'mapLink', type: 'text', defaultValue: 'https://maps.google.com', admin: { description: 'Google Maps directions link' } },
            {
              name: 'mapBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Background image for the map/directions section' },
            },
          ],
        },
      ],
    },
  ],
}
