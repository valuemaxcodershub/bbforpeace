// Check what gallery-items look like in DB and how media URLs are stored
const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})
;(async () => {
  await c.connect()

  // Gallery items and their images
  console.log('=== gallery_items ===')
  const gi = await c.query(`
    SELECT gi.id, gi.title, gi.media_type, gi.category, gi.status, gi.image_id, m.filename, m.url 
    FROM gallery_items gi 
    LEFT JOIN media m ON gi.image_id = m.id
    ORDER BY gi.id LIMIT 10
  `)
  gi.rows.forEach(r => console.log(`  [${r.id}] ${r.media_type} | ${r.category} | ${r.status} | img=${r.image_id} | url=${r.url} | fn=${r.filename}`))

  // All media entries to see URL pattern
  console.log('\n=== ALL media entries ===')
  const m = await c.query('SELECT id, filename, url FROM media ORDER BY id')
  m.rows.forEach(r => console.log(`  [${r.id}] ${r.url} | ${r.filename}`))

  // Check events with images
  console.log('\n=== events with images ===')
  const ev = await c.query(`
    SELECT e.id, e.title, e.status, e.featured_image_id, m.url, m.filename
    FROM events e
    LEFT JOIN media m ON e.featured_image_id = m.id
    ORDER BY e.id
  `)
  ev.rows.forEach(r => console.log(`  [${r.id}] ${r.status} | img=${r.featured_image_id} | url=${r.url}`))

  await c.end()
})()
