import type { GlobalConfig } from 'payload'

export const HomePageSettings: GlobalConfig = {
  slug: 'home-page-settings',
  label: 'Home page',
  admin: {
    group: 'Home page',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ───────────────────── HERO ───────────────────── */
        {
          label: 'Hero section',
          fields: [
            { name: 'heroMainTitle', type: 'text', label: 'Main Title', defaultValue: 'Building Blocks for Peace', admin: { description: 'The large headline text' } },
            {
              name: 'heroSlides', type: 'array', label: 'Hero Slides (Background Images)', maxRows: 15,
              admin: { description: 'Background images and descriptions for the hero slider' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'description', type: 'textarea', required: true, maxLength: 200, admin: { description: 'Brief text shown on this slide' } },
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
              name: 'typewriterPhrases', type: 'array', label: 'Typewriter Phrases', minRows: 1,
              admin: { description: 'Phrases after "We" with typewriter effect. Add as many as you want.' },
              fields: [{ name: 'phrase', type: 'text', required: true, admin: { placeholder: 'e.g., build peaceful communities.' } }],
              defaultValue: [
                { phrase: 'build peaceful communities.' },
                { phrase: 'empower youth for change.' },
                { phrase: 'prevent violent conflicts.' },
                { phrase: 'foster dialogue & healing.' },
                { phrase: 'champion policy reforms.' },
              ],
            },
            {
              name: 'heroCta', type: 'group', label: 'Call to Action Buttons',
              fields: [
                { name: 'primaryText', type: 'text', label: 'Primary Button Text', defaultValue: 'Explore Our Work' },
                { name: 'primaryLink', type: 'text', label: 'Primary Button Link', defaultValue: '/programmes' },
                { name: 'secondaryText', type: 'text', label: 'Secondary Button Text', defaultValue: 'Get Involved' },
                { name: 'secondaryLink', type: 'text', label: 'Secondary Button Link', defaultValue: '/contact' },
              ],
            },
          ],
        },

        /* ───────────────── IMPACT STATS ───────────────── */
        {
          label: 'Impact section',
          fields: [
            { name: 'impactBadge', type: 'text', label: 'Badge Text', defaultValue: 'Our Presence', admin: { description: 'Small label above the heading (e.g. "Our Presence")' } },
            { name: 'impactHeading', type: 'text', label: 'Heading', defaultValue: 'Creating Lasting Impact', admin: { description: 'Main heading e.g. "Creating Lasting Impact"' } },
            { name: 'impactDescription', type: 'textarea', label: 'Description', defaultValue: 'Since 2017, BBFORPEACE has been at the forefront of youth-led peacebuilding in Nigeria, transforming communities through dialogue, education, and grassroots engagement. Our work has reached thousands directly and continues to create ripple effects across the nation.' },
            { name: 'impactImage', type: 'upload', relationTo: 'media', label: 'Background Image', admin: { description: 'Background image for the impact section' } },
            {
              name: 'impactHighlights', type: 'array', label: 'Highlight Badges', maxRows: 5,
              admin: { description: 'Small badge items below description (e.g. "Recognized by national bodies")' },
              fields: [{ name: 'text', type: 'text', required: true }],
              defaultValue: [
                { text: 'Recognized by national bodies' },
                { text: '2 National Awards' },
              ],
            },
            {
              name: 'impactStats', type: 'array', label: 'Statistics', minRows: 1, maxRows: 8,
              admin: { description: 'Stat cards like "5000+ Youth Reached Directly"' },
              fields: [
                { name: 'value', type: 'number', required: true, admin: { description: 'Numeric value (e.g. 5000)' } },
                { name: 'suffix', type: 'text', defaultValue: '+', admin: { description: 'Suffix after number (e.g. "+")' } },
                { name: 'label', type: 'text', required: true, admin: { description: 'Stat label (e.g. "Youth Reached Directly")' } },
                { name: 'description', type: 'text', admin: { description: 'Short extra text (e.g. "Through our programs")' } },
              ],
              defaultValue: [
                { value: 5000, suffix: '+', label: 'Youth Reached Directly', description: 'Through our programs and initiatives' },
                { value: 50000, suffix: '+', label: 'Indirect Beneficiaries', description: 'Extended impact across communities' },
                { value: 36, suffix: '', label: 'States Covered', description: 'Nationwide presence in Nigeria' },
                { value: 8, suffix: '+', label: 'Years of Impact', description: 'Building peace since 2017' },
              ],
            },
          ],
        },

        /* ───────────────── ABOUT PREVIEW ──────────────── */
        {
          label: 'About Preview section',
          fields: [
            { name: 'aboutTitle', type: 'text', label: 'Section Title', defaultValue: 'Why BBFORPEACE?' },
            { name: 'aboutParagraph1', type: 'textarea', label: 'Paragraph 1', defaultValue: 'BBFORPEACE occupies a unique niche as one of the few truly youth-led organizations operating from the grassroots to policy level. We seamlessly link community action, policy advocacy, and regional networking.' },
            { name: 'aboutParagraph2', type: 'textarea', label: 'Paragraph 2', defaultValue: 'Founded in 2016, we began as Nigeria Youth 4 Peace Initiative — a movement challenging the exclusion of youth from the decision-making process and advocating for meaningful engagement in peacebuilding.' },
            {
              name: 'aboutHighlights', type: 'array', label: 'Focus Highlights', maxRows: 8,
              fields: [{ name: 'text', type: 'text', required: true }],
              defaultValue: [
                { text: 'Youth, Women, Peace and Security' },
                { text: 'Conflict Prevention & Governance' },
                { text: 'Peace Education & Empowerment' },
                { text: 'Climate & Environmental Security' },
              ],
            },
            { name: 'aboutMission', type: 'textarea', label: 'Mission', defaultValue: 'To equip youth, women and men as peacebuilders to prevent violent conflict and promote sustainable peace.' },
            { name: 'aboutVision', type: 'textarea', label: 'Vision', defaultValue: 'A peaceful, just and inclusive Africa where youth, women and men lead resilient communities.' },
            { name: 'aboutYearsOfImpact', type: 'text', label: 'Years of Impact Badge', defaultValue: '8+' },
            { name: 'aboutMainImage', type: 'upload', relationTo: 'media', label: 'Main Image / Video Thumbnail' },
            { name: 'aboutSecondaryImage', type: 'upload', relationTo: 'media', label: 'Secondary Image (corner overlay)' },
            { name: 'aboutVideoId', type: 'text', label: 'YouTube Video ID', defaultValue: 'xvQ_AXIQbPM' },
            { name: 'aboutVideoTitle', type: 'text', label: 'Video Title', defaultValue: 'West Africa Peace and Security Dialogue' },
          ],
        },

        /* ────────────── PROGRAMMES / FOCUS ─────────────── */
        {
          label: 'Focus Areas section',
          fields: [
            { name: 'focusBadge', type: 'text', label: 'Badge Text', defaultValue: 'What We Do' },
            { name: 'focusHeading', type: 'text', label: 'Heading', defaultValue: 'Our Focus Areas' },
            { name: 'focusDescription', type: 'textarea', label: 'Description', defaultValue: 'Six integrated focus areas guide our work in youth-led peacebuilding, conflict prevention, and sustainable development.' },
            { name: 'focusBackgroundImage', type: 'upload', relationTo: 'media', label: 'Background Image' },
            {
              name: 'focusAreas', type: 'array', label: 'Focus Area Cards', minRows: 1, maxRows: 12,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'icon', type: 'select', label: 'Icon', options: [
                  { label: 'Users', value: 'Users' }, { label: 'Shield', value: 'Shield' },
                  { label: 'AlertTriangle', value: 'AlertTriangle' }, { label: 'Scale', value: 'Scale' },
                  { label: 'Leaf', value: 'Leaf' }, { label: 'BookOpen', value: 'BookOpen' },
                  { label: 'Target', value: 'Target' }, { label: 'Heart', value: 'Heart' },
                  { label: 'Globe', value: 'Globe' }, { label: 'Megaphone', value: 'Megaphone' },
                ], defaultValue: 'Users' },
                { name: 'link', type: 'text', label: 'Link URL', defaultValue: '/programmes' },
                { name: 'gradient', type: 'select', label: 'Card Color', options: [
                  { label: 'Purple', value: 'from-violet-600 via-purple-600 to-indigo-700' },
                  { label: 'Blue', value: 'from-blue-600 via-indigo-600 to-blue-800' },
                  { label: 'Red/Orange', value: 'from-orange-500 via-red-500 to-rose-600' },
                  { label: 'Green/Teal', value: 'from-emerald-600 via-teal-600 to-cyan-700' },
                  { label: 'Forest Green', value: 'from-green-600 via-emerald-600 to-teal-700' },
                  { label: 'Amber/Yellow', value: 'from-amber-500 via-yellow-500 to-orange-500' },
                ], defaultValue: 'from-violet-600 via-purple-600 to-indigo-700' },
              ],
              defaultValue: [
                { title: 'Youth & Women Peace and Security', description: 'Empowering young people and women as active agents of peace through capacity building and advocacy.', icon: 'Users', link: '/programmes#pillar-1', gradient: 'from-violet-600 via-purple-600 to-indigo-700' },
                { title: 'Conflict Management & Peacebuilding', description: 'Building skills to identify and handle conflicts sensibly, fairly, and efficiently.', icon: 'Shield', link: '/programmes#pillar-2', gradient: 'from-blue-600 via-indigo-600 to-blue-800' },
                { title: 'Prevention of Violent Extremism', description: 'Proactive measures to combat extremism through education and community engagement.', icon: 'AlertTriangle', link: '/programmes#pillar-3', gradient: 'from-orange-500 via-red-500 to-rose-600' },
                { title: 'Governance & Accountability', description: 'Promoting inclusive, transparent, and accountable governance through civic awareness.', icon: 'Scale', link: '/programmes#pillar-4', gradient: 'from-emerald-600 via-teal-600 to-cyan-700' },
                { title: 'Climate & Environmental Security', description: 'Integrating climate action with peacebuilding to address resource conflicts.', icon: 'Leaf', link: '/programmes#pillar-5', gradient: 'from-green-600 via-emerald-600 to-teal-700' },
                { title: 'Peace Education', description: 'Equipping communities with knowledge and skills for peaceful conflict resolution.', icon: 'BookOpen', link: '/programmes', gradient: 'from-amber-500 via-yellow-500 to-orange-500' },
              ],
            },
          ],
        },

        /* ────────────── OUR APPROACH ──────────────────── */
        {
          label: 'Our Approach section',
          fields: [
            { name: 'approachBadge', type: 'text', label: 'Badge Text', defaultValue: 'How We Work' },
            { name: 'approachHeading', type: 'text', label: 'Heading', defaultValue: 'Our Approach' },
            { name: 'approachDescription', type: 'textarea', label: 'Description', defaultValue: 'Five integrated pillars guide our work, ensuring comprehensive and sustainable impact in youth-led peacebuilding across Nigeria and West Africa.' },
            {
              name: 'approachPillars', type: 'array', label: 'Pillars', minRows: 1, maxRows: 10,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'icon', type: 'select', label: 'Icon', options: [
                  { label: 'Target', value: 'Target' }, { label: 'GraduationCap', value: 'GraduationCap' },
                  { label: 'Megaphone', value: 'Megaphone' }, { label: 'Handshake', value: 'Handshake' },
                  { label: 'Radio', value: 'Radio' }, { label: 'Shield', value: 'Shield' },
                  { label: 'Users', value: 'Users' }, { label: 'BookOpen', value: 'BookOpen' },
                ], defaultValue: 'Target' },
                { name: 'color', type: 'select', label: 'Color', options: [
                  { label: 'Blue/Cyan', value: 'from-blue-500 to-cyan-500' },
                  { label: 'Violet/Purple', value: 'from-violet-500 to-purple-500' },
                  { label: 'Amber/Orange', value: 'from-amber-500 to-orange-500' },
                  { label: 'Emerald/Green', value: 'from-emerald-500 to-green-500' },
                  { label: 'Rose/Pink', value: 'from-rose-500 to-pink-500' },
                ], defaultValue: 'from-blue-500 to-cyan-500' },
              ],
              defaultValue: [
                { title: 'Research & Knowledge', description: 'Generating evidence-based insights to inform peacebuilding strategies and policy advocacy.', icon: 'Target', color: 'from-blue-500 to-cyan-500' },
                { title: 'Programs & Training', description: 'Building capacity through workshops, mentorship, and skill development for young peacebuilders.', icon: 'GraduationCap', color: 'from-violet-500 to-purple-500' },
                { title: 'Advocacy & Engagement', description: 'Influencing policies at local, national, and regional levels for sustainable peace.', icon: 'Megaphone', color: 'from-amber-500 to-orange-500' },
                { title: 'Partnerships & Networks', description: 'Collaborating with organizations to amplify impact and create synergies.', icon: 'Handshake', color: 'from-emerald-500 to-green-500' },
                { title: 'Communications & Outreach', description: 'Amplifying peace narratives through media and community awareness campaigns.', icon: 'Radio', color: 'from-rose-500 to-pink-500' },
              ],
            },
          ],
        },

        /* ────────────── INITIATIVES ───────────────────── */
        {
          label: 'Initiatives section',
          fields: [
            { name: 'initiativesBadge', type: 'text', label: 'Badge Text', defaultValue: 'Our Initiatives' },
            { name: 'initiativesHeading', type: 'text', label: 'Heading', defaultValue: 'Regional & Community Initiatives' },
            { name: 'initiativesDescription', type: 'textarea', label: 'Description', defaultValue: 'Strategic programs connecting grassroots action with regional advocacy for sustainable peace across West Africa.' },
            {
              name: 'initiatives', type: 'array', label: 'Initiative Cards', maxRows: 6,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'badge', type: 'text', label: 'Badge Label', defaultValue: 'Initiative' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'link', type: 'text', defaultValue: '/programmes' },
                { name: 'icon', type: 'select', label: 'Icon', options: [
                  { label: 'Users', value: 'Users' }, { label: 'Globe', value: 'Globe' },
                  { label: 'Shield', value: 'Shield' }, { label: 'Target', value: 'Target' },
                  { label: 'Megaphone', value: 'Megaphone' }, { label: 'Heart', value: 'Heart' },
                ], defaultValue: 'Users' },
                { name: 'color', type: 'select', label: 'Color', options: [
                  { label: 'Blue/Indigo', value: 'from-blue-600 to-indigo-600' },
                  { label: 'Emerald/Teal', value: 'from-emerald-600 to-teal-600' },
                  { label: 'Purple/Fuchsia', value: 'from-purple-600 to-fuchsia-600' },
                  { label: 'Amber/Orange', value: 'from-amber-500 to-orange-500' },
                ], defaultValue: 'from-blue-600 to-indigo-600' },
              ],
              defaultValue: [
                { title: 'Champions of Peace Initiative', description: 'A network of youth and women dedicated to building peaceful, just, and inclusive societies through social media engagement, advocacy, dialogue, and community sensitization.', badge: 'Youth Network', icon: 'Users', link: '/programmes#champions-of-peace', color: 'from-blue-600 to-indigo-600' },
                { title: 'West Africa Peace & Security Dialogue (WAPSeD)', description: 'A regional platform bringing together peacebuilding practitioners, policymakers, and researchers to analyze security trends and strengthen coordinated responses across West Africa.', badge: 'Regional Platform', icon: 'Globe', link: '/programmes#wapsed', color: 'from-emerald-600 to-teal-600' },
                { title: 'West Africa Youth Protection Advocacy Network (WAYPAN)', description: 'A youth-led initiative responding to shrinking civic space across West Africa, focusing on civic freedoms, non-violent resistance, and youth leadership in governance.', badge: 'Advocacy Network', icon: 'Shield', link: '/programmes#waypan', color: 'from-purple-600 to-fuchsia-600' },
              ],
            },
          ],
        },

        /* ────────────── VIDEO SECTION ─────────────────── */
        {
          label: 'Video section',
          fields: [
            { name: 'videoBadge', type: 'text', label: 'Badge Text', defaultValue: 'Media' },
            { name: 'videoHeading', type: 'text', label: 'Heading', defaultValue: 'Watch Our Impact' },
            { name: 'videoDescription', type: 'textarea', label: 'Description', defaultValue: 'See how we are empowering communities and building peaceful societies.' },
            {
              name: 'videos', type: 'array', label: 'YouTube Videos', minRows: 1, maxRows: 10,
              fields: [
                { name: 'youtubeId', type: 'text', required: true, admin: { description: 'YouTube video ID (the part after v= in the URL)' } },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text' },
              ],
              defaultValue: [
                { youtubeId: 'nggBR0ErutQ', title: 'Youth Peacebuilding Initiative 2024', description: 'Empowering young people as active agents of peace.' },
                { youtubeId: '81lEFT84dDQ', title: 'Community Engagement & Dialogue', description: 'Fostering meaningful dialogue between communities.' },
                { youtubeId: 'xvQ_AXIQbPM', title: 'Building Blocks for Peace: Our Journey', description: 'Discover how BBFORPEACE is transforming communities across Nigeria.' },
              ],
            },
          ],
        },

        /* ────────────── AWARDS ────────────────────────── */
        {
          label: 'Awards section',
          fields: [
            { name: 'awardsHeading', type: 'text', label: 'Heading', defaultValue: 'Awards & Achievements' },
            { name: 'awardsDescription', type: 'textarea', label: 'Description', defaultValue: 'Our commitment to peacebuilding has been recognized by national and regional bodies.' },
            { name: 'awardsBackgroundImage', type: 'upload', relationTo: 'media', label: 'Background Image' },
            {
              name: 'awards', type: 'array', label: 'Award Cards', minRows: 1, maxRows: 10,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'organization', type: 'text', required: true },
                { name: 'year', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
              defaultValue: [
                { title: 'National Youth Development Award 2025', organization: 'Federal Ministry of Youth Development, Abuja', year: '2025', description: 'Recognized for outstanding contributions to youth empowerment and peacebuilding across Nigeria.' },
                { title: 'Best Young Peacebuilding Organisation 2023', organization: 'West Africa Network for Peacebuilding (WANEP-Nigeria)', year: '2023', description: 'Awarded for innovative approaches to conflict prevention and youth-led peace initiatives.' },
              ],
            },
          ],
        },

        /* ────────────── NEWSLETTER ────────────────────── */
        {
          label: 'Newsletter section',
          fields: [
            { name: 'newsletterHeading', type: 'text', label: 'Heading', defaultValue: 'Stay Updated' },
            { name: 'newsletterDescription', type: 'textarea', label: 'Description', defaultValue: 'Subscribe to our newsletter for the latest news on youth peacebuilding in Nigeria.' },
            { name: 'newsletterButtonText', type: 'text', label: 'Button Text', defaultValue: 'Subscribe Now' },
          ],
        },
      ],
    },
  ],
}
