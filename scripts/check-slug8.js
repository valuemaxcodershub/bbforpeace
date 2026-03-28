const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})
;(async () => {
  await c.connect()
  const r = await c.query("SELECT id, title, slug FROM publications WHERE id = 8 OR slug = '' OR slug IS NULL")
  console.log(JSON.stringify(r.rows, null, 2))
  await c.end()
})()
