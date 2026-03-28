/**
 * Fix remaining data issues:
 * 1. Empty slug for publication ID 8 (2024 Annual Report) 
 * 2. Mark placeholder PDF media entries with a clear indicator
 */
const { Client } = require('pg')
const c = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

;(async () => {
  await c.connect()
  console.log('Connected.\n')

  // 1. Fix empty slugs by generating from title
  const empty = await c.query("SELECT id, title, slug FROM publications WHERE slug = '' OR slug IS NULL")
  for (const row of empty.rows) {
    const newSlug = slugify(row.title)
    console.log(`Fix empty slug for ID ${row.id}: "${row.title}" -> "${newSlug}"`)
    await c.query('UPDATE publications SET slug = $1 WHERE id = $2', [newSlug, row.id])
  }
  if (empty.rows.length === 0) console.log('No empty slugs found.')

  // 2. Remove file references for placeholder PDFs (they don't actually exist)
  // This prevents broken download links on detail pages
  const placeholders = await c.query("SELECT id FROM media WHERE filename LIKE 'project-report-placeholder%'")
  if (placeholders.rows.length > 0) {
    const ids = placeholders.rows.map(r => r.id)
    const updated = await c.query('UPDATE publications SET file_id = NULL WHERE file_id = ANY($1) RETURNING id, title', [ids])
    console.log(`\nRemoved ${updated.rowCount} placeholder file references:`)
    for (const row of updated.rows) {
      console.log(`  ID ${row.id}: ${row.title}`)
    }
    
    // Delete the placeholder media entries themselves
    const deleted = await c.query('DELETE FROM media WHERE id = ANY($1)', [ids])
    console.log(`Deleted ${deleted.rowCount} placeholder media entries.`)
  } else {
    console.log('\nNo placeholder media entries found.')
  }

  console.log('\nDone!')
  await c.end()
})()
