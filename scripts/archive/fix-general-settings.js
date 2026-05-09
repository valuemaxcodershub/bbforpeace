const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()
  console.log('Fixing general_settings.logo_alt column...\n')

  // 1. Drop the incorrect logo_alt_id column (integer FK — was from when logoAlt was type:'upload')
  try {
    await c.query('ALTER TABLE general_settings DROP COLUMN IF EXISTS logo_alt_id')
    console.log('✅ Dropped logo_alt_id (incorrect FK column)')
  } catch (e) {
    console.error('❌ Drop logo_alt_id:', e.message)
  }

  // 2. Add the correct logo_alt text column
  try {
    await c.query(`ALTER TABLE general_settings ADD COLUMN logo_alt varchar DEFAULT 'Building Blocks for Peace Foundation logo'`)
    console.log('✅ Added logo_alt (varchar) column')
  } catch (e) {
    if (e.code === '42701') console.log('⏭️  logo_alt already exists')
    else console.error('❌ Add logo_alt:', e.message)
  }

  // 3. Update existing row with default value
  await c.query(`UPDATE general_settings SET logo_alt = COALESCE(logo_alt, 'Building Blocks for Peace Foundation logo')`)
  console.log('✅ Default value set')

  // 4. Verify
  const r = await c.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'general_settings' ORDER BY ordinal_position`)
  console.log('\n=== Verified columns ===')
  r.rows.forEach(row => console.log(`  ${row.column_name} (${row.data_type})`))

  await c.end()
})()
