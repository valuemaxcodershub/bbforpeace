import type { GlobalConfig } from 'payload'

export const SocialMediaSettings: GlobalConfig = {
  slug: 'social-media-settings',
  label: 'Social Media settings',
  admin: {
    group: 'Global setting',
  },
  fields: [
    { name: 'facebook', type: 'text', defaultValue: 'https://web.facebook.com/bbforpeace' },
    { name: 'twitter', type: 'text', defaultValue: 'https://twitter.com/bbforpeace' },
    { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/bbforpeace/' },
    { name: 'youtube', type: 'text', defaultValue: 'https://www.youtube.com/channel/UC10Im94vib-oh7AvVhZNPIg' },
    { name: 'linkedin', type: 'text', defaultValue: '' },
  ],
}
