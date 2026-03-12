const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})
;(async () => {
  await c.connect()
  const r = await c.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'publications' ORDER BY ordinal_position")
  r.rows.forEach(row => console.log(row.column_name, '-', row.data_type))
  await c.end()
})()
