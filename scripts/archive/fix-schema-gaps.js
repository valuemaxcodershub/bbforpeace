const { Client } = require('pg')
const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  await c.connect()
  console.log('Connected. Adding missing columns...\n')

  // 1. footer_settings — add missing text columns
  const footerColumns = [
    ['quick_links_title', 'varchar', "'Quick Links'"],
    ['programmes_title', 'varchar', "'Programmes'"],
    ['contact_title', 'varchar', "'Contact'"],
    ['developed_by_text', 'varchar', "'Developed by'"],
    ['privacy_label', 'varchar', "'Privacy Policy'"],
    ['terms_label', 'varchar', "'Terms of Service'"],
  ]

  for (const [col, type, defaultVal] of footerColumns) {
    try {
      await c.query(`ALTER TABLE footer_settings ADD COLUMN "${col}" ${type} DEFAULT ${defaultVal}`)
      console.log(`✅ footer_settings.${col} added`)
    } catch (e) {
      if (e.code === '42701') {
        console.log(`⏭️  footer_settings.${col} already exists`)
      } else {
        console.error(`❌ footer_settings.${col}:`, e.message)
      }
    }
  }

  // Update existing row with defaults
  await c.query(`
    UPDATE footer_settings SET 
      quick_links_title = COALESCE(quick_links_title, 'Quick Links'),
      programmes_title = COALESCE(programmes_title, 'Programmes'),
      contact_title = COALESCE(contact_title, 'Contact'),
      developed_by_text = COALESCE(developed_by_text, 'Developed by'),
      privacy_label = COALESCE(privacy_label, 'Privacy Policy'),
      terms_label = COALESCE(terms_label, 'Terms of Service')
  `)
  console.log('✅ footer_settings defaults populated\n')

  // 2. payload_locked_documents_rels — add missing FK columns
  const relColumns = [
    'gallery_items_id',
    'testimonials_id',
  ]

  for (const col of relColumns) {
    try {
      await c.query(`ALTER TABLE payload_locked_documents_rels ADD COLUMN "${col}" integer`)
      console.log(`✅ payload_locked_documents_rels.${col} added`)
    } catch (e) {
      if (e.code === '42701') {
        console.log(`⏭️  payload_locked_documents_rels.${col} already exists`)
      } else {
        console.error(`❌ payload_locked_documents_rels.${col}:`, e.message)
      }
    }
  }

  // 3. Add indexes for the new FK columns (Payload expects these)
  for (const col of relColumns) {
    const indexName = `idx_pld_rels_${col}`
    try {
      await c.query(`CREATE INDEX IF NOT EXISTS "${indexName}" ON payload_locked_documents_rels ("${col}")`)
      console.log(`✅ Index ${indexName} created`)
    } catch (e) {
      console.error(`❌ Index ${indexName}:`, e.message)
    }
  }

  // 4. Add FK constraints (pointing to gallery_items and testimonials tables)
  try {
    await c.query(`ALTER TABLE payload_locked_documents_rels ADD CONSTRAINT fk_pld_gallery_items FOREIGN KEY (gallery_items_id) REFERENCES gallery_items(id) ON DELETE CASCADE`)
    console.log('✅ FK constraint for gallery_items_id added')
  } catch (e) {
    if (e.code === '42710') console.log('⏭️  FK for gallery_items_id already exists')
    else console.error('❌ FK gallery_items:', e.message)
  }

  try {
    await c.query(`ALTER TABLE payload_locked_documents_rels ADD CONSTRAINT fk_pld_testimonials FOREIGN KEY (testimonials_id) REFERENCES testimonials(id) ON DELETE CASCADE`)
    console.log('✅ FK constraint for testimonials_id added')
  } catch (e) {
    if (e.code === '42710') console.log('⏭️  FK for testimonials_id already exists')
    else console.error('❌ FK testimonials:', e.message)
  }

  console.log('\n✅ All schema patches applied.')
  await c.end()
})()
