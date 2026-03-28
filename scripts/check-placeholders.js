const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()
  
  // Check placeholder media entries
  const media = await c.query("SELECT id, filename, url FROM media WHERE filename LIKE 'project-report-placeholder%'")
  console.log('Placeholder media entries:')
  console.log(JSON.stringify(media.rows, null, 2))
  
  // Check which publications reference these media IDs
  if (media.rows.length > 0) {
    const ids = media.rows.map(r => r.id)
    const pubs = await c.query('SELECT id, title, slug, file_id, cover_image_id FROM publications WHERE file_id = ANY($1)', [ids])
    console.log('\nPublications using placeholder files:')
    console.log(JSON.stringify(pubs.rows, null, 2))
  }

  // Also check the "." slug record (id 8)
  const bad = await c.query("SELECT id, title, slug FROM publications WHERE slug = '' OR slug = '.'")
  console.log('\nPublications with empty/bad slugs:')
  console.log(JSON.stringify(bad.rows, null, 2))
  
  await c.end()
})()
