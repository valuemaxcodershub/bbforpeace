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
          label: 'Publications Page',
          fields: [
            { name: 'publicationsTitle', type: 'text', defaultValue: 'Publications', label: 'Page Title' },
            { name: 'publicationsSubtitle', type: 'text', defaultValue: 'Knowledge Hub', label: 'Page Subtitle' },
            {
              name: 'publicationsDescription',
              type: 'textarea',
              label: 'Page Description',
              defaultValue:
                'Access our research papers, policy briefs, reports, and educational resources on peacebuilding and conflict resolution.',
            },
            {
              name: 'publicationsBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: { description: 'Hero background image for the publications page' },
            },
            { name: 'publicationsHeading', type: 'text', defaultValue: 'Publications', label: 'Admin Heading (internal)' },
          ],
        },
        {
          label: 'Annual Reports Page',
          fields: [
            { name: 'annualTitle', type: 'text', defaultValue: 'Annual Reports', label: 'Page Title' },
            { name: 'annualSubtitle', type: 'text', defaultValue: 'Transparency & Accountability', label: 'Page Subtitle' },
            {
              name: 'annualDescription',
              type: 'textarea',
              label: 'Page Description',
              defaultValue:
                'Comprehensive documentation of our journey, impact, and commitment to transforming communities through youth-led peacebuilding.',
            },
            {
              name: 'annualBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: { description: 'Hero background image for the annual reports page' },
            },
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
            {
              name: 'annualReports',
              type: 'array',
              label: 'Legacy Annual Reports (fallback)',
              admin: { description: 'Only used if no annual reports exist in Publications collection' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'year', type: 'number', required: true },
                { name: 'fileUrl', type: 'text', required: true },
              ],
              defaultValue: [
                { title: 'BBFORPEACE Annual Report 2025', year: 2025, fileUrl: '/documents/BBFORPEACE ANNUAL REPORT 2025.pdf' },
                { title: 'BBFORPEACE Annual Report 2024', year: 2024, fileUrl: '/documents/BBFORPEACE ANNUAL REPORT 2024.pdf' },
              ],
            },
          ],
        },
        {
          label: 'Project Reports Page',
          fields: [
            { name: 'projectTitle', type: 'text', defaultValue: 'Project Reports', label: 'Page Title' },
            { name: 'projectSubtitle', type: 'text', defaultValue: 'Documentation & Research', label: 'Page Subtitle' },
            {
              name: 'projectDescription',
              type: 'textarea',
              label: 'Page Description',
              defaultValue:
                'Access comprehensive documentation from our peacebuilding programs, research initiatives, and regional interventions across West Africa.',
            },
            {
              name: 'projectBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: { description: 'Hero background image for the project reports page' },
            },
            { name: 'projectHeading', type: 'text', defaultValue: 'Project Reports', label: 'Admin Heading (internal)' },
          ],
        },
        {
          label: 'Strategic Plan Page',
          fields: [
            { name: 'strategicTitle', type: 'text', defaultValue: 'Strategic Plan', label: 'Page Title' },
            { name: 'strategicSubtitle', type: 'text', defaultValue: '2026 - 2030', label: 'Page Subtitle' },
            {
              name: 'strategicDescription',
              type: 'textarea',
              label: 'Page Description',
              defaultValue:
                'A practical roadmap for building resilient, peaceful and inclusive communities across Africa.',
            },
            {
              name: 'strategicBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: { description: 'Hero background image for the strategic plan page' },
            },
            {
              name: 'strategicCoverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Image',
              admin: { description: 'Image displayed alongside the strategic plan content' },
            },
            { name: 'strategicPeriod', type: 'text', defaultValue: '2026-2030', label: 'Period Badge' },
            { name: 'strategicPublishedDate', type: 'text', defaultValue: 'Published March, 2026', label: 'Published Date Label' },
            { name: 'strategicContentHeading', type: 'text', defaultValue: 'Building Peace Through Systems Change', label: 'Content Heading' },
            {
              name: 'strategicContentDescription',
              type: 'textarea',
              defaultValue: 'Our strategic plan sets clear priorities, outcomes and partnership pathways to deepen local peace architectures, elevate youth and women leadership, and improve policy responsiveness at national and regional levels.',
              label: 'Content Description',
            },
            {
              name: 'strategicPillars',
              type: 'array',
              label: 'Strategic Pillars',
              fields: [
                { name: 'title', type: 'text', required: true },
              ],
              defaultValue: [
                { title: 'Peace Education & Youth Empowerment' },
                { title: 'Conflict Prevention, Governance & Accountability' },
                { title: 'Gender, Climate & Environmental Security' },
                { title: 'Organizational Sustainability & Partnerships' },
                { title: 'Livelihoods and Humanitarian' },
              ],
            },
            { name: 'strategicCtaHeading', type: 'text', defaultValue: 'Need a detailed presentation of this strategic plan?', label: 'CTA Heading' },
            { name: 'strategicCtaDescription', type: 'textarea', defaultValue: 'Contact us for institutional partnerships, implementation support, and co-creation opportunities.', label: 'CTA Description' },
          ],
        },
      ],
    },
  ],
}
