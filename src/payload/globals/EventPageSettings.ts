import type { GlobalConfig } from 'payload'

export const EventPageSettings: GlobalConfig = {
  slug: 'event-page-settings',
  label: 'Event page',
  admin: {
    group: 'Event page',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ─── Page Header ─── */
        {
          label: 'Page Header',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Events', label: 'Page Title' },
            { name: 'subtitle', type: 'text', defaultValue: 'Join Us', label: 'Page Subtitle' },
            { name: 'description', type: 'textarea', defaultValue: 'Join our workshops, conferences, and community events. Learn, connect, and contribute to building peace.', label: 'Page Description' },
            { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Background Image', admin: { description: 'Hero background image for the events page' } },
          ],
        },
        {
          label: 'Past Events',
          fields: [
            { name: 'pastHeading', type: 'text', defaultValue: 'Past Events' },
            {
              name: 'pastDescription',
              type: 'textarea',
              defaultValue:
                'Browse our event archive and highlights from previous conferences, summits, workshops, and community engagement sessions.',
            },
          ],
        },
        {
          label: 'Ongoing Event',
          fields: [
            { name: 'ongoingHeading', type: 'text', defaultValue: 'Ongoing Events' },
            {
              name: 'ongoingDescription',
              type: 'textarea',
              defaultValue:
                'Track activities currently running across our programmes, including training, dialogues, and regional collaboration events.',
            },
          ],
        },
        {
          label: 'Upcoming Evenet',
          fields: [
            { name: 'upcomingHeading', type: 'text', defaultValue: 'Upcoming Events' },
            {
              name: 'upcomingDescription',
              type: 'textarea',
              defaultValue:
                'Join our upcoming workshops, conferences, and community events to learn, connect, and contribute to building peace.',
            },
          ],
        },
      ],
    },
  ],
}
