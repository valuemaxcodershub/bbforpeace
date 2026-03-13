const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()

  // Check team data
  const team = await c.query('SELECT id, name, position, category, is_active, photo_id FROM team ORDER BY "order"')
  console.log('=== team (' + team.rows.length + ' rows) ===')
  team.rows.forEach(r => console.log(' ', r.id, '|', r.name, '|', r.position, '|', r.category, '| active:', r.is_active, '| photo:', r.photo_id))

  // Check programmes data
  const progs = await c.query('SELECT id, title, status, "order", slug FROM programmes ORDER BY "order"')
  console.log('\n=== programmes (' + progs.rows.length + ' rows) ===')
  progs.rows.forEach(r => console.log(' ', r.id, '|', r.title, '|', r.status, '| order:', r.order, '| slug:', r.slug))

  // Check partners_settings
  const ps = await c.query(`SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'partners_settings%' ORDER BY table_name`)
  console.log('\n=== partners_settings tables ===')
  ps.rows.forEach(r => console.log(' ', r.table_name))

  // Check partners_settings data
  try {
    const psData = await c.query('SELECT * FROM partners_settings LIMIT 1')
    console.log('\n=== partners_settings data ===')
    if (psData.rows[0]) console.log(JSON.stringify(psData.rows[0], null, 2))
    else console.log('  NO DATA')
  } catch (e) {
    console.log('  partners_settings table error:', e.message)
  }

  // Check partners_settings_items (sub-table)
  try {
    const items = await c.query('SELECT * FROM partners_settings_items')
    console.log('\n=== partners_settings_items (' + items.rows.length + ' rows) ===')
    items.rows.forEach(r => console.log(' ', r.id, '|', r.name, '| logo:', r.logo_id))
  } catch (e) {
    console.log('  partners_settings_items:', e.message)
  }

  // Check general_settings
  const gs = await c.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position', ['general_settings'])
  console.log('\n=== general_settings columns ===')
  gs.rows.forEach(r => console.log(' ', r.column_name, '-', r.data_type))
  
  const gsData = await c.query('SELECT * FROM general_settings LIMIT 1')
  console.log('\n=== general_settings data ===')
  console.log(gsData.rows.length ? JSON.stringify(gsData.rows[0]) : '  NO DATA')

  // Check ALL global tables existence & row count
  const allGlobals = [
    'site_settings', 'partners_settings', 'award_settings', 'footer_settings',
    'seo_settings', 'social_media_settings', 'contact_settings', 'general_settings',
    'home_page_settings', 'about_us_page_settings', 'programme_page_settings',
    'event_page_settings', 'media_page_settings', 'reports_settings', 'contact_us_page_settings'
  ]
  console.log('\n=== Global tables existence & data ===')
  for (const table of allGlobals) {
    try {
      const result = await c.query(`SELECT COUNT(*) as cnt FROM "${table}"`)
      console.log(' ', table, ':', result.rows[0].cnt, 'rows')
    } catch (e) {
      console.log(' ', table, ': TABLE MISSING')
    }
  }

  await c.end()
})()
