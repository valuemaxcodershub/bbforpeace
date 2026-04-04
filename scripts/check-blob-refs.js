const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // 1. Find all LAPA duplicate media IDs
  const lapaFiles = await c.query(`
    SELECT id, filename, ROUND(filesize/1024.0/1024.0, 2) as size_mb, url
    FROM media 
    WHERE filename ILIKE '%LAPA%' OR filename ILIKE '%Nasarawa%'
    ORDER BY id
  `);
  console.log('=== LAPA/Nasarawa files in media table ===');
  lapaFiles.rows.forEach(r => console.log(`  [${r.id}] ${r.size_mb} MB - ${r.filename}`));

  const lapaIds = lapaFiles.rows.map(r => r.id);

  // 2. Check which media IDs are referenced by publications
  const refs = await c.query(`
    SELECT p.id as pub_id, p.title, p.file_id, p.cover_image_id, p.external_file_url
    FROM publications p
    WHERE p.file_id = ANY($1) OR p.cover_image_id = ANY($1)
  `, [lapaIds]);
  console.log('\n=== Publications referencing LAPA media ===');
  refs.rows.forEach(r => console.log(`  Pub [${r.pub_id}] "${r.title}" -> file_id=${r.file_id}, cover=${r.cover_image_id}, extUrl=${r.external_file_url}`));

  // 3. Check other tables for references
  const lockedRefs = await c.query(`
    SELECT * FROM payload_locked_documents_rels WHERE media_id = ANY($1)
  `, [lapaIds]);
  console.log('\n=== Locked doc refs to LAPA media:', lockedRefs.rows.length, '===');

  // 4. Also check all publications that have file but could use external URL
  const allPubs = await c.query(`
    SELECT id, title, file_id, external_file_url, ROUND(
      (SELECT filesize FROM media WHERE id = publications.file_id) / 1024.0/1024.0, 2
    ) as file_mb
    FROM publications 
    WHERE file_id IS NOT NULL
    ORDER BY file_mb DESC NULLS LAST
  `);
  console.log('\n=== ALL publications with uploaded files ===');
  allPubs.rows.forEach(r => console.log(`  Pub [${r.id}] file_id=${r.file_id} (${r.file_mb} MB) extUrl=${r.external_file_url || 'none'} - "${r.title}"`));

  // 5. Find placeholder files
  const placeholders = await c.query(`
    SELECT id, filename, ROUND(filesize/1024.0/1024.0, 2) as size_mb
    FROM media WHERE filename ILIKE '%placeholder%'
    ORDER BY id
  `);
  console.log('\n=== Placeholder files ===');
  placeholders.rows.forEach(r => console.log(`  [${r.id}] ${r.size_mb} MB - ${r.filename}`));

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
