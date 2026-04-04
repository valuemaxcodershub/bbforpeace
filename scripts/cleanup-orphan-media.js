/**
 * Clean up orphan media DB records after Blob files were manually deleted.
 * These media records no longer have corresponding Blob files.
 */
const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

// Media IDs whose Blob files were manually deleted
const ORPHAN_IDS = [105, 106, 107, 109, 111, 112, 113, 116];

async function main() {
  await c.connect();

  // Safety: confirm none are referenced by publications
  const refs = await c.query(
    'SELECT id, title, file_id, cover_image_id FROM publications WHERE file_id = ANY($1) OR cover_image_id = ANY($1)',
    [ORPHAN_IDS]
  );
  if (refs.rows.length > 0) {
    console.error('ABORT: Some IDs still referenced:');
    refs.rows.forEach(r => console.error(`  Pub [${r.id}] file=${r.file_id} cover=${r.cover_image_id}`));
    await c.end();
    process.exit(1);
  }

  // Check columns in locked docs rels table
  const cols = await c.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='payload_locked_documents_rels' ORDER BY ordinal_position"
  );
  console.log('locked_documents_rels columns:', cols.rows.map(r => r.column_name));

  // Find the media-related column
  const mediaCol = cols.rows.find(r => r.column_name.includes('media'));
  const mediaColName = mediaCol ? mediaCol.column_name : null;
  console.log('Media column:', mediaColName);

  // Delete locked doc refs
  if (mediaColName) {
    const locked = await c.query(`DELETE FROM payload_locked_documents_rels WHERE "${mediaColName}" = ANY($1)`, [ORPHAN_IDS]);
    console.log(`Deleted ${locked.rowCount} locked_documents_rels rows`);
  }

  // Delete locked docs pointing to these media
  // (may not exist, just try)
  try {
    const lockedDocs = await c.query(
      "DELETE FROM payload_locked_documents WHERE document_id::text = ANY($1)",
      [ORPHAN_IDS.map(String)]
    );
    console.log(`Deleted ${lockedDocs.rowCount} locked_documents rows`);
  } catch (e) {
    console.log(`  locked_documents cleanup skipped: ${e.message}`);
  }

  // Delete media records
  for (const id of ORPHAN_IDS) {
    try {
      await c.query('DELETE FROM media WHERE id = $1', [id]);
      console.log(`✓ Deleted media [${id}]`);
    } catch (e) {
      console.error(`✗ Failed media [${id}]: ${e.message}`);
    }
  }

  // Final count
  const final = await c.query('SELECT COUNT(*) as total, ROUND(SUM(filesize)/1024.0/1024.0, 2) as total_mb FROM media');
  console.log(`\nRemaining: ${final.rows[0].total} files, ${final.rows[0].total_mb} MB in DB`);

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
