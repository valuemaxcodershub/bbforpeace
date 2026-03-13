const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await client.connect();

  // 1. Check publications table columns
  const cols = await client.query(
    `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'publications' ORDER BY ordinal_position`
  );
  console.log('=== PUBLICATIONS TABLE COLUMNS ===');
  cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}) nullable=${r.is_nullable}`));

  // 2. Check what Payload expects vs what DB has - check for missing FK columns
  const fks = await client.query(
    `SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
     FROM information_schema.table_constraints AS tc
     JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
     JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
     WHERE tc.table_name = 'publications' AND tc.constraint_type = 'FOREIGN KEY'`
  );
  console.log('\n=== PUBLICATIONS FOREIGN KEYS ===');
  fks.rows.forEach(r => console.log(`  ${r.column_name} -> ${r.foreign_table_name}(${r.foreign_column_name}) [${r.constraint_name}]`));

  // 3. Check the payload_locked_documents_rels for publications
  const rels = await client.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'payload_locked_documents_rels' ORDER BY ordinal_position`
  );
  console.log('\n=== payload_locked_documents_rels COLUMNS ===');
  rels.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

  // 4. Check if there's a _publications_rels table
  const tables = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%publication%' ORDER BY table_name`
  );
  console.log('\n=== TABLES CONTAINING "publication" ===');
  tables.rows.forEach(r => console.log(`  ${r.table_name}`));

  // 5. Try raw query to verify data is accessible
  const sample = await client.query('SELECT id, title, sub_menu FROM publications LIMIT 3');
  console.log('\n=== SAMPLE DATA (raw) ===');
  sample.rows.forEach(r => console.log(`  ${r.id}: ${r.title} [${r.sub_menu}]`));

  // 6. Check for any missing columns Payload might expect
  // Compare with typical Payload collection columns
  const expectedCols = [
    'id', 'title', 'slug', 'cover_image_id', 'file_id', 'description',
    'excerpt', 'category', 'menu_section', 'sub_menu', 'year', 'author',
    'region', 'pages', 'accent_color', 'download_count', 'is_featured',
    'updated_at', 'created_at'
  ];
  const actualCols = cols.rows.map(r => r.column_name);
  const missing = expectedCols.filter(c => !actualCols.includes(c));
  const extra = actualCols.filter(c => !expectedCols.includes(c));
  console.log('\n=== COLUMN COMPARISON ===');
  console.log('Missing from DB:', missing.length ? missing.join(', ') : 'none');
  console.log('Extra in DB:', extra.length ? extra.join(', ') : 'none');

  // 7. Check _rels table for publications (if exists)
  try {
    const pubRels = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'publications_rels' ORDER BY ordinal_position`
    );
    console.log('\n=== publications_rels COLUMNS ===');
    pubRels.rows.forEach(r => console.log(`  ${r.column_name}`));
  } catch (e) {
    console.log('\n=== publications_rels: does not exist ===');
  }

  // 8. Check the seo fields - they are a group type which creates separate columns
  const seoCols = actualCols.filter(c => c.includes('seo') || c.includes('meta'));
  console.log('\n=== SEO-RELATED COLUMNS ===');
  console.log(seoCols.length ? seoCols.join(', ') : 'none found');

  await client.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
