const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()

  // Check footer_settings columns
  const fs = await c.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'footer_settings' 
    ORDER BY ordinal_position
  `)
  console.log('\n=== footer_settings columns ===')
  fs.rows.forEach(r => console.log(r.column_name, '|', r.data_type))

  // Check payload_locked_documents_rels columns
  const pld = await c.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'payload_locked_documents_rels' 
    ORDER BY ordinal_position
  `)
  console.log('\n=== payload_locked_documents_rels columns ===')
  pld.rows.forEach(r => console.log(r.column_name, '|', r.data_type))

  await c.end()
})()
