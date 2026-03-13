const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()

  // All expected global table names (slug with hyphens → underscores)
  const expectedTables = [
    'site_settings', 'partners_settings', 'award_settings', 'footer_settings',
    'seo_settings', 'social_media_settings', 'contact_settings', 'general_settings',
    'home_page_settings', 'about_us_page_settings', 'programme_page_settings',
    'event_page_settings', 'media_page_settings', 'reports_settings', 'contact_us_page_settings'
  ]

  // Check which tables exist
  const tablesResult = await c.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1)`,
    [expectedTables]
  )
  const existingTables = tablesResult.rows.map(r => r.table_name)
  const missingTables = expectedTables.filter(t => !existingTables.includes(t))
  
  console.log('=== EXISTING global tables ===')
  console.log(existingTables.join(', '))
  console.log('\n=== MISSING global tables ===')
  console.log(missingTables.length ? missingTables.join(', ') : 'None missing')

  // For each existing table, check columns and row count
  for (const table of existingTables.sort()) {
    const cols = await c.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`,
      [table]
    )
    const count = await c.query(`SELECT COUNT(*) as cnt FROM "${table}"`)
    console.log(`\n=== ${table} (${count.rows[0].cnt} rows) ===`)
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`))
  }

  // Check all related _rels and array tables for globals
  const relTables = await c.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (
      table_name LIKE '%_settings_%' OR table_name LIKE '%_page_settings_%'
    ) ORDER BY table_name`
  )
  if (relTables.rows.length) {
    console.log('\n=== Related sub-tables ===')
    for (const r of relTables.rows) {
      if (existingTables.includes(r.table_name)) continue
      const count = await c.query(`SELECT COUNT(*) as cnt FROM "${r.table_name}"`)
      console.log(`  ${r.table_name} (${count.rows[0].cnt} rows)`)
    }
  }

  await c.end()
})()
