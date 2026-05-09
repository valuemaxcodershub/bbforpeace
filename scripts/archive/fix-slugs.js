/**
 * Fix bad slugs in publications table.
 * Converts any slug that contains spaces, uppercase, or special chars into a URL-friendly format.
 * Run once: node scripts/fix-slugs.js
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
  console.log('Connected. Checking for bad slugs...\n')

  const { rows } = await c.query('SELECT id, title, slug FROM publications ORDER BY id')

  let fixed = 0
  for (const row of rows) {
    const clean = slugify(row.slug)
    if (clean !== row.slug) {
      console.log(`  ID ${row.id}: "${row.slug}"`)
      console.log(`       -> "${clean}"`)
      await c.query('UPDATE publications SET slug = $1 WHERE id = $2', [clean, row.id])
      fixed++
    }
  }

  if (fixed === 0) {
    console.log('All slugs are already clean!')
  } else {
    console.log(`\nFixed ${fixed} slug(s).`)
  }

  await c.end()
})()
