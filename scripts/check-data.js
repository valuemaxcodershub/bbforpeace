const { Client } = require('pg')
const client = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await client.connect()

  // Check media URLs
  const m = await client.query('SELECT id, url, filename FROM media LIMIT 5')
  console.log('\n=== MEDIA URLs ===')
  m.rows.forEach(r => console.log(r.id, '|', r.url, '|', r.filename))

  // Check publications sub_menu values
  const p = await client.query('SELECT id, title, sub_menu, category FROM publications')
  console.log('\n=== PUBLICATIONS ===')
  p.rows.forEach(r => console.log(r.id, '|', r.title, '|', 'sub_menu=' + r.sub_menu, '|', 'cat=' + r.category))

  // Check posts sub_menu values
  const posts = await client.query('SELECT id, title, sub_menu, menu_section FROM posts')
  console.log('\n=== POSTS ===')
  posts.rows.forEach(r => console.log(r.id, '|', r.title, '|', 'sub_menu=' + r.sub_menu, '|', 'menu=' + r.menu_section))

  // Check events
  const e = await client.query('SELECT id, title, status, featured_image_id FROM events')
  console.log('\n=== EVENTS ===')
  e.rows.forEach(r => console.log(r.id, '|', r.title, '|', 'status=' + r.status, '|', 'img_id=' + r.featured_image_id))

  // Check what Payload stores as featured_image - check if it's populating
  const postWithImg = await client.query('SELECT p.id, p.title, p.featured_image_id, m.url as media_url FROM posts p LEFT JOIN media m ON p.featured_image_id = m.id LIMIT 3')
  console.log('\n=== POST+MEDIA JOIN ===')
  postWithImg.rows.forEach(r => console.log(r.id, '|', r.title, '|', 'img_id=' + r.featured_image_id, '|', 'url=' + r.media_url))

  const eventWithImg = await client.query('SELECT e.id, e.title, e.featured_image_id, m.url as media_url FROM events e LEFT JOIN media m ON e.featured_image_id = m.id LIMIT 3')
  console.log('\n=== EVENT+MEDIA JOIN ===')
  eventWithImg.rows.forEach(r => console.log(r.id, '|', r.title, '|', 'img_id=' + r.featured_image_id, '|', 'url=' + r.media_url))

  // Check publication cover images
  const pubWithImg = await client.query('SELECT p.id, p.title, p.cover_image_id, m.url as media_url FROM publications p LEFT JOIN media m ON p.cover_image_id = m.id LIMIT 3')
  console.log('\n=== PUB+MEDIA JOIN ===')
  pubWithImg.rows.forEach(r => console.log(r.id, '|', r.title, '|', 'img_id=' + r.cover_image_id, '|', 'url=' + r.media_url))

  // Check enums 
  const enums = await client.query("SELECT enum_range(NULL::enum_publications_sub_menu)")
  console.log('\n=== PUBLICATION SUB_MENU ENUM ===')
  console.log(enums.rows[0].enum_range)

  await client.end()
})()
