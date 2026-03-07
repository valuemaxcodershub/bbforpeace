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
            { name: 'blogHeading', type: 'text', defaultValue: 'Blog & Activities', label: 'Page Title' },
            { name: 'blogSubtitle', type: 'text', defaultValue: 'Latest News', label: 'Page Subtitle' },
            {
              name: 'blogDescription',
              type: 'textarea',
              label: 'Page Description',
              defaultValue:
                'Stay updated with the latest news, stories, and insights from our peacebuilding work across Nigeria.',
            },
            {
              name: 'blogBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: { description: 'Hero background image for the blog page' },
            },
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
            { name: 'pressHeading', type: 'text', defaultValue: 'Press Statements', label: 'Page Title' },
            { name: 'pressSubtitle', type: 'text', defaultValue: 'Media', label: 'Page Subtitle' },
            {
              name: 'pressDescription',
              type: 'textarea',
              label: 'Page Description',
              defaultValue:
                'Official announcements, press releases, and statements from Building Blocks for Peace Foundation.',
            },
            {
              name: 'pressBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: { description: 'Hero background image for the press page' },
            },
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
            { name: 'testimonialsTitle', type: 'text', defaultValue: 'Testimonials', label: 'Page Title' },
            { name: 'testimonialsSubtitle', type: 'text', defaultValue: 'Voices of Impact', label: 'Page Subtitle' },
            {
              name: 'testimonialsDescription',
              type: 'textarea',
              label: 'Page Description',
              defaultValue:
                'Hear from community members, partners, and youth leaders about the transformative impact of our peacebuilding work.',
            },
            {
              name: 'testimonialsBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: { description: 'Hero background image for the testimonials page' },
            },
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
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              admin: { description: 'Add testimonials from community members, partners, and beneficiaries' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text', required: true, label: 'Role / Title' },
                { name: 'quote', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Photo' },
                {
                  name: 'rating',
                  type: 'number',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                },
              ],
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
          label: 'Gallery Page Header',
          fields: [
            { name: 'galleryTitle', type: 'text', defaultValue: 'Gallery' },
            { name: 'gallerySubtitle', type: 'text', defaultValue: 'Media' },
            {
              name: 'galleryDescription',
              type: 'textarea',
              defaultValue: 'Capturing moments of impact, community engagement, and youth empowerment across Nigeria and West Africa.',
            },
            {
              name: 'galleryBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Hero background image for the gallery page' },
            },
            { name: 'photoTabTitle', type: 'text', defaultValue: 'Photos' },
            { name: 'videoTabTitle', type: 'text', defaultValue: 'Videos' },
            { name: 'youtubeChannelUrl', type: 'text', defaultValue: 'https://www.youtube.com/@bbforpeace' },
          ],
        },
        {
          label: 'Gallery Photos',
          fields: [
            {
              name: 'galleryImages',
              type: 'array',
              label: 'Gallery Photos',
              admin: { description: 'Upload photos for the gallery' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'title', type: 'text', required: true },
                {
                  name: 'category',
                  type: 'select',
                  defaultValue: 'Events',
                  options: [
                    { label: 'Events', value: 'Events' },
                    { label: 'Training', value: 'Training' },
                    { label: 'Community', value: 'Community' },
                    { label: 'Education', value: 'Education' },
                    { label: 'Advocacy', value: 'Advocacy' },
                    { label: 'Awards', value: 'Awards' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Gallery Videos',
          fields: [
            {
              name: 'galleryVideos',
              type: 'array',
              label: 'Gallery Videos',
              admin: { description: 'Add YouTube videos for the gallery' },
              fields: [
                { name: 'youtubeId', type: 'text', required: true, admin: { description: 'YouTube video ID (e.g., xvQ_AXIQbPM)' } },
                { name: 'title', type: 'text', required: true },
                {
                  name: 'category',
                  type: 'select',
                  defaultValue: 'Impact',
                  options: [
                    { label: 'Impact', value: 'Impact' },
                    { label: 'Programs', value: 'Programs' },
                    { label: 'Community', value: 'Community' },
                    { label: 'Events', value: 'Events' },
                    { label: 'Interviews', value: 'Interviews' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
