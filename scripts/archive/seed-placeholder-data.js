/**
 * Comprehensive seed script that:
 * 1. Fixes general_settings schema (logo_alt_id -> logo_alt)
 * 2. Seeds general_settings, footer_settings, and other empty globals
 * 3. Seeds team members (staff + board) with media entries
 * 4. Seeds programmes (5 strategic pillars)
 * 5. Adds project-report publications
 */
const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

async function insertMediaIfNotExists(filename, url, mimeType, altText) {
  const existing = await c.query('SELECT id FROM media WHERE filename = $1', [filename])
  if (existing.rows.length) return existing.rows[0].id
  const alt = altText || filename.replace(/\.[^.]+$/, '').replace(/^\d+\.\s*/, '')
  const r = await c.query(
    'INSERT INTO media (filename, url, mime_type, filesize, width, height, alt, updated_at, created_at) VALUES ($1, $2, $3, 100000, 800, 600, $4, NOW(), NOW()) RETURNING id',
    [filename, url, mimeType || 'image/jpeg', alt]
  )
  return r.rows[0].id
}

function lexical(text) {
  return JSON.stringify({
    root: { type: 'root', format: '', indent: 0, version: 1,
      children: [{ type: 'paragraph', format: '', indent: 0, version: 1,
        children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
        direction: 'ltr', textStyle: '', textFormat: 0 }],
      direction: 'ltr' }
  })
}

;(async () => {
  await c.connect()
  console.log('Connected to database.\n')

  // ==============================
  // 1. FIX general_settings SCHEMA
  // ==============================
  console.log('=== 1. Fixing general_settings schema ===')
  try {
    await c.query('ALTER TABLE general_settings DROP COLUMN IF EXISTS logo_alt_id')
    console.log('  Dropped logo_alt_id (wrong type)')
  } catch (e) { console.log(' ', e.message) }

  try {
    await c.query("ALTER TABLE general_settings ADD COLUMN logo_alt varchar DEFAULT 'BBFORPEACE Logo'")
    console.log('  Added logo_alt (varchar)')
  } catch (e) {
    if (e.code === '42701') console.log('  logo_alt already exists')
    else console.log(' ', e.message)
  }

  // ==============================
  // 2. SEED EMPTY GLOBALS
  // ==============================
  console.log('\n=== 2. Seeding empty globals ===')

  const gsCount = await c.query('SELECT COUNT(*) as cnt FROM general_settings')
  if (+gsCount.rows[0].cnt === 0) {
    await c.query("INSERT INTO general_settings (id, site_name, site_tagline, logo_alt, updated_at, created_at) VALUES (1, 'BBFORPEACE', 'Building Blocks for Peace Foundation', 'BBFORPEACE Logo', NOW(), NOW())")
    console.log('  general_settings seeded')
  } else console.log('  general_settings: already has data')

  const fsCount = await c.query('SELECT COUNT(*) as cnt FROM footer_settings')
  if (+fsCount.rows[0].cnt === 0) {
    await c.query("INSERT INTO footer_settings (id, footer_text, copyright_text, quick_links_title, programmes_title, contact_title, developed_by_text, privacy_label, terms_label, updated_at, created_at) VALUES (1, 'Building Blocks for Peace Foundation is a youth-led NGO dedicated to conflict prevention, peacebuilding, and sustainable development in Nigeria and West Africa.', '2025 Building Blocks for Peace Foundation. All rights reserved.', 'Quick Links', 'Programmes', 'Contact', 'Developed by ValueMax', 'Privacy Policy', 'Terms of Service', NOW(), NOW())")
    console.log('  footer_settings seeded')
  } else console.log('  footer_settings: already has data')

  const seoCount = await c.query('SELECT COUNT(*) as cnt FROM seo_settings')
  if (+seoCount.rows[0].cnt === 0) {
    await c.query("INSERT INTO seo_settings (id, meta_title, meta_description, updated_at, created_at) VALUES (1, 'BBFORPEACE - Building Blocks for Peace Foundation', 'Youth-led peacebuilding NGO in Nigeria.', NOW(), NOW())")
    console.log('  seo_settings seeded')
  } else console.log('  seo_settings: already has data')

  const smCount = await c.query('SELECT COUNT(*) as cnt FROM social_media_settings')
  if (+smCount.rows[0].cnt === 0) {
    await c.query("INSERT INTO social_media_settings (id, facebook, twitter, instagram, youtube, linkedin, updated_at, created_at) VALUES (1, 'https://facebook.com/bbforpeace', 'https://twitter.com/bbforpeace', 'https://instagram.com/bbforpeace', 'https://youtube.com/@bbforpeace', 'https://linkedin.com/company/bbforpeace', NOW(), NOW())")
    console.log('  social_media_settings seeded')
  } else console.log('  social_media_settings: already has data')

  const csCount = await c.query('SELECT COUNT(*) as cnt FROM contact_settings')
  if (+csCount.rows[0].cnt === 0) {
    await c.query("INSERT INTO contact_settings (id, contact_email, phone, phone_alt, address, updated_at, created_at) VALUES (1, 'info@bbforpeace.org', '+234-8054151494', '+234-8167890123', '256, 1st Avenue, FHA, Lugbe, Abuja, Nigeria', NOW(), NOW())")
    console.log('  contact_settings seeded')
  } else console.log('  contact_settings: already has data')

  const awCount = await c.query('SELECT COUNT(*) as cnt FROM award_settings')
  if (+awCount.rows[0].cnt === 0) {
    await c.query("INSERT INTO award_settings (id, updated_at, created_at) VALUES (1, NOW(), NOW())")
    try {
      const nextId1 = await c.query("SELECT COALESCE(MAX(id), 0) + 1 as nid FROM award_settings_awards")
      await c.query("INSERT INTO award_settings_awards (id, title, year, issuer, _parent_id, _order) VALUES ($1, 'National Youth Development Award', 2025, 'Federal Ministry of Youth Development', 1, 1)", [nextId1.rows[0].nid])
      const nextId2 = await c.query("SELECT COALESCE(MAX(id), 0) + 1 as nid FROM award_settings_awards")
      await c.query("INSERT INTO award_settings_awards (id, title, year, issuer, _parent_id, _order) VALUES ($1, 'Best Young Peacebuilding Organisation', 2023, 'WANEP-Nigeria', 1, 2)", [nextId2.rows[0].nid])
      console.log('  award_settings seeded')
    } catch (e) { console.log('  award_settings sub-table:', e.message) }
  } else console.log('  award_settings: already has data')

  const ssCount = await c.query('SELECT COUNT(*) as cnt FROM site_settings')
  if (+ssCount.rows[0].cnt === 0) {
    const ssCols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'site_settings'")
    const colNames = ssCols.rows.map(r => r.column_name)
    const fields = [['id', '1'], ['updated_at', 'NOW()'], ['created_at', 'NOW()']]
    if (colNames.includes('site_name')) fields.push(['site_name', "'BBFORPEACE'"])
    if (colNames.includes('site_tagline')) fields.push(['site_tagline', "'Building Blocks for Peace Foundation'"])
    if (colNames.includes('contact_email')) fields.push(['contact_email', "'info@bbforpeace.org'"])
    if (colNames.includes('phone')) fields.push(['phone', "'+234-8054151494'"])
    if (colNames.includes('address')) fields.push(['address', "'256, 1st Avenue, FHA, Lugbe, Abuja, Nigeria'"])
    await c.query('INSERT INTO site_settings (' + fields.map(f => f[0]).join(', ') + ') VALUES (' + fields.map(f => f[1]).join(', ') + ')')
    console.log('  site_settings seeded')
  } else console.log('  site_settings: already has data')

  // ==============================
  // 3. SEED TEAM MEMBERS
  // ==============================
  console.log('\n=== 3. Seeding team members ===')
  const teamCount = await c.query('SELECT COUNT(*) as cnt FROM team')
  if (+teamCount.rows[0].cnt === 0) {
    const staffPhotos = [
      { fn: '1. Rafiu Adeniran Lawal, Executive Director.jpeg', url: '/images/ourteam/1. Rafiu Adeniran Lawal, Executive Director.jpeg' },
      { fn: '2. Anthonia Folashade, Communications Manager.png', url: '/images/ourteam/2. Anthonia Folashade, Communications Manager.png' },
      { fn: '3. Eseimokumo Albert, Project Officer (Youth, Peace and Security).jpeg', url: '/images/ourteam/3. Eseimokumo Albert, Project Officer (Youth, Peace and Security).jpeg' },
      { fn: '4. Mercy Oyip, Wellbeing and Admin Assistant.jpeg', url: '/images/ourteam/4. Mercy Oyip, Wellbeing and Admin Assistant.jpeg' },
      { fn: '5. Samson Shabu, Project Officer (Climate, Peace and Security).jpeg', url: '/images/ourteam/5. Samson Shabu, Project Officer (Climate, Peace and Security).jpeg' },
      { fn: '6. Project Intern (Gender, Monitoring and Evaluation).jpeg', url: '/images/ourteam/6. Project Intern (Gender, Monitoring and Evaluation).jpeg' },
    ]
    const boardPhotos = [
      { fn: 'Professor Charles Ukeje (Board Chair).png', url: '/images/board/Professor Charles Ukeje (Board Chair).png' },
      { fn: 'Rafiu Adeniran Lawal (Board Secretary).jpeg', url: '/images/board/Rafiu Adeniran Lawal (Board Secretary).jpeg' },
      { fn: 'Lantana Bako Abdullahi (Member).jpeg', url: '/images/board/Lantana Bako Abdullahi (Member).jpeg' },
      { fn: 'Mautin Akapo, ACA, ACTI (Member).jpeg', url: '/images/board/Mautin Akapo, ACA, ACTI (Member).jpeg' },
      { fn: 'Olayinka Risikat Lawal (Member).jpeg', url: '/images/board/Olayinka Risikat Lawal (Member).jpeg' },
      { fn: 'Princess Moyinoluwa Olubunmi Falowo (Member).jpeg', url: '/images/board/Princess Moyinoluwa Olubunmi Falowo (Member).jpeg' },
    ]

    const staffIds = []
    for (const p of staffPhotos) staffIds.push(await insertMediaIfNotExists(p.fn, p.url, p.fn.endsWith('.png') ? 'image/png' : 'image/jpeg'))
    const boardIds = []
    for (const p of boardPhotos) boardIds.push(await insertMediaIfNotExists(p.fn, p.url, p.fn.endsWith('.png') ? 'image/png' : 'image/jpeg'))

    const teamCols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'team'")
    const hasSocialLinkedin = teamCols.rows.some(r => r.column_name === 'social_links_linkedin')

    const staff = [
      { name: 'Rafiu Adeniran Lawal', position: 'Executive Director', shortBio: 'Founder of BBFORPEACE with extensive experience in youth peacebuilding, policy advocacy, and regional networking across West Africa.', email: 'r.lawal@bbforpeace.org' },
      { name: 'Anthonia Folashade', position: 'Communications Manager', shortBio: 'Passionate about storytelling for social change and amplifying youth voices across media platforms.', email: 'comms@bbforpeace.org' },
      { name: 'Eseimokumo Albert', position: 'Project Officer (Youth, Peace and Security)', shortBio: 'Expert in youth engagement and peacebuilding program design and implementation.', email: 'yps@bbforpeace.org' },
      { name: 'Mercy Oyip', position: 'Wellbeing and Admin Assistant', shortBio: 'Ensuring organizational wellbeing and smooth administrative operations.', email: 'admin@bbforpeace.org' },
      { name: 'Samson Shabu', position: 'Project Officer (Climate, Peace and Security)', shortBio: 'Focused on the nexus between climate change, environmental security, and peacebuilding.', email: 'climate@bbforpeace.org' },
      { name: 'Project Intern', position: 'Gender, Monitoring and Evaluation', shortBio: 'Supporting gender mainstreaming and monitoring & evaluation across all programs.', email: 'me@bbforpeace.org' },
    ]

    for (let i = 0; i < staff.length; i++) {
      await c.query(
        'INSERT INTO team (name, position, short_bio, email, category, "order", is_active, photo_id, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, true, $7, NOW(), NOW())',
        [staff[i].name, staff[i].position, staff[i].shortBio, staff[i].email, 'staff', i + 1, staffIds[i]]
      )
      console.log('  Staff:', staff[i].name)
    }

    if (hasSocialLinkedin) {
      await c.query("UPDATE team SET social_links_linkedin = '#', social_links_twitter = '#' WHERE name = 'Rafiu Adeniran Lawal' AND category = 'staff'")
    }

    const board = [
      { name: 'Professor Charles Ukeje', position: 'Board Chair', shortBio: 'Professor of International Relations at Obafemi Awolowo University with global research experience.' },
      { name: 'Rafiu Adeniran Lawal', position: 'Board Secretary', shortBio: "Founder and Executive Director of BBFORPEACE. Master's in Peace and Conflict Studies from University of Ibadan." },
      { name: 'Lantana Bako Abdullahi', position: 'Member', shortBio: 'Extensive experience in mediation and interreligious dialogues. Member of African Union FEMWISE.' },
      { name: 'Mautin Akapo, ACA, ACTI', position: 'Member', shortBio: 'Principal at MHL & Associates with 15 years of experience in tax, accounting, and grants management.' },
      { name: 'Olayinka Risikat Lawal', position: 'Member', shortBio: 'Nigerian Business Administrator, Philanthropist, and Managing Director of Albarka Group of Companies.' },
      { name: 'Princess Moyinoluwa Olubunmi Falowo', position: 'Member', shortBio: 'Former Regent at Ibule-Soro Kingdom focusing on grassroots community development initiatives.' },
    ]

    for (let i = 0; i < board.length; i++) {
      await c.query(
        'INSERT INTO team (name, position, short_bio, category, "order", is_active, photo_id, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, true, $6, NOW(), NOW())',
        [board[i].name, board[i].position, board[i].shortBio, 'board', i + 1, boardIds[i]]
      )
      console.log('  Board:', board[i].name)
    }
  } else console.log('  Team already has', teamCount.rows[0].cnt, 'members')

  // ==============================
  // 4. SEED PROGRAMMES
  // ==============================
  console.log('\n=== 4. Seeding programmes ===')
  const progCount = await c.query('SELECT COUNT(*) as cnt FROM programmes')
  if (+progCount.rows[0].cnt === 0) {
    const programmes = [
      { title: 'Peace Education & Youth Empowerment', slug: 'peace-education-youth-empowerment', icon: 'BookOpen', imgId: 1, desc: 'Integrating peace education into school curricula and empowering young people with leadership skills, conflict resolution techniques, and advocacy training.',
        obj: ['Train educators in peace education methodologies', 'Establish youth peace clubs across communities', 'Develop localized peace education curriculum'],
        ach: [{ t: 'Youth Trained', m: '5,000+ youth trained' }, { t: 'Peace Clubs', m: '75 youth peace clubs established' }, { t: 'Schools', m: 'Curriculum adopted in 25+ schools' }] },
      { title: 'Conflict Prevention, Governance & Accountability', slug: 'conflict-prevention-governance', icon: 'Shield', imgId: 3, desc: 'Facilitating constructive conversations between diverse community groups, building early warning systems, and promoting transparent governance.',
        obj: ['Conduct community dialogues annually', 'Train dialogue facilitators', 'Establish early warning systems'],
        ach: [{ t: 'Dialogues', m: '150+ community dialogues held' }, { t: 'Facilitators', m: '120 trained facilitators' }, { t: 'Communities', m: '15 communities with early warning' }] },
      { title: 'Gender, Climate & Environmental Security', slug: 'gender-climate-environmental-security', icon: 'Leaf', imgId: 6, desc: 'Supporting women as key actors in peacebuilding and addressing the nexus between climate change, environmental degradation, and conflict.',
        obj: ['Train women in conflict resolution', 'Support women-led peace initiatives', 'Advocate for gender-inclusive peace processes'],
        ach: [{ t: 'Women Trained', m: '250+ women trained' }, { t: 'Initiatives', m: '80 initiatives supported' }, { t: 'Campaigns', m: '5 policy advocacy campaigns' }] },
      { title: 'Organizational Sustainability & Partnerships', slug: 'organizational-sustainability-partnerships', icon: 'Globe', imgId: 2, desc: 'Building strategic partnerships with local and international organizations to expand our reach and ensure long-term sustainability.',
        obj: ['Expand regional network across West Africa', 'Strengthen GPPAC secretariat role', 'Develop sustainable funding models'],
        ach: [{ t: 'Secretariat', m: 'GPPAC West Africa Secretariat' }, { t: 'Network', m: 'WAYPAN Regional Network' }, { t: 'Membership', m: 'Member of UNOY' }] },
      { title: 'Livelihoods & Humanitarian', slug: 'livelihoods-humanitarian', icon: 'Heart', imgId: 4, desc: 'Providing economic empowerment opportunities and humanitarian support to conflict-affected communities.',
        obj: ['Economic empowerment for vulnerable youth', 'Humanitarian response in conflict zones', 'Livelihood support programs'],
        ach: [{ t: 'Workshops', m: 'Economic training workshops' }, { t: 'Aid', m: 'Humanitarian aid distribution' }, { t: 'Support', m: 'Community support initiatives' }] },
    ]

    for (let i = 0; i < programmes.length; i++) {
      const p = programmes[i]
      const r = await c.query(
        'INSERT INTO programmes (title, slug, icon, short_description, content, featured_image_id, status, "order", is_featured, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING id',
        [p.title, p.slug, p.icon, p.desc, lexical(p.desc), p.imgId, 'active', i + 1, i === 0]
      )
      const pid = r.rows[0].id
      for (let j = 0; j < p.obj.length; j++) {
        try { await c.query('INSERT INTO programmes_objectives (objective, _parent_id, _order) VALUES ($1, $2, $3)', [p.obj[j], pid, j + 1]) } catch (e) {}
      }
      for (let j = 0; j < p.ach.length; j++) {
        try { await c.query('INSERT INTO programmes_achievements (title, metric, _parent_id, _order) VALUES ($1, $2, $3, $4)', [p.ach[j].t, p.ach[j].m, pid, j + 1]) } catch (e) {}
      }
      console.log('  Programme:', p.title)
    }
  } else console.log('  Programmes already has', progCount.rows[0].cnt, 'entries')

  // ==============================
  // 5. SEED PROJECT REPORTS
  // ==============================
  console.log('\n=== 5. Seeding project reports ===')
  const prCount = await c.query("SELECT COUNT(*) as cnt FROM publications WHERE sub_menu = 'project-report'")
  if (+prCount.rows[0].cnt === 0) {
    // Create placeholder file media entries for each project report
    const fileIds = []
    for (let i = 1; i <= 4; i++) {
      const fn = `project-report-placeholder-${i}.pdf`
      const fid = await insertMediaIfNotExists(fn, `/documents/${fn}`, 'application/pdf', `Project Report ${i}`)
      fileIds.push(fid)
    }

    const reports = [
      { title: 'Youth-Led Peacebuilding in North-Central Nigeria', slug: 'youth-led-peacebuilding-north-central-nigeria', excerpt: 'A comprehensive documentation of youth-led peacebuilding interventions in farmer-herder conflict zones across Benue and Nasarawa states.', year: 2025, category: 'research', coverImageId: 8 },
      { title: 'Champions of Peace: Social Media for Conflict Prevention', slug: 'champions-of-peace-social-media', excerpt: 'Project report documenting the impact of social media advocacy training for young peacebuilders in preventing violent extremism online.', year: 2024, category: 'report', coverImageId: 5 },
      { title: 'WAYPAN Regional Assessment Report', slug: 'waypan-regional-assessment', excerpt: 'Assessment of youth protection mechanisms across West Africa, including policy recommendations for strengthening youth participation.', year: 2024, category: 'research', coverImageId: 10 },
      { title: 'Community Dialogue Series: Building Bridges', slug: 'community-dialogue-series-building-bridges', excerpt: 'Documentation of the Community Dialogue Series program, methodologies, outcomes, and best practices for inter-community dialogue.', year: 2023, category: 'report', coverImageId: 3 },
    ]

    for (let i = 0; i < reports.length; i++) {
      const r = reports[i]
      await c.query(
        "INSERT INTO publications (title, slug, excerpt, description, year, category, sub_menu, menu_section, cover_image_id, file_id, is_featured, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, 'project-report', 'report', $7, $8, false, NOW(), NOW())",
        [r.title, r.slug, r.excerpt, lexical(r.excerpt), r.year, r.category, r.coverImageId, fileIds[i]]
      )
      console.log('  Project Report:', r.title.substring(0, 50))
    }
  } else console.log('  Project reports already exist:', prCount.rows[0].cnt)

  // ==============================
  // FINAL VERIFICATION
  // ==============================
  console.log('\n=== Final counts ===')
  const checks = [
    ['general_settings', 'SELECT COUNT(*) as cnt FROM general_settings'],
    ['footer_settings', 'SELECT COUNT(*) as cnt FROM footer_settings'],
    ['team (staff)', "SELECT COUNT(*) as cnt FROM team WHERE category = 'staff'"],
    ['team (board)', "SELECT COUNT(*) as cnt FROM team WHERE category = 'board'"],
    ['programmes', 'SELECT COUNT(*) as cnt FROM programmes'],
    ['publications', "SELECT COUNT(*) as cnt FROM publications WHERE sub_menu = 'publication'"],
    ['annual-reports', "SELECT COUNT(*) as cnt FROM publications WHERE sub_menu = 'annual-report'"],
    ['project-reports', "SELECT COUNT(*) as cnt FROM publications WHERE sub_menu = 'project-report'"],
  ]
  for (const [name, query] of checks) {
    const r = await c.query(query)
    console.log('  ' + name + ': ' + r.rows[0].cnt)
  }

  const gsCols = await c.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'general_settings' ORDER BY ordinal_position")
  console.log('\n  general_settings columns:', gsCols.rows.map(r => r.column_name + '(' + r.data_type.substring(0, 7) + ')').join(', '))

  console.log('\nDone!')
  await c.end()
})()
