/**
 * Seed placeholder data into Supabase DB for posts, events, publications, categories, and media.
 * Run with: $env:NODE_OPTIONS = ''; node scripts/seed-placeholder-data.js
 * 
 * This seeds the same data that currently appears as hardcoded fallback arrays
 * in the frontend pages, so they can be managed from the Payload admin panel.
 */

const { Client } = require('pg')

const DB_URI =
  'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres'

// Helper: wrap text in Lexical rich-text JSON (Payload 3 format)
function richText(text) {
  return JSON.stringify({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
    },
  })
}

async function seed() {
  const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log('Connected to Supabase.')

  try {
    // ── 1. MEDIA RECORDS ──────────────────────────────────────────
    console.log('\n── Inserting media records...')
    const mediaData = [
      { alt: 'Youth Peace Summit gathering', url: '/images/_VEE7124 (1).jpg', filename: '_VEE7124 (1).jpg', mime: 'image/jpeg' },
      { alt: 'GPPAC partnership meeting', url: '/images/_VEE7037 (1).jpg', filename: '_VEE7037 (1).jpg', mime: 'image/jpeg' },
      { alt: 'Community dialogue session', url: '/images/_VEE7017 (19) (1).jpg', filename: '_VEE7017 (19) (1).jpg', mime: 'image/jpeg' },
      { alt: 'Peace education workshop', url: '/images/_VEE7153 (6).jpg', filename: '_VEE7153 (6).jpg', mime: 'image/jpeg' },
      { alt: 'National Youth Development Award ceremony', url: '/images/PXL_20251008_122828933.jpg', filename: 'PXL_20251008_122828933.jpg', mime: 'image/jpeg' },
      { alt: 'Community peacebuilding activities', url: '/images/_VEE6887 (20).jpg', filename: '_VEE6887 (20).jpg', mime: 'image/jpeg' },
      { alt: 'Conference proceedings', url: '/images/_VEE6792.jpg', filename: '_VEE6792.jpg', mime: 'image/jpeg' },
      { alt: 'WAYPAN launch event', url: '/images/PXL_20251007_092308643.jpg', filename: 'PXL_20251007_092308643.jpg', mime: 'image/jpeg' },
      { alt: 'Climate security discussion', url: '/images/_VEE7856.jpg', filename: '_VEE7856.jpg', mime: 'image/jpeg' },
      { alt: 'Press media event', url: '/images/_VEE7009 (1).jpg', filename: '_VEE7009 (1).jpg', mime: 'image/jpeg' },
      // Annual report covers
      { alt: '2025 Annual Report Cover', url: '/images/reports/2025 annual report.PNG', filename: '2025 annual report.PNG', mime: 'image/png' },
      { alt: '2024 Annual Report Cover', url: '/images/reports/2024 annual report.PNG', filename: '2024 annual report.PNG', mime: 'image/png' },
      // Annual report PDFs
      { alt: 'BBFORPEACE Annual Report 2025 PDF', url: '/documents/BBFORPEACE ANNUAL REPORT 2025.pdf', filename: 'BBFORPEACE ANNUAL REPORT 2025.pdf', mime: 'application/pdf' },
      { alt: 'BBFORPEACE Annual Report 2024 PDF', url: '/documents/BBFORPEACE ANNUAL REPORT 2024.pdf', filename: 'BBFORPEACE ANNUAL REPORT 2024.pdf', mime: 'application/pdf' },
      // Placeholder media records for publication PDFs (files don't exist yet - admin can upload later)
      { alt: 'NAP-YPS Baseline Study PDF', url: '/documents/BBFORPEACE-Baseline-Study-NAP-YPS.pdf', filename: 'BBFORPEACE-Baseline-Study-NAP-YPS.pdf', mime: 'application/pdf' },
      { alt: 'Shrinking Civic Space PDF', url: '/documents/BBFORPEACE-Shrinking-Civic-Space.pdf', filename: 'BBFORPEACE-Shrinking-Civic-Space.pdf', mime: 'application/pdf' },
      { alt: 'UNSCR 2250 AU Framework PDF', url: '/documents/BBFORPEACE-UNSCR-2250-AU-Framework.pdf', filename: 'BBFORPEACE-UNSCR-2250-AU-Framework.pdf', mime: 'application/pdf' },
      { alt: 'Beyond EndSARS Report PDF', url: '/documents/BBFORPEACE-Beyond-EndSARS.pdf', filename: 'BBFORPEACE-Beyond-EndSARS.pdf', mime: 'application/pdf' },
      { alt: 'Youth Voices Peace PDF', url: '/documents/BBFORPEACE-Youth-Voices-Peace.pdf', filename: 'BBFORPEACE-Youth-Voices-Peace.pdf', mime: 'application/pdf' },
      { alt: 'COVID-19 Peacebuilding PDF', url: '/documents/BBFORPEACE-COVID19-Peacebuilding.pdf', filename: 'BBFORPEACE-COVID19-Peacebuilding.pdf', mime: 'application/pdf' },
    ]

    const mediaIds = {} // url -> id
    for (const m of mediaData) {
      const { rows } = await client.query(
        `INSERT INTO media (alt, url, filename, mime_type) VALUES ($1, $2, $3, $4) RETURNING id`,
        [m.alt, m.url, m.filename, m.mime]
      )
      mediaIds[m.url] = rows[0].id
      console.log(`  media #${rows[0].id}: ${m.filename}`)
    }

    // ── 2. CATEGORIES ─────────────────────────────────────────────
    console.log('\n── Inserting categories...')
    const categoriesData = [
      { name: 'Events', slug: 'events', color: '#6366f1' },
      { name: 'News', slug: 'news', color: '#10b981' },
      { name: 'Programs', slug: 'programs', color: '#f59e0b' },
      { name: 'Training', slug: 'training', color: '#3b82f6' },
      { name: 'Stories', slug: 'stories', color: '#ec4899' },
      { name: 'Awards', slug: 'awards', color: '#8b5cf6' },
    ]

    const catIds = {} // name -> id
    for (const c of categoriesData) {
      const { rows } = await client.query(
        `INSERT INTO categories (name, slug, color) VALUES ($1, $2, $3) RETURNING id`,
        [c.name, c.slug, c.color]
      )
      catIds[c.name] = rows[0].id
      console.log(`  category #${rows[0].id}: ${c.name}`)
    }

    // ── 3. TAGS ───────────────────────────────────────────────────
    console.log('\n── Inserting tags...')
    const tagsData = [
      { name: 'Peacebuilding', slug: 'peacebuilding' },
      { name: 'Youth', slug: 'youth' },
      { name: 'Dialogue', slug: 'dialogue' },
      { name: 'Education', slug: 'education' },
      { name: 'GPPAC', slug: 'gppac' },
      { name: 'Conflict Resolution', slug: 'conflict-resolution' },
      { name: 'Community', slug: 'community' },
      { name: 'Award', slug: 'award' },
    ]

    const tagIds = {}
    for (const t of tagsData) {
      const { rows } = await client.query(
        `INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id`,
        [t.name, t.slug]
      )
      tagIds[t.name] = rows[0].id
      console.log(`  tag #${rows[0].id}: ${t.name}`)
    }

    // ── 4. BLOG POSTS (sub_menu = 'blog') ─────────────────────────
    console.log('\n── Inserting blog posts...')
    const blogPosts = [
      {
        title: 'Youth Peace Summit 2024: Building Bridges Across Communities',
        slug: 'youth-peace-summit-2024',
        excerpt: 'Over 500 young people gathered for a three-day summit focused on dialogue and understanding.',
        content: 'Over 500 young people gathered for a three-day summit focused on dialogue and understanding. The Youth Peace Summit 2024, organized by Building Blocks for Peace Foundation, brought together diverse communities from across Nigeria to engage in meaningful dialogue, participate in peace education workshops, and develop strategies for building sustainable peace in their communities. Participants explored themes including interfaith dialogue, conflict resolution, media literacy, and youth civic engagement.',
        imageUrl: '/images/_VEE7124 (1).jpg',
        category: 'Events',
        publishedAt: '2024-01-15T10:00:00Z',
        tags: ['Youth', 'Peacebuilding', 'Dialogue'],
      },
      {
        title: 'New Partnership with GPPAC West Africa Strengthened',
        slug: 'gppac-partnership',
        excerpt: 'BBFORPEACE continues its role as GPPAC West Africa Regional Secretariat.',
        content: 'Building Blocks for Peace Foundation continues to strengthen its partnership with the Global Partnership for the Prevention of Armed Conflict (GPPAC) as the West Africa Regional Secretariat. This partnership facilitates collaboration between civil society organizations across the region, promoting conflict prevention and peacebuilding initiatives. Through this partnership, BBFORPEACE has been able to amplify youth voices in regional and global peace and security conversations.',
        imageUrl: '/images/_VEE7037 (1).jpg',
        category: 'News',
        publishedAt: '2024-01-10T10:00:00Z',
        tags: ['GPPAC', 'Peacebuilding'],
      },
      {
        title: 'Community Dialogue Series Launches in Northern Nigeria',
        slug: 'community-dialogue-series',
        excerpt: 'Our new dialogue series brings together diverse communities for meaningful conversations.',
        content: 'Our new dialogue series brings together diverse communities in Northern Nigeria for meaningful conversations about peace, security, and community development. The Community Dialogue Series aims to create safe spaces where community leaders, youth, women, and traditional authorities can discuss pressing issues affecting their communities and develop collaborative solutions. The initiative has already reached five communities across Kaduna and Plateau states.',
        imageUrl: '/images/_VEE7017 (19) (1).jpg',
        category: 'Programs',
        publishedAt: '2024-01-05T10:00:00Z',
        tags: ['Dialogue', 'Community', 'Peacebuilding'],
      },
      {
        title: 'Peace Education Workshop for Teachers',
        slug: 'peace-education-workshop',
        excerpt: 'Training educators to integrate peace education into their classrooms.',
        content: 'Building Blocks for Peace Foundation organized a comprehensive Peace Education Workshop for teachers from across the Federal Capital Territory. The workshop equipped educators with innovative methodologies for integrating peace education into their classroom curricula. Participants learned about conflict-sensitive teaching approaches, inclusive pedagogy, and practical tools for creating peaceful learning environments.',
        imageUrl: '/images/_VEE7153 (6).jpg',
        category: 'Training',
        publishedAt: '2024-01-01T10:00:00Z',
        tags: ['Education', 'Peacebuilding'],
      },
      {
        title: 'National Youth Development Award 2025',
        slug: 'national-youth-award',
        excerpt: 'BBFORPEACE receives recognition from the Federal Ministry of Youth Development.',
        content: 'Building Blocks for Peace Foundation has been honored with the prestigious National Youth Development Award 2025 by the Federal Ministry of Youth Development. This recognition celebrates the foundation\'s outstanding contributions to youth empowerment and peacebuilding across Nigeria. The award was presented at a ceremony in Abuja, attended by government officials, civil society leaders, and youth representatives from across the country.',
        imageUrl: '/images/PXL_20251008_122828933.jpg',
        category: 'Awards',
        publishedAt: '2023-12-28T10:00:00Z',
        tags: ['Award', 'Youth'],
      },
      {
        title: 'Volunteer Spotlight: Meet Our Peace Champions',
        slug: 'volunteer-spotlight',
        excerpt: 'Celebrating the dedication and impact of our volunteer network across 36 states.',
        content: 'In this volunteer spotlight, we celebrate the remarkable dedication and impact of our volunteer network spanning all 36 states of Nigeria. Our Peace Champions are young men and women who have committed their time and energy to promoting peace in their communities. From organizing community dialogues to facilitating peace education workshops, these volunteers are making a tangible difference in the lives of their fellow citizens.',
        imageUrl: '/images/_VEE6887 (20).jpg',
        category: 'Stories',
        publishedAt: '2023-12-20T10:00:00Z',
        tags: ['Youth', 'Community', 'Peacebuilding'],
      },
    ]

    const postIds = []
    for (const p of blogPosts) {
      const { rows } = await client.query(
        `INSERT INTO posts (title, slug, featured_image_id, excerpt, content, category_id, status, menu_section, sub_menu, published_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, 'published', 'media', 'blog', $7)
         RETURNING id`,
        [p.title, p.slug, mediaIds[p.imageUrl], p.excerpt, richText(p.content), catIds[p.category], p.publishedAt]
      )
      postIds.push({ id: rows[0].id, tags: p.tags })
      console.log(`  post #${rows[0].id}: ${p.title.substring(0, 50)}...`)
    }

    // ── 5. PRESS STATEMENTS (sub_menu = 'press-statement') ────────
    console.log('\n── Inserting press statements...')
    const pressStatements = [
      {
        title: 'BBFORPEACE Receives National Youth Development Award 2025',
        slug: 'national-youth-award-2025',
        excerpt: 'The Federal Ministry of Youth Development recognizes Building Blocks for Peace Foundation with the prestigious National Youth Development Award for outstanding contributions to youth empowerment and peacebuilding in Nigeria.',
        content: 'Building Blocks for Peace Foundation is proud to announce that it has been recognized by the Federal Ministry of Youth Development with the prestigious National Youth Development Award 2025. This award celebrates our outstanding contributions to youth empowerment, civic engagement, and peacebuilding across Nigeria. We remain committed to our mission of building peaceful communities through youth-led initiatives.',
        imageUrl: '/images/PXL_20251008_122828933.jpg',
        category: 'Awards',
        publishedAt: '2025-10-08T10:00:00Z',
      },
      {
        title: 'Launch of West Africa Youth Protection Advocacy Network (WAYPAN)',
        slug: 'waypan-launch',
        excerpt: 'BBFORPEACE announces the establishment of WAYPAN, a regional youth-led initiative to respond to shrinking civic space across West Africa and promote youth leadership in governance.',
        content: 'Today, Building Blocks for Peace Foundation announces the establishment of the West Africa Youth Protection Advocacy Network (WAYPAN). This regional youth-led initiative is designed to respond to the concerning trend of shrinking civic space across West Africa and promote meaningful youth leadership in governance. WAYPAN will bring together young leaders from across the region to advocate for the protection of civic spaces and the inclusion of youth in decision-making processes.',
        imageUrl: '/images/PXL_20251007_092308643.jpg',
        category: 'News',
        publishedAt: '2025-09-15T10:00:00Z',
      },
      {
        title: 'Statement on the Importance of Youth Inclusion in Climate Security Discussions',
        slug: 'climate-security-youth-inclusion',
        excerpt: 'As climate change continues to exacerbate resource conflicts across the Sahel, BBFORPEACE calls for meaningful inclusion of young people in climate security policy frameworks.',
        content: 'As climate change continues to exacerbate resource conflicts across the Sahel and other vulnerable regions, Building Blocks for Peace Foundation calls for the meaningful inclusion of young people in climate security policy frameworks. Young people are disproportionately affected by the intersection of climate change and conflict, yet their voices remain largely absent from the policy discussions that shape responses to these challenges. We urge governments and international organizations to actively engage youth in developing and implementing climate security strategies.',
        imageUrl: '/images/_VEE7856.jpg',
        category: 'News',
        publishedAt: '2025-08-20T10:00:00Z',
      },
      {
        title: 'BBFORPEACE Commemorates International Youth Day 2025',
        slug: 'international-youth-day-2025',
        excerpt: "On this year's International Youth Day, we celebrate the resilience and contributions of young peacebuilders across Nigeria and West Africa.",
        content: "On this year's International Youth Day, Building Blocks for Peace Foundation celebrates the resilience, creativity, and contributions of young peacebuilders across Nigeria and West Africa. We recognize the vital role that young people play in building peaceful, just, and inclusive societies. As we commemorate this day, we reaffirm our commitment to providing platforms and opportunities for young people to lead peacebuilding efforts in their communities.",
        imageUrl: '/images/_VEE6887 (20).jpg',
        category: 'News',
        publishedAt: '2025-08-12T10:00:00Z',
      },
    ]

    for (const p of pressStatements) {
      const { rows } = await client.query(
        `INSERT INTO posts (title, slug, featured_image_id, excerpt, content, category_id, status, menu_section, sub_menu, published_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, 'published', 'media', 'press-statement', $7)
         RETURNING id`,
        [p.title, p.slug, mediaIds[p.imageUrl], p.excerpt, richText(p.content), catIds[p.category], p.publishedAt]
      )
      postIds.push({ id: rows[0].id, tags: [] })
      console.log(`  press #${rows[0].id}: ${p.title.substring(0, 50)}...`)
    }

    // ── 6. POST-TAG RELATIONS ─────────────────────────────────────
    console.log('\n── Inserting post-tag relations...')
    let relOrder = 1
    for (const entry of postIds) {
      for (const tagName of entry.tags) {
        if (tagIds[tagName]) {
          await client.query(
            `INSERT INTO posts_rels (parent_id, path, tags_id, "order") VALUES ($1, 'tags', $2, $3)`,
            [entry.id, tagIds[tagName], relOrder++]
          )
        }
      }
    }
    console.log(`  Inserted ${relOrder - 1} post-tag relations.`)

    // ── 7. EVENTS ─────────────────────────────────────────────────
    console.log('\n── Inserting events...')
    const events = [
      // Upcoming / ongoing
      {
        title: 'Youth Peace Forum 2025',
        slug: 'youth-peace-forum-2025',
        excerpt: 'Annual gathering of young peacebuilders from across Nigeria for dialogue and skills building.',
        description: 'The Youth Peace Forum 2025 is the annual gathering of young peacebuilders from across Nigeria. This three-day event features keynote speeches from leading peace practitioners, hands-on workshops in conflict resolution and dialogue facilitation, and networking opportunities with youth from all 36 states. The forum aims to strengthen the capacity of young people to contribute meaningfully to peacebuilding in their communities.',
        imageUrl: '/images/_VEE7124 (1).jpg',
        location: 'Abuja, Nigeria',
        venue: 'International Conference Centre',
        startDate: '2025-09-15T09:00:00Z',
        endDate: '2025-09-17T17:00:00Z',
        maxAttendees: 500,
        status: 'upcoming',
        isFeatured: true,
      },
      {
        title: 'Community Dialogue Workshop',
        slug: 'community-dialogue-workshop',
        excerpt: 'Learn facilitation skills for leading community dialogue sessions.',
        description: 'This intensive workshop focuses on building the facilitation skills needed to lead effective community dialogue sessions. Participants will learn practical techniques for creating safe spaces, managing difficult conversations, and fostering mutual understanding between diverse community groups. The workshop includes role-playing exercises and real-world case studies.',
        imageUrl: '/images/_VEE7017 (19) (1).jpg',
        location: 'Lagos, Nigeria',
        venue: 'Lagos State Conference Hall',
        startDate: '2025-08-28T09:00:00Z',
        endDate: null,
        maxAttendees: 50,
        status: 'upcoming',
        isFeatured: false,
      },
      {
        title: 'Peace Education Training',
        slug: 'peace-education-training',
        excerpt: 'Training for educators on integrating peace education into curriculum.',
        description: 'A comprehensive training programme designed for educators who want to integrate peace education into their classroom practice. This three-day online training covers conflict-sensitive pedagogy, intercultural understanding, and practical tools for creating peaceful learning environments. Participants receive certificates upon completion.',
        imageUrl: '/images/_VEE7153 (6).jpg',
        location: 'Online (Zoom)',
        venue: null,
        startDate: '2025-08-20T09:00:00Z',
        endDate: '2025-08-22T17:00:00Z',
        maxAttendees: 100,
        status: 'upcoming',
        isFeatured: false,
      },
      // Past / completed
      {
        title: 'International Day of Peace Celebration 2024',
        slug: 'international-peace-day-2024',
        excerpt: 'Commemorating the UN International Day of Peace with community activities.',
        description: 'BBFORPEACE commemorated the UN International Day of Peace 2024 with a series of community activities including a peace walk, interfaith dialogue sessions, art exhibitions, and youth performances. The celebration brought together over 300 community members from diverse backgrounds to reaffirm their commitment to peaceful coexistence.',
        imageUrl: '/images/_VEE6887 (20).jpg',
        location: 'Abuja, Nigeria',
        venue: 'Unity Fountain',
        startDate: '2024-09-21T09:00:00Z',
        endDate: null,
        maxAttendees: null,
        status: 'completed',
        isFeatured: false,
      },
      {
        title: 'Youth Summit on Conflict Resolution',
        slug: 'youth-summit-conflict-resolution',
        excerpt: 'Training young leaders in conflict resolution and mediation techniques.',
        description: 'The Youth Summit on Conflict Resolution brought together 200 young leaders from across Northern Nigeria for intensive training in conflict resolution and mediation techniques. Participants engaged in practical exercises, learned from experienced mediators, and developed action plans for implementing peacebuilding activities in their communities.',
        imageUrl: '/images/_VEE7037 (1).jpg',
        location: 'Kaduna, Nigeria',
        venue: 'Kaduna State Council Hall',
        startDate: '2024-08-10T09:00:00Z',
        endDate: '2024-08-12T17:00:00Z',
        maxAttendees: null,
        status: 'completed',
        isFeatured: false,
      },
      {
        title: 'WANEP Nigeria Annual Conference',
        slug: 'wanep-conference-2023',
        excerpt: 'Best Young Peacebuilding Organisation Award ceremony.',
        description: 'The West Africa Network for Peacebuilding (WANEP) Nigeria held its annual conference which recognized BBFORPEACE with the Best Young Peacebuilding Organisation Award. The conference featured panel discussions on emerging security challenges in West Africa, presentations of research findings, and networking opportunities for peacebuilding organizations.',
        imageUrl: '/images/PXL_20251008_122828933.jpg',
        location: 'Lagos, Nigeria',
        venue: 'WANEP Nigeria Office',
        startDate: '2023-12-15T09:00:00Z',
        endDate: null,
        maxAttendees: null,
        status: 'completed',
        isFeatured: false,
      },
    ]

    for (const e of events) {
      const { rows } = await client.query(
        `INSERT INTO events (title, slug, featured_image_id, description, excerpt, location, venue, start_date, end_date, max_attendees, status, is_featured)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          e.title, e.slug, mediaIds[e.imageUrl], richText(e.description), e.excerpt,
          e.location, e.venue, e.startDate, e.endDate, e.maxAttendees, e.status, e.isFeatured,
        ]
      )
      console.log(`  event #${rows[0].id}: ${e.title.substring(0, 50)}...`)
    }

    // ── 8. PUBLICATIONS (sub_menu = 'publication') ────────────────
    console.log('\n── Inserting publications...')
    const publications = [
      {
        title: "Baseline Study on the Implementation of Nigeria's National Action Plan on Youth, Peace and Security",
        slug: 'baseline-study-nap-yps',
        excerpt: 'A comprehensive baseline study assessing the implementation progress.',
        description: "A comprehensive baseline study assessing the implementation progress of Nigeria's National Action Plan on Youth, Peace and Security (NAP-YPS). This study examines the current state of YPS implementation across key thematic areas including participation, protection, prevention, partnerships, and disengagement and reintegration.",
        coverImageUrl: '/images/_VEE7124 (1).jpg',
        fileUrl: '/documents/BBFORPEACE-Baseline-Study-NAP-YPS.pdf',
        category: 'research',
        year: 2024,
        isFeatured: true,
        author: 'BBFORPEACE Research Team',
      },
      {
        title: 'Nigeria: Shrinking Civic Space in the Name of Security',
        slug: 'shrinking-civic-space',
        excerpt: 'An in-depth analysis of how security-related policies are affecting civic space.',
        description: 'An in-depth analysis of how security-related policies and practices in Nigeria are affecting civic space and fundamental freedoms. The report documents trends in the restriction of civil liberties, examines the impact on civil society organizations, and proposes recommendations for balancing security concerns with the protection of civic rights.',
        coverImageUrl: '/images/_VEE6792.jpg',
        fileUrl: '/documents/BBFORPEACE-Shrinking-Civic-Space.pdf',
        category: 'research',
        year: 2023,
        isFeatured: false,
        author: 'BBFORPEACE Research Team',
      },
      {
        title: 'Complementarity of UNSCR 2250 and AU Continental Framework on Youth, Peace and Security',
        slug: 'unscr-2250-au-framework',
        excerpt: 'Examining alignment between UNSCR 2250 and AU Continental Framework.',
        description: 'This research paper examines the complementarity between United Nations Security Council Resolution 2250 on Youth, Peace and Security and the African Union Continental Framework on Youth, Peace and Security. It analyzes how these two frameworks can be harmonized to advance the YPS agenda in Africa.',
        coverImageUrl: '/images/_VEE7017 (19) (1).jpg',
        fileUrl: '/documents/BBFORPEACE-UNSCR-2250-AU-Framework.pdf',
        category: 'research',
        year: 2023,
        isFeatured: false,
        author: 'BBFORPEACE Research Team',
      },
      {
        title: 'Beyond #ENDSARS: Effecting Positive Change in Governance in Nigeria',
        slug: 'beyond-endsars',
        excerpt: 'Exploring the aftermath of #EndSARS and pathways to governance transformation.',
        description: 'This report explores the aftermath of the #EndSARS movement in Nigeria and examines pathways to governance transformation. It documents the civic energy unleashed by the movement, analyzes the government responses, and proposes constructive approaches to channeling youth activism into sustainable governance reforms.',
        coverImageUrl: '/images/_VEE7153 (6).jpg',
        fileUrl: '/documents/BBFORPEACE-Beyond-EndSARS.pdf',
        category: 'report',
        year: 2021,
        isFeatured: false,
        author: 'BBFORPEACE',
      },
      {
        title: 'Connecting and Amplifying Voices of Youth Building Peace in Nigeria',
        slug: 'youth-voices-peace',
        excerpt: 'Documentation of youth-led peacebuilding initiatives.',
        description: 'A documentation of youth-led peacebuilding initiatives across Nigeria, highlighting innovative approaches, success stories, and lessons learned. This publication amplifies the voices of young peacebuilders who are making tangible differences in their communities through dialogue, mediation, and community development.',
        coverImageUrl: '/images/_VEE7037 (1).jpg',
        fileUrl: '/documents/BBFORPEACE-Youth-Voices-Peace.pdf',
        category: 'report',
        year: 2022,
        isFeatured: false,
        author: 'BBFORPEACE',
      },
      {
        title: 'COVID-19 Pandemic: The Future of Peacebuilding in Nigeria',
        slug: 'covid19-peacebuilding',
        excerpt: "Analysis of the pandemic's impact on peacebuilding efforts.",
        description: "An analysis of the COVID-19 pandemic's impact on peacebuilding efforts in Nigeria. This research examines how the pandemic exacerbated existing conflicts, disrupted peacebuilding activities, and created new challenges for community cohesion. It also explores the opportunities for innovation and adaptation that emerged during the crisis.",
        coverImageUrl: '/images/_VEE6887 (20).jpg',
        fileUrl: '/documents/BBFORPEACE-COVID19-Peacebuilding.pdf',
        category: 'research',
        year: 2020,
        isFeatured: false,
        author: 'BBFORPEACE Research Team',
      },
    ]

    for (const pub of publications) {
      const { rows } = await client.query(
        `INSERT INTO publications (title, slug, cover_image_id, file_id, description, excerpt, category, menu_section, sub_menu, year, author, is_featured)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, 'report', 'publication', $8, $9, $10)
         RETURNING id`,
        [
          pub.title, pub.slug, mediaIds[pub.coverImageUrl], mediaIds[pub.fileUrl],
          richText(pub.description), pub.excerpt, pub.category, pub.year, pub.author, pub.isFeatured,
        ]
      )
      console.log(`  publication #${rows[0].id}: ${pub.title.substring(0, 50)}...`)
    }

    // ── 9. ANNUAL REPORTS (sub_menu = 'annual-report') ────────────
    console.log('\n── Inserting annual reports...')
    const annualReports = [
      {
        title: '2025 Annual Report',
        slug: 'annual-report-2025',
        excerpt: "Consolidating Peace: Advancing the Implementation of Youth and Women Peace and Security Agenda. This report documents BBFORPEACE's strategic efforts in consolidating peace across West Africa.",
        description: "Consolidating Peace: Advancing the Implementation of Youth and Women Peace and Security Agenda. The 2025 Annual Report documents Building Blocks for Peace Foundation's strategic efforts in consolidating peace across West Africa, highlighting key achievements in stakeholder engagement, policy advocacy, community engagement, and institutional development.",
        coverImageUrl: '/images/reports/2025 annual report.PNG',
        fileUrl: '/documents/BBFORPEACE ANNUAL REPORT 2025.pdf',
        category: 'report',
        year: 2025,
      },
      {
        title: '2024 Annual Report',
        slug: 'annual-report-2024',
        excerpt: "Building Resilient Communities: Strengthening Youth-Led Peacebuilding in Nigeria. The 2024 Annual Report showcases BBFORPEACE's transformative work.",
        description: "Building Resilient Communities: Strengthening Youth-Led Peacebuilding in Nigeria. The 2024 Annual Report showcases Building Blocks for Peace Foundation's transformative work in strengthening youth-led peacebuilding across Nigeria, including programme delivery, partnership development, and capacity building initiatives.",
        coverImageUrl: '/images/reports/2024 annual report.PNG',
        fileUrl: '/documents/BBFORPEACE ANNUAL REPORT 2024.pdf',
        category: 'report',
        year: 2024,
      },
    ]

    for (const r of annualReports) {
      const { rows } = await client.query(
        `INSERT INTO publications (title, slug, cover_image_id, file_id, description, excerpt, category, menu_section, sub_menu, year, is_featured, author)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, 'report', 'annual-report', $8, false, 'BBFORPEACE')
         RETURNING id`,
        [
          r.title, r.slug, mediaIds[r.coverImageUrl], mediaIds[r.fileUrl],
          richText(r.description), r.excerpt, r.category, r.year,
        ]
      )
      console.log(`  annual report #${rows[0].id}: ${r.title}`)
    }

    // ── SUMMARY ───────────────────────────────────────────────────
    const counts = await client.query(`
      SELECT 
        (SELECT count(*) FROM media) as media,
        (SELECT count(*) FROM categories) as categories,
        (SELECT count(*) FROM tags) as tags,
        (SELECT count(*) FROM posts) as posts,
        (SELECT count(*) FROM events) as events,
        (SELECT count(*) FROM publications) as publications,
        (SELECT count(*) FROM testimonials) as testimonials,
        (SELECT count(*) FROM gallery_items) as gallery_items
    `)
    console.log('\n=== FINAL ROW COUNTS ===')
    console.log(counts.rows[0])
    console.log('\nSeed complete!')

  } catch (err) {
    console.error('Seed error:', err)
    throw err
  } finally {
    await client.end()
  }
}

seed()
