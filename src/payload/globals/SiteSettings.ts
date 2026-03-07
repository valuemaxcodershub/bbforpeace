import type { GlobalConfig, Access } from 'payload'

// Only super admin and admin can update site settings
const isAdminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin'
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Global setting',
    hidden: true,
  },
  access: {
    read: () => true, // Public can read settings
    update: isAdminOnly, // Only admins can update
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
          label: 'Hero Section',
          description: 'Configure the homepage hero slider and typewriter text',
          fields: [
            {
              name: 'heroSlogan',
              type: 'text',
              label: 'Hero Slogan',
              defaultValue: 'Empowering Communities for Peace',
              admin: {
                description: 'Small text shown above the main title',
              },
            },
            {
              name: 'heroMainTitle',
              type: 'text',
              label: 'Main Title',
              defaultValue: 'Building Blocks for Peace',
              admin: {
                description: 'The large headline text',
              },
            },
            {
              name: 'heroSlides',
              type: 'array',
              label: 'Hero Slides',
              minRows: 1,
              maxRows: 10,
              admin: {
                description: 'Add background images and descriptions for the hero slider',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  maxLength: 200,
                  admin: {
                    description: 'Brief description shown on this slide',
                  },
                },
              ],
              defaultValue: [
                { description: 'Bridging grassroots action, policy advocacy, and regional networking for sustainable peace.' },
                { description: 'Equipping young people as active agents through capacity building and mentorship.' },
                { description: 'Connecting peacebuilders across West Africa through regional platforms.' },
                { description: 'Training over 5,000 youth as peace champions in dialogue and engagement.' },
                { description: 'Recognized for outstanding contributions to youth empowerment.' },
              ],
            },
            {
              name: 'typewriterPhrases',
              type: 'array',
              label: 'Typewriter Phrases',
              minRows: 1,
              admin: {
                description: 'Phrases that appear with typewriter effect: "We [phrase]"',
              },
              fields: [
                {
                  name: 'phrase',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g., build peaceful communities.',
                  },
                },
              ],
              defaultValue: [
                { phrase: 'build peaceful communities.' },
                { phrase: 'empower youth for change.' },
                { phrase: 'prevent violent conflicts.' },
                { phrase: 'foster dialogue & healing.' },
                { phrase: 'champion policy reforms.' },
              ],
            },
            {
              name: 'heroCta',
              type: 'group',
              label: 'Call to Action Buttons',
              fields: [
                {
                  name: 'primaryText',
                  type: 'text',
                  defaultValue: 'Explore Our Work',
                },
                {
                  name: 'primaryLink',
                  type: 'text',
                  defaultValue: '/programmes',
                },
                {
                  name: 'secondaryText',
                  type: 'text',
                  defaultValue: 'Get Involved',
                },
                {
                  name: 'secondaryLink',
                  type: 'text',
                  defaultValue: '/contact',
                },
              ],
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
          description: 'Configure homepage content sections',
          fields: [
            {
              name: 'impactStats',
              type: 'array',
              label: 'Impact Statistics',
              admin: {
                description: 'Statistics displayed on the homepage',
              },
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
            {
              name: 'featuredVideo',
              type: 'group',
              label: 'Featured Video',
              admin: {
                description: 'YouTube video displayed on homepage',
              },
              fields: [
                {
                  name: 'youtubeId',
                  type: 'text',
                  label: 'YouTube Video ID',
                  admin: {
                    description: 'The ID from the YouTube URL (e.g., xvQ_AXIQbPM)',
                  },
                  defaultValue: 'xvQ_AXIQbPM',
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'West Africa Peace and Security Dialogue',
                },
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Custom Thumbnail (optional)',
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          description: 'About page and preview content',
          fields: [
            {
              name: 'aboutTitle',
              type: 'text',
              label: 'About Section Title',
              defaultValue: 'Why BBFORPEACE?',
            },
            {
              name: 'aboutDescription',
              type: 'richText',
              label: 'About Description',
              admin: {
                description: 'Main about section content',
              },
            },
            {
              name: 'aboutHighlights',
              type: 'array',
              label: 'About Highlights',
              admin: {
                description: 'Key focus areas shown as bullet points',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
              defaultValue: [
                { text: 'Youth, Women, Peace and Security' },
                { text: 'Conflict Prevention & Governance' },
                { text: 'Peace Education & Empowerment' },
                { text: 'Climate & Environmental Security' },
              ],
            },
            {
              name: 'aboutVideo',
              type: 'group',
              label: 'About Video',
              fields: [
                {
                  name: 'youtubeId',
                  type: 'text',
                  label: 'YouTube Video ID',
                  defaultValue: 'xvQ_AXIQbPM',
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'West Africa Peace and Security Dialogue',
                },
              ],
            },
            {
              name: 'aboutImages',
              type: 'group',
              label: 'About Section Images',
              fields: [
                {
                  name: 'mainImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Main Image',
                },
                {
                  name: 'secondaryImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Secondary Image (small overlay)',
                },
              ],
            },
            {
              name: 'yearsOfImpact',
              type: 'text',
              label: 'Years of Impact',
              defaultValue: '8+',
              admin: {
                description: 'Displayed in the stats card',
              },
            },
            {
              name: 'mission',
              type: 'textarea',
              defaultValue: 'To equip youth, women and men as peacebuilders to prevent violent conflict and promote sustainable peace.',
            },
            {
              name: 'vision',
              type: 'textarea',
              defaultValue: 'A peaceful, just and inclusive Africa where youth, women and men lead resilient communities.',
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
                  defaultValue: 'BBFORPEACE - Building Blocks for Peace Foundation',
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
        {
          label: 'Content Routing',
          description: 'Define submenu structure and placeholders used by admin content routing.',
          fields: [
            {
              name: 'menuStructure',
              type: 'group',
              fields: [
                {
                  name: 'aboutUsSubmenu',
                  type: 'array',
                  label: 'About Us Submenu',
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'slug', type: 'text', required: true },
                  ],
                  defaultValue: [
                    { title: 'Who We Are', slug: 'who-we-are' },
                    { title: 'Our Strategy', slug: 'our-strategy' },
                    { title: 'Our Team', slug: 'our-team' },
                  ],
                },
                {
                  name: 'mediaSubmenu',
                  type: 'array',
                  label: 'Media Submenu',
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'slug', type: 'text', required: true },
                  ],
                  defaultValue: [
                    { title: 'Blog', slug: 'blog' },
                    { title: 'Press Statement', slug: 'press-statement' },
                    { title: 'Gallery - Photo', slug: 'gallery-photo' },
                    { title: 'Gallery - Video', slug: 'gallery-video' },
                  ],
                },
                {
                  name: 'reportSubmenu',
                  type: 'array',
                  label: 'Report Submenu',
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'slug', type: 'text', required: true },
                  ],
                  defaultValue: [
                    { title: 'Publication', slug: 'publication' },
                    { title: 'Annual Report', slug: 'annual-report' },
                    { title: 'Project Report', slug: 'project-report' },
                    { title: 'Strategic Plan', slug: 'strategic-plan' },
                  ],
                },
              ],
            },
            {
              name: 'annualReportPlaceholders',
              type: 'array',
              label: 'Annual Report Placeholders',
              admin: {
                description: 'Existing annual reports as editable placeholders in admin.',
              },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'year', type: 'number', required: true },
                { name: 'fileUrl', type: 'text', required: true },
              ],
              defaultValue: [
                {
                  title: 'BBFORPEACE Annual Report 2024',
                  year: 2024,
                  fileUrl: '/documents/BBFORPEACE ANNUAL REPORT 2024.pdf',
                },
                {
                  title: 'BBFORPEACE Annual Report 2025',
                  year: 2025,
                  fileUrl: '/documents/BBFORPEACE ANNUAL REPORT 2025.pdf',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
