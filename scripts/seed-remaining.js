/**
 * Continuation seed: inserts the 4th press statement, post-tag relations, events, publications, annual reports.
 */
const { Client } = require('pg')

const DB_URI = 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres'

function richText(text) {
  return JSON.stringify({
    root: {
      type: 'root', format: '', indent: 0, version: 1,
      children: [{
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
        direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1, textFormat: 0, textStyle: '',
      }],
      direction: 'ltr',
    },
  })
}

// Known IDs from first run
const MEDIA = {
  VEE7124: 1, VEE7037: 2, VEE7017: 3, VEE7153: 4, PXL122828: 5, VEE6887: 6,
  VEE6792: 7, PXL092308: 8, VEE7856: 9, VEE7009: 10,
  REPORT_2025_COVER: 11, REPORT_2024_COVER: 12, REPORT_2025_PDF: 13, REPORT_2024_PDF: 14,
  PUB_NAP_YPS: 15, PUB_CIVIC_SPACE: 16, PUB_UNSCR_2250: 17, PUB_ENDSARS: 18, PUB_YOUTH_VOICES: 19, PUB_COVID: 20,
}
const CAT = { Events: 1, News: 2, Programs: 3, Training: 4, Stories: 5, Awards: 6 }
const TAG = { Peacebuilding: 1, Youth: 2, Dialogue: 3, Education: 4, GPPAC: 5, ConflictRes: 6, Community: 7, Award: 8 }

async function seed() {
  const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log('Connected.')

  try {
    // ── 4th press statement ───────────────────────────────────────
    console.log('\n── Inserting 4th press statement...')
    const { rows: pressRows } = await client.query(
      `INSERT INTO posts (title, slug, featured_image_id, excerpt, content, category_id, status, menu_section, sub_menu, published_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, 'published', 'media', 'press-statement', $7)
       RETURNING id`,
      [
        'BBFORPEACE Commemorates International Youth Day 2025',
        'international-youth-day-2025',
        MEDIA.VEE6887,
        "On this year's International Youth Day, we celebrate the resilience and contributions of young peacebuilders across Nigeria and West Africa.",
        richText("On this year's International Youth Day, Building Blocks for Peace Foundation celebrates the resilience, creativity, and contributions of young peacebuilders across Nigeria and West Africa. We recognize the vital role that young people play in building peaceful, just, and inclusive societies. As we commemorate this day, we reaffirm our commitment to providing platforms and opportunities for young people to lead peacebuilding efforts in their communities."),
        CAT.News,
        '2025-08-12T10:00:00Z',
      ]
    )
    console.log(`  press #${pressRows[0].id}: International Youth Day 2025`)

    // ── Post-tag relations ────────────────────────────────────────
    console.log('\n── Inserting post-tag relations...')
    const tagMap = [
      { postId: 1, tags: [TAG.Youth, TAG.Peacebuilding, TAG.Dialogue] },
      { postId: 2, tags: [TAG.GPPAC, TAG.Peacebuilding] },
      { postId: 3, tags: [TAG.Dialogue, TAG.Community, TAG.Peacebuilding] },
      { postId: 4, tags: [TAG.Education, TAG.Peacebuilding] },
      { postId: 5, tags: [TAG.Award, TAG.Youth] },
      { postId: 6, tags: [TAG.Youth, TAG.Community, TAG.Peacebuilding] },
    ]
    let order = 1
    for (const entry of tagMap) {
      for (const tagId of entry.tags) {
        await client.query(
          `INSERT INTO posts_rels (parent_id, path, tags_id, "order") VALUES ($1, 'tags', $2, $3)`,
          [entry.postId, tagId, order++]
        )
      }
    }
    console.log(`  Inserted ${order - 1} post-tag relations.`)

    // ── Events ────────────────────────────────────────────────────
    console.log('\n── Inserting events...')
    const events = [
      { title: 'Youth Peace Forum 2025', slug: 'youth-peace-forum-2025', imageId: MEDIA.VEE7124, excerpt: 'Annual gathering of young peacebuilders from across Nigeria for dialogue and skills building.', desc: 'The Youth Peace Forum 2025 is the annual gathering of young peacebuilders from across Nigeria. This three-day event features keynote speeches from leading peace practitioners, hands-on workshops in conflict resolution and dialogue facilitation, and networking opportunities with youth from all 36 states.', location: 'Abuja, Nigeria', venue: 'International Conference Centre', startDate: '2025-09-15T09:00:00Z', endDate: '2025-09-17T17:00:00Z', maxAttendees: 500, status: 'upcoming', isFeatured: true },
      { title: 'Community Dialogue Workshop', slug: 'community-dialogue-workshop', imageId: MEDIA.VEE7017, excerpt: 'Learn facilitation skills for leading community dialogue sessions.', desc: 'This intensive workshop focuses on building the facilitation skills needed to lead effective community dialogue sessions. Participants will learn practical techniques for creating safe spaces, managing difficult conversations, and fostering mutual understanding.', location: 'Lagos, Nigeria', venue: 'Lagos State Conference Hall', startDate: '2025-08-28T09:00:00Z', endDate: null, maxAttendees: 50, status: 'upcoming', isFeatured: false },
      { title: 'Peace Education Training', slug: 'peace-education-training', imageId: MEDIA.VEE7153, excerpt: 'Training for educators on integrating peace education into curriculum.', desc: 'A comprehensive training programme designed for educators who want to integrate peace education into their classroom practice. This three-day online training covers conflict-sensitive pedagogy, intercultural understanding, and practical tools for creating peaceful learning environments.', location: 'Online (Zoom)', venue: null, startDate: '2025-08-20T09:00:00Z', endDate: '2025-08-22T17:00:00Z', maxAttendees: 100, status: 'upcoming', isFeatured: false },
      { title: 'International Day of Peace Celebration 2024', slug: 'international-peace-day-2024', imageId: MEDIA.VEE6887, excerpt: 'Commemorating the UN International Day of Peace with community activities.', desc: 'BBFORPEACE commemorated the UN International Day of Peace 2024 with a series of community activities including a peace walk, interfaith dialogue sessions, art exhibitions, and youth performances.', location: 'Abuja, Nigeria', venue: 'Unity Fountain', startDate: '2024-09-21T09:00:00Z', endDate: null, maxAttendees: null, status: 'completed', isFeatured: false },
      { title: 'Youth Summit on Conflict Resolution', slug: 'youth-summit-conflict-resolution', imageId: MEDIA.VEE7037, excerpt: 'Training young leaders in conflict resolution and mediation techniques.', desc: 'The Youth Summit on Conflict Resolution brought together 200 young leaders from across Northern Nigeria for intensive training in conflict resolution and mediation techniques.', location: 'Kaduna, Nigeria', venue: 'Kaduna State Council Hall', startDate: '2024-08-10T09:00:00Z', endDate: '2024-08-12T17:00:00Z', maxAttendees: null, status: 'completed', isFeatured: false },
      { title: 'WANEP Nigeria Annual Conference', slug: 'wanep-conference-2023', imageId: MEDIA.PXL122828, excerpt: 'Best Young Peacebuilding Organisation Award ceremony.', desc: 'The West Africa Network for Peacebuilding (WANEP) Nigeria held its annual conference which recognized BBFORPEACE with the Best Young Peacebuilding Organisation Award.', location: 'Lagos, Nigeria', venue: 'WANEP Nigeria Office', startDate: '2023-12-15T09:00:00Z', endDate: null, maxAttendees: null, status: 'completed', isFeatured: false },
    ]

    for (const e of events) {
      const { rows } = await client.query(
        `INSERT INTO events (title, slug, featured_image_id, description, excerpt, location, venue, start_date, end_date, max_attendees, status, is_featured)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [e.title, e.slug, e.imageId, richText(e.desc), e.excerpt, e.location, e.venue, e.startDate, e.endDate, e.maxAttendees, e.status, e.isFeatured]
      )
      console.log(`  event #${rows[0].id}: ${e.title}`)
    }

    // ── Publications (sub_menu = 'publication') ───────────────────
    console.log('\n── Inserting publications...')
    const publications = [
      { title: "Baseline Study on the Implementation of Nigeria's National Action Plan on Youth, Peace and Security", slug: 'baseline-study-nap-yps', excerpt: 'A comprehensive baseline study assessing the implementation progress.', desc: "A comprehensive baseline study assessing the implementation progress of Nigeria's National Action Plan on Youth, Peace and Security (NAP-YPS).", coverId: MEDIA.VEE7124, fileId: MEDIA.PUB_NAP_YPS, category: 'research', year: 2024, isFeatured: true, author: 'BBFORPEACE Research Team' },
      { title: 'Nigeria: Shrinking Civic Space in the Name of Security', slug: 'shrinking-civic-space', excerpt: 'An in-depth analysis of how security-related policies are affecting civic space.', desc: 'An in-depth analysis of how security policies in Nigeria are affecting civic space and fundamental freedoms.', coverId: MEDIA.VEE6792, fileId: MEDIA.PUB_CIVIC_SPACE, category: 'research', year: 2023, isFeatured: false, author: 'BBFORPEACE Research Team' },
      { title: 'Complementarity of UNSCR 2250 and AU Continental Framework on Youth, Peace and Security', slug: 'unscr-2250-au-framework', excerpt: 'Examining alignment between UNSCR 2250 and AU Continental Framework.', desc: 'This research paper examines the complementarity between UNSCR 2250 and the African Union Continental Framework on Youth, Peace and Security.', coverId: MEDIA.VEE7017, fileId: MEDIA.PUB_UNSCR_2250, category: 'research', year: 2023, isFeatured: false, author: 'BBFORPEACE Research Team' },
      { title: 'Beyond #ENDSARS: Effecting Positive Change in Governance in Nigeria', slug: 'beyond-endsars', excerpt: 'Exploring the aftermath of #EndSARS and pathways to governance transformation.', desc: 'This report explores the aftermath of the #EndSARS movement and examines pathways to governance transformation.', coverId: MEDIA.VEE7153, fileId: MEDIA.PUB_ENDSARS, category: 'report', year: 2021, isFeatured: false, author: 'BBFORPEACE' },
      { title: 'Connecting and Amplifying Voices of Youth Building Peace in Nigeria', slug: 'youth-voices-peace', excerpt: 'Documentation of youth-led peacebuilding initiatives.', desc: 'A documentation of youth-led peacebuilding initiatives across Nigeria, highlighting innovative approaches and lessons learned.', coverId: MEDIA.VEE7037, fileId: MEDIA.PUB_YOUTH_VOICES, category: 'report', year: 2022, isFeatured: false, author: 'BBFORPEACE' },
      { title: 'COVID-19 Pandemic: The Future of Peacebuilding in Nigeria', slug: 'covid19-peacebuilding', excerpt: "Analysis of the pandemic's impact on peacebuilding efforts.", desc: "An analysis of the COVID-19 pandemic's impact on peacebuilding efforts in Nigeria.", coverId: MEDIA.VEE6887, fileId: MEDIA.PUB_COVID, category: 'research', year: 2020, isFeatured: false, author: 'BBFORPEACE Research Team' },
    ]

    for (const p of publications) {
      const { rows } = await client.query(
        `INSERT INTO publications (title, slug, cover_image_id, file_id, description, excerpt, category, menu_section, sub_menu, year, author, is_featured)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, 'report', 'publication', $8, $9, $10)
         RETURNING id`,
        [p.title, p.slug, p.coverId, p.fileId, richText(p.desc), p.excerpt, p.category, p.year, p.author, p.isFeatured]
      )
      console.log(`  pub #${rows[0].id}: ${p.title.substring(0, 50)}...`)
    }

    // ── Annual reports (sub_menu = 'annual-report') ───────────────
    console.log('\n── Inserting annual reports...')
    const reports = [
      { title: '2025 Annual Report', slug: 'annual-report-2025', excerpt: "Consolidating Peace: Advancing the Implementation of Youth and Women Peace and Security Agenda.", desc: "Consolidating Peace: Advancing the Implementation of Youth and Women Peace and Security Agenda. The 2025 Annual Report documents BBFORPEACE's strategic efforts across West Africa.", coverId: MEDIA.REPORT_2025_COVER, fileId: MEDIA.REPORT_2025_PDF, year: 2025 },
      { title: '2024 Annual Report', slug: 'annual-report-2024', excerpt: "Building Resilient Communities: Strengthening Youth-Led Peacebuilding in Nigeria.", desc: "Building Resilient Communities: Strengthening Youth-Led Peacebuilding in Nigeria. The 2024 Annual Report showcases BBFORPEACE's transformative work.", coverId: MEDIA.REPORT_2024_COVER, fileId: MEDIA.REPORT_2024_PDF, year: 2024 },
    ]

    for (const r of reports) {
      const { rows } = await client.query(
        `INSERT INTO publications (title, slug, cover_image_id, file_id, description, excerpt, category, menu_section, sub_menu, year, is_featured, author)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, 'report', 'report', 'annual-report', $7, false, 'BBFORPEACE')
         RETURNING id`,
        [r.title, r.slug, r.coverId, r.fileId, richText(r.desc), r.excerpt, r.year]
      )
      console.log(`  report #${rows[0].id}: ${r.title}`)
    }

    // ── Summary ───────────────────────────────────────────────────
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
