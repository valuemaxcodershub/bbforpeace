import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO',
  admin: {
    group: 'Global setting',
  },
  fields: [
    // ── General Meta ──
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Default Site Title',
      defaultValue: 'Building Blocks for Peace Foundation | Empowering Communities for Peace',
      admin: { description: 'The default <title> for pages that don\'t set their own.' },
    },
    {
      name: 'titleTemplate',
      type: 'text',
      label: 'Title Template',
      defaultValue: '%s | BB4Peace',
      admin: { description: 'Template for page titles. Use %s as placeholder for the page title.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Default Meta Description',
      defaultValue:
        'Empowering Communities for Peace — Building Blocks for Peace Foundation is a youth-led peacebuilding NGO in Nigeria, working to create sustainable peace through education, dialogue, and community engagement.',
      admin: { description: 'Default description for search engines (150–160 characters recommended).' },
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Meta Keywords',
      defaultValue:
        'peacebuilding, youth empowerment, Nigeria NGO, conflict resolution, peace education, community development, BB4Peace, Building Blocks for Peace',
      admin: { description: 'Comma-separated keywords for search engines.' },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Canonical Base URL',
      defaultValue: 'https://bbforpeace.org',
      admin: { description: 'The canonical base URL for your site.' },
    },

    // ── Open Graph (Facebook, LinkedIn, WhatsApp) ──
    {
      name: 'og',
      type: 'group',
      label: 'Open Graph (Social Sharing)',
      admin: { description: 'Controls how your site appears when shared on Facebook, LinkedIn, WhatsApp, etc.' },
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Site Name',
          defaultValue: 'Building Blocks for Peace Foundation',
        },
        {
          name: 'title',
          type: 'text',
          label: 'OG Title',
          defaultValue: 'Building Blocks for Peace Foundation | Youth-Led Peacebuilding NGO',
          admin: { description: 'Title shown when page is shared on social media.' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'OG Description',
          defaultValue:
            'Youth-led peacebuilding NGO in Nigeria, working to create sustainable peace through education, dialogue, and community engagement.',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image',
          admin: { description: 'Default image for social shares (recommended: 1200×630px).' },
        },
        {
          name: 'locale',
          type: 'text',
          label: 'Locale',
          defaultValue: 'en_NG',
        },
      ],
    },

    // ── Twitter Card ──
    {
      name: 'twitter',
      type: 'group',
      label: 'Twitter / X Card',
      admin: { description: 'Controls how your site appears when shared on Twitter/X.' },
      fields: [
        {
          name: 'card',
          type: 'select',
          label: 'Card Type',
          defaultValue: 'summary_large_image',
          options: [
            { value: 'summary', label: 'Summary' },
            { value: 'summary_large_image', label: 'Summary with Large Image' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Twitter Title',
          defaultValue: 'Building Blocks for Peace Foundation',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Twitter Description',
          defaultValue: 'Youth-led peacebuilding NGO in Nigeria',
        },
        {
          name: 'handle',
          type: 'text',
          label: 'Twitter Handle',
          defaultValue: '@bbforpeace',
          admin: { description: 'Your Twitter/X handle (e.g., @bbforpeace).' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Twitter Image',
          admin: { description: 'Falls back to OG image if not set.' },
        },
      ],
    },

    // ── Robots / Indexing ──
    {
      name: 'robots',
      type: 'group',
      label: 'Search Engine Robots',
      admin: { description: 'Controls how search engines crawl and index your site.' },
      fields: [
        {
          name: 'index',
          type: 'checkbox',
          label: 'Allow Indexing',
          defaultValue: true,
          admin: { description: 'Allow search engines to index your pages.' },
        },
        {
          name: 'follow',
          type: 'checkbox',
          label: 'Allow Following Links',
          defaultValue: true,
          admin: { description: 'Allow search engines to follow links on your pages.' },
        },
      ],
    },

    // ── Verification & Extra ──
    {
      name: 'verification',
      type: 'group',
      label: 'Site Verification',
      fields: [
        {
          name: 'google',
          type: 'text',
          label: 'Google Site Verification',
          admin: { description: 'Google Search Console verification code.' },
        },
        {
          name: 'bing',
          type: 'text',
          label: 'Bing Webmaster Verification',
          admin: { description: 'Bing Webmaster verification code.' },
        },
      ],
    },

    // ── Keep legacy field for backward compat ──
    { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { hidden: true } },
  ],
}
