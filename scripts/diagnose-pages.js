const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})
;(async () => {
  await c.connect()

  // Check posts columns
  const postsCols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name='posts' ORDER BY ordinal_position")
  console.log('posts columns:', postsCols.rows.map(r => r.column_name).join(', '))

  // Check Publications collection config field names vs DB columns
  const pubsCols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name='publications' ORDER BY ordinal_position")
  console.log('\npublications columns:', pubsCols.rows.map(r => r.column_name).join(', '))

  // Check events columns
  const eventsCols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name='events' ORDER BY ordinal_position")
  console.log('\nevents columns:', eventsCols.rows.map(r => r.column_name).join(', '))

  // Verify media URLs for the first 5 posts  
  const postMedia = await c.query(`
    SELECT p.id, p.title, p.sub_menu, p.status, m.url as image_url, m.filename 
    FROM posts p 
    LEFT JOIN media m ON p.featured_image_id = m.id 
    ORDER BY p.id LIMIT 5
  `)
  console.log('\n--- posts with images ---')
  postMedia.rows.forEach(r => console.log(`  [${r.id}] ${r.sub_menu} | ${r.status} | image: ${r.image_url}`))

  // Verify publications with images
  const pubMedia = await c.query(`
    SELECT p.id, p.title, p.sub_menu, m.url as cover_url 
    FROM publications p 
    LEFT JOIN media m ON p.cover_image_id = m.id 
    ORDER BY p.id
  `)
  console.log('\n--- publications with cover images ---')
  pubMedia.rows.forEach(r => console.log(`  [${r.id}] ${r.sub_menu} | cover: ${r.cover_url}`))

  // Check if Payload query for subMenu works 
  // by looking at what column name Payload maps to
  const postsHasSubMenu = postsCols.rows.some(r => r.column_name === 'sub_menu')
  const postsHasSubMenuCamel = postsCols.rows.some(r => r.column_name === 'subMenu')
  console.log('\n--- field name check ---')
  console.log('posts has sub_menu:', postsHasSubMenu)
  console.log('posts has subMenu:', postsHasSubMenuCamel)

  await c.end()
})()
