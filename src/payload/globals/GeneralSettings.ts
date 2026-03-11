import type { GlobalConfig } from 'payload'

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  label: 'General',
  admin: {
    group: 'Global setting',
  },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Building Blocks for Peace Foundation' },
    { name: 'siteTagline', type: 'text', defaultValue: 'Youth-led Peacebuilding NGO in Nigeria' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'logoAlt', type: 'text', defaultValue: 'Building Blocks for Peace Foundation logo' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
  ],
}
