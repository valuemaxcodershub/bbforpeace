const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})
;(async () => {
  await c.connect()
  const r = await c.query('SELECT id, email, role FROM users')
  console.log('USERS:', JSON.stringify(r.rows, null, 2))
  await c.end()
})()
