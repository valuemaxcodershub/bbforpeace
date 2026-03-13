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
          label: 'Upcoming Events',
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
