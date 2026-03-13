const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()

  // 1. general_settings columns
  const gs = await c.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='general_settings' ORDER BY ordinal_position`)
  console.log('=== general_settings columns ===')
  gs.rows.forEach(r => console.log(' ', r.column_name, '-', r.data_type))

  // 2. general_settings data
  const gsData = await c.query('SELECT * FROM general_settings LIMIT 1')
  console.log('\n=== general_settings data ===')
  if (gsData.rows[0]) console.log(JSON.stringify(gsData.rows[0], null, 2))
  else console.log('  NO DATA')

  // 3. media URLs
  const media = await c.query('SELECT id, url, filename FROM media ORDER BY id LIMIT 10')
  console.log('\n=== media samples (first 10) ===')
  media.rows.forEach(r => console.log(' ', r.id, '|', r.url, '|', r.filename))

  // 4. posts with featured images
  const posts = await c.query('SELECT p.id, p.title, p.featured_image_id, m.url as img_url FROM posts p LEFT JOIN media m ON p.featured_image_id = m.id ORDER BY p.id')
  console.log('\n=== posts + images ===')
  posts.rows.forEach(r => console.log(' ', r.id, '|', (r.title || '').substring(0, 35), '| img_id:', r.featured_image_id, '| url:', r.img_url))

  // 5. events with images
  const events = await c.query('SELECT e.id, e.title, e.featured_image_id, m.url as img_url FROM events e LEFT JOIN media m ON e.featured_image_id = m.id ORDER BY e.id')
  console.log('\n=== events + images ===')
  events.rows.forEach(r => console.log(' ', r.id, '|', (r.title || '').substring(0, 35), '| img_id:', r.featured_image_id, '| url:', r.img_url))

  // 6. publications
  const pubs = await c.query('SELECT id, title, sub_menu, cover_image_id FROM publications ORDER BY id')
  console.log('\n=== publications ===')
  pubs.rows.forEach(r => console.log(' ', r.id, '|', (r.title || '').substring(0, 40), '| sub_menu:', r.sub_menu, '| cover_img:', r.cover_image_id))

  // 7. footer_settings columns
  const fs = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name='footer_settings' ORDER BY ordinal_position`)
  console.log('\n=== footer_settings columns ===')
  console.log(fs.rows.map(r => r.column_name).join(', '))

  await c.end()
})()
