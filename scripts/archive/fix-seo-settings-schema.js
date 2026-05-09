/**
 * Add new SEO settings columns to the seo_settings table.
 * Required because push:false in production.
 */
const { Client } = require('pg')

const DATABASE_URL =
  process.env.DATABASE_URI ||
  'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres'

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log('Connected to database')

  // Check existing columns
  const { rows: cols } = await client.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'seo_settings'`
  )
  const existing = new Set(cols.map((r) => r.column_name))
  console.log('Existing columns:', [...existing].join(', '))

  // Define the new columns we need
  const newColumns = [
    { name: 'title_template', type: 'varchar' },
    { name: 'keywords', type: 'varchar' },
    { name: 'canonical_url', type: 'varchar' },
    // Open Graph group
    { name: 'og_site_name', type: 'varchar' },
    { name: 'og_title', type: 'varchar' },
    { name: 'og_description', type: 'varchar' },
    { name: 'og_image_id', type: 'integer' },
    { name: 'og_locale', type: 'varchar' },
    // Twitter group
    { name: 'twitter_card', type: 'varchar' },
    { name: 'twitter_title', type: 'varchar' },
    { name: 'twitter_description', type: 'varchar' },
    { name: 'twitter_handle', type: 'varchar' },
    { name: 'twitter_image_id', type: 'integer' },
    // Robots group
    { name: 'robots_index', type: 'boolean DEFAULT true' },
    { name: 'robots_follow', type: 'boolean DEFAULT true' },
    // Verification group
    { name: 'verification_google', type: 'varchar' },
    { name: 'verification_bing', type: 'varchar' },
  ]

  let added = 0
  for (const col of newColumns) {
    if (!existing.has(col.name)) {
      const sql = `ALTER TABLE seo_settings ADD COLUMN "${col.name}" ${col.type}`
      console.log(`  Adding column: ${col.name}`)
      await client.query(sql)
      added++
    } else {
      console.log(`  Already exists: ${col.name}`)
    }
  }

  console.log(`\nDone. Added ${added} new columns.`)
  await client.end()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
