const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()
  
  // Check tables exist
  const r = await c.query(`SELECT table_name FROM information_schema.tables WHERE table_name IN ('testimonials','gallery_items') ORDER BY table_name`)
  console.log('Tables found:', r.rows.map(r => r.table_name))
  
  // Try adding FK for testimonials
  try {
    await c.query(`ALTER TABLE payload_locked_documents_rels ADD CONSTRAINT fk_pld_testimonials FOREIGN KEY (testimonials_id) REFERENCES testimonials(id) ON DELETE CASCADE`)
    console.log('✅ FK for testimonials_id added')
  } catch (e) {
    if (e.code === '42710') console.log('⏭️  FK for testimonials_id already exists')
    else console.error('❌ FK testimonials:', e.code, e.message)
  }
  
  // Verify all columns now exist
  const cols = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'payload_locked_documents_rels' AND column_name IN ('gallery_items_id','testimonials_id')`)
  console.log('Verified columns:', cols.rows.map(r => r.column_name))
  
  const fcols = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'footer_settings' ORDER BY ordinal_position`)
  console.log('footer_settings columns:', fcols.rows.map(r => r.column_name))
  
  await c.end()
})()
