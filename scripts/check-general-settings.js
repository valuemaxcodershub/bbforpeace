const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()

  // Check general_settings columns
  const r = await c.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'general_settings' 
    ORDER BY ordinal_position
  `)
  console.log('=== general_settings columns ===')
  r.rows.forEach(row => console.log(`  ${row.column_name} (${row.data_type})`))

  // Check current data
  const d = await c.query('SELECT * FROM general_settings LIMIT 1')
  if (d.rows.length) {
    console.log('\n=== current data ===')
    console.log(JSON.stringify(d.rows[0], null, 2))
  }

  await c.end()
})()
