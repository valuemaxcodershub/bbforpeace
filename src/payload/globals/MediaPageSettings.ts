import type { GlobalConfig } from 'payload'

export const MediaPageSettings: GlobalConfig = {
  slug: 'media-page-settings',
  label: 'Media Page',
  admin: {
    group: 'Media Page',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Blog Page',
          fields: [
            {
              name: 'blogNote',
              type: 'textarea',
              label: 'Admin Note',
              defaultValue:
                'Use Posts to create articles and Categories/Tags to structure them.',
              admin: { description: 'Internal note for editors (not shown on frontend)' },
            },
          ],
        },
        {
          label: 'Press Page',
          fields: [
            {
              name: 'pressNote',
              type: 'textarea',
              label: 'Admin Note',
              defaultValue:
                'Create press entries via Posts and set the submenu to "Press Statement".',
              admin: { description: 'Internal note for editors (not shown on frontend)' },
            },
          ],
        },
        {
          label: 'Testimonials Page',
          fields: [
            {
              name: 'testimonialsSectionHeading',
              type: 'text',
              defaultValue: 'Stories of Transformation',
              label: 'Section Heading',
            },
            {
              name: 'testimonialsSectionDescription',
              type: 'textarea',
              defaultValue: 'Every voice tells a story of hope, change, and the power of youth-led peacebuilding.',
              label: 'Section Description',
            },
            {
              name: 'testimonialsCtaHeading',
              type: 'text',
              defaultValue: 'Have a Story to Tell?',
              label: 'CTA Heading',
            },
            {
              name: 'testimonialsCtaDescription',
              type: 'textarea',
              defaultValue: 'If our work has impacted your life or community, we\'d love to hear from you. Share your experience and inspire others to join the movement for peace.',
              label: 'CTA Description',
            },
            {
              name: 'testimonialsCtaButtonText',
              type: 'text',
              defaultValue: 'Share Your Testimonial',
              label: 'CTA Button Text',
            },
          ],
        },
        {
          label: 'Gallery Page',
          fields: [
            { name: 'photoTabTitle', type: 'text', defaultValue: 'Photos' },
            { name: 'videoTabTitle', type: 'text', defaultValue: 'Videos' },
            { name: 'youtubeChannelUrl', type: 'text', defaultValue: 'https://www.youtube.com/@bbforpeace' },
          ],
        },
      ],
    },
  ],
}
