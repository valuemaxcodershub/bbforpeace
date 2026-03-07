import type { GlobalConfig } from 'payload'

export const AboutUsPageSettings: GlobalConfig = {
  slug: 'about-us-page-settings',
  label: 'About us page',
  admin: {
    group: 'About us page',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ─── Page Header ─── */
        {
          label: 'Page header',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'About Us' },
            { name: 'subtitle', type: 'text', defaultValue: 'Who We Are' },
            { name: 'description', type: 'textarea', defaultValue: 'A youth-led organization bridging grassroots action, policy advocacy, and regional networking for sustainable peace.' },
            { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Background Image' },
          ],
        },
        /* ─── Our Story ─── */
        {
          label: 'Our Story',
          fields: [
            { name: 'storyParagraph1', type: 'textarea', label: 'Story Paragraph 1', defaultValue: 'Building Blocks for Peace (BBFORPEACE) Foundation is a non-governmental organization working on Conflict Prevention, Prevention of Violent Extremism, Peacebuilding and Sustainable Development in Nigeria.' },
            { name: 'storyParagraph2', type: 'textarea', label: 'Story Paragraph 2', defaultValue: 'Founded by Rafiu Adeniran Lawal, BBFORPEACE began with the Nigeria Youth 4 Peace Initiative in 2016 — a movement of young people dissatisfied with the increasing participation of youth in violent extremism and their exclusion from decision-making processes.' },
            { name: 'storyParagraph3', type: 'textarea', label: 'Story Paragraph 3', defaultValue: 'Through our Youth4Peace initiative, we have trained and empowered over 5,000 youth and children with support from several local and international stakeholders.' },
            {
              name: 'milestones', type: 'array', label: 'Timeline Milestones',
              fields: [
                { name: 'year', type: 'text', required: true },
                { name: 'event', type: 'text', required: true },
              ],
              defaultValue: [
                { year: '2016', event: 'Nigeria Youth 4 Peace Initiative founded' },
                { year: '2017', event: 'BBFORPEACE incorporated with Corporate Affairs Commission' },
                { year: '2020', event: 'Became GPPAC West Africa Regional Secretariat' },
                { year: '2023', event: 'Best Young Peacebuilding Organisation Award (WANEP)' },
                { year: '2024', event: 'WAYPAN Regional Network established' },
                { year: '2025', event: 'National Youth Development Award' },
              ],
            },
            { name: 'storyImage1', type: 'upload', relationTo: 'media', label: 'Story Image 1' },
            { name: 'storyImage2', type: 'upload', relationTo: 'media', label: 'Story Image 2' },
            { name: 'storyImage3', type: 'upload', relationTo: 'media', label: 'Story Image 3' },
            { name: 'storyImage4', type: 'upload', relationTo: 'media', label: 'Story Image 4' },
          ],
        },
        /* ─── Vision & Mission ─── */
        {
          label: 'Vision & Mission',
          fields: [
            { name: 'vision', type: 'textarea', defaultValue: 'A peaceful, just and inclusive Africa where youth, women and men lead resilient communities, accountable governance, and sustainable development.' },
            { name: 'mission', type: 'textarea', defaultValue: 'To equip youth, women and men as peacebuilders to prevent violent conflict, protect civic space, and promote sustainable peace through knowledge-sharing, policy advocacy, partnerships and programs.' },
          ],
        },
        /* ─── Core Values ─── */
        {
          label: 'Core Values',
          fields: [
            {
              name: 'coreValues', type: 'array', label: 'Core Values', maxRows: 10,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
                { name: 'icon', type: 'select', options: [
                  { label: 'Shield', value: 'Shield' }, { label: 'Users', value: 'Users' },
                  { label: 'Lightbulb', value: 'Lightbulb' }, { label: 'Handshake', value: 'Handshake' },
                  { label: 'Heart', value: 'Heart' }, { label: 'UserCheck', value: 'UserCheck' },
                ], defaultValue: 'Shield' },
              ],
              defaultValue: [
                { icon: 'Shield', title: 'Integrity & Accountability', description: 'Transparency in all our actions and decisions' },
                { icon: 'Users', title: 'Inclusivity & Gender Equality', description: 'Ensuring all voices are heard and represented' },
                { icon: 'Lightbulb', title: 'Innovation & Learning', description: 'Continuously improving our approaches' },
                { icon: 'Handshake', title: 'Collaboration & Solidarity', description: 'Working together for greater impact' },
                { icon: 'Heart', title: 'Non-Violence & Do No Harm', description: 'Peace in all our methods and actions' },
                { icon: 'UserCheck', title: 'Youth Leadership', description: 'Young people at the center of decision-making' },
              ],
            },
          ],
        },
        /* ─── Strategic Pillars ─── */
        {
          label: 'Strategic Pillars',
          fields: [
            { name: 'strategyPeriod', type: 'text', label: 'Period Label', defaultValue: '2026 - 2030' },
            {
              name: 'strategicPillars', type: 'array', label: 'Strategic Pillars', maxRows: 10,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'icon', type: 'select', options: [
                  { label: 'GraduationCap', value: 'GraduationCap' }, { label: 'Scale', value: 'Scale' },
                  { label: 'Leaf', value: 'Leaf' }, { label: 'Building2', value: 'Building2' },
                  { label: 'HeartHandshake', value: 'HeartHandshake' },
                ], defaultValue: 'GraduationCap' },
                { name: 'gradient', type: 'select', options: [
                  { label: 'Blue/Cyan', value: 'from-blue-500 to-cyan-400' },
                  { label: 'Emerald/Green', value: 'from-emerald-500 to-green-400' },
                  { label: 'Amber/Yellow', value: 'from-amber-500 to-yellow-400' },
                  { label: 'Violet/Purple', value: 'from-violet-500 to-purple-400' },
                  { label: 'Rose/Pink', value: 'from-rose-500 to-pink-400' },
                ], defaultValue: 'from-blue-500 to-cyan-400' },
              ],
              defaultValue: [
                { title: 'Peace Education & Youth Empowerment', icon: 'GraduationCap', gradient: 'from-blue-500 to-cyan-400' },
                { title: 'Conflict Prevention, Governance & Accountability', icon: 'Scale', gradient: 'from-emerald-500 to-green-400' },
                { title: 'Gender, Climate & Environmental Security', icon: 'Leaf', gradient: 'from-amber-500 to-yellow-400' },
                { title: 'Organizational Sustainability & Partnerships', icon: 'Building2', gradient: 'from-violet-500 to-purple-400' },
                { title: 'Livelihoods and Humanitarian', icon: 'HeartHandshake', gradient: 'from-rose-500 to-pink-400' },
              ],
            },
          ],
        },
        /* ─── Unique Positioning ─── */
        {
          label: 'Unique Positioning',
          fields: [
            { name: 'uniqueIntro', type: 'textarea', label: 'Introduction Text', defaultValue: "In Nigeria's peacebuilding ecosystem, BBFORPEACE occupies a unique niche as one of the few truly youth-led organizations operating from the grassroots to policy level." },
            {
              name: 'uniquePoints', type: 'array', label: 'Positioning Points', maxRows: 6,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
              ],
              defaultValue: [
                { title: 'Youth-Led & Grassroots-Informed', description: 'Co-founded and run by young peacebuilders with authenticity among youth constituencies.' },
                { title: 'Policy-Engaged', description: 'Contributing to YPS and WPS action plans across West Africa.' },
                { title: 'GPPAC Regional Secretariat', description: 'West Africa secretariat for Global Partnership for Prevention of Armed Conflict.' },
                { title: 'Global Youth Networks', description: 'Active in United Network of Young Peacebuilders.' },
              ],
            },
          ],
        },
        /* ─── Team & Board Headings ─── */
        {
          label: 'Team & Board',
          fields: [
            { name: 'teamHeading', type: 'text', defaultValue: 'Meet Our Team' },
            { name: 'teamDescription', type: 'textarea', defaultValue: 'Passionate young leaders dedicated to building peace and empowering communities.' },
            { name: 'boardHeading', type: 'text', defaultValue: 'Board of Trustees' },
            { name: 'boardDescription', type: 'textarea', defaultValue: 'Our distinguished board members provide strategic oversight and guidance for the organization.' },
          ],
        },
        /* ─── Awards ─── */
        {
          label: 'Awards',
          fields: [
            {
              name: 'aboutAwards', type: 'array', label: 'Awards',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'organization', type: 'text', required: true },
                { name: 'year', type: 'text', required: true },
              ],
              defaultValue: [
                { title: 'National Youth Development Award', organization: 'Federal Ministry of Youth Development, Abuja', year: '2025' },
                { title: 'Best Young Peacebuilding Organisation', organization: 'West Africa Network for Peacebuilding (WANEP-Nigeria)', year: '2023' },
              ],
            },
          ],
        },
        /* ─── Contact CTA ─── */
        {
          label: 'Contact CTA',
          fields: [
            { name: 'ctaHeading', type: 'text', defaultValue: 'Join Us in Building Peace' },
            { name: 'ctaDescription', type: 'textarea', defaultValue: 'Whether as a volunteer, partner, or supporter, there are many ways to contribute to our mission.' },
            { name: 'headOfficeAddress', type: 'text', defaultValue: '256, 1st Avenue, FHA, Lugbe' },
            { name: 'headOfficeCity', type: 'text', defaultValue: 'Abuja, Nigeria' },
            { name: 'headOfficePhone', type: 'text', defaultValue: '+234-8054151494' },
            { name: 'regionOfficeAddress', type: 'text', defaultValue: '35, Edward Ujege Street, High Level' },
            { name: 'regionOfficeCity', type: 'text', defaultValue: 'Makurdi, Benue State' },
            { name: 'regionOfficeEmail', type: 'text', defaultValue: 'info@bbforpeace.org' },
          ],
        },
      ],
    },
  ],
}
