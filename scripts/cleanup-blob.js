/**
 * Cleanup duplicate/orphan Blob files to reduce Vercel Blob usage.
 * 
 * Safe deletions:
 * - LAPA duplicates: IDs 105, 106, 107, 109, 111, 112, 113 (not referenced by any publication)
 * - Pub 27 already uses external URL, so its old file_id=115 is now NULL
 * - Pub 12 references file_id=114, so keep 114
 * - Placeholder PDFs: IDs 35, 37, 38 (36 is referenced by pub 11, skip it)
 * 
 * Total space freed: ~193 MB (from ~370 MB to ~177 MB)
 */
const { Client } = require('pg');
const { del } = require('@vercel/blob');

const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

// IDs safe to delete (not referenced by any publication)
const ORPHAN_LAPA_IDS = [105, 106, 107, 109, 111, 112, 113, 116];
// 115 was pub27's file but pub27 now has externalFileUrl and file_id=NULL
const FREED_FILE_IDS = [115];
// Placeholder PDFs not used (36 is referenced by pub 11, keep it)
const PLACEHOLDER_IDS = [35, 37, 38];

const ALL_DELETE_IDS = [...ORPHAN_LAPA_IDS, ...FREED_FILE_IDS, ...PLACEHOLDER_IDS];

async function main() {
  await c.connect();

  // Verify these IDs are NOT referenced by any publication
  const refs = await c.query(`
    SELECT id, title, file_id, cover_image_id 
    FROM publications 
    WHERE file_id = ANY($1) OR cover_image_id = ANY($1)
  `, [ALL_DELETE_IDS]);

  if (refs.rows.length > 0) {
    console.error('ABORT: Some IDs are still referenced by publications:');
    refs.rows.forEach(r => console.error(`  Pub [${r.id}] "${r.title}" -> file=${r.file_id}, cover=${r.cover_image_id}`));
    await c.end();
    process.exit(1);
  }
  console.log('✓ Safety check passed: No publications reference these media IDs\n');

  // Get URLs for Blob deletion
  const media = await c.query(`
    SELECT id, filename, url, ROUND(filesize/1024.0/1024.0, 2) as size_mb
    FROM media WHERE id = ANY($1) ORDER BY id
  `, [ALL_DELETE_IDS]);

  let totalFreed = 0;
  let deletedCount = 0;
  let failedCount = 0;

  for (const row of media.rows) {
    const sizeMb = parseFloat(row.size_mb) || 0;
    console.log(`Deleting [${row.id}] ${sizeMb} MB - ${row.filename}`);

    // Step 1: Delete from Vercel Blob (if URL exists)
    if (row.url) {
      try {
        await del(row.url);
        console.log(`  ✓ Blob deleted`);
      } catch (e) {
        console.log(`  ⚠ Blob delete failed (may already be gone): ${e.message}`);
      }
    }

    // Step 2: Delete locked_documents_rels referencing this media
    await c.query('DELETE FROM payload_locked_documents_rels WHERE media_id = $1', [row.id]);

    // Step 3: Delete from media table
    try {
      await c.query('DELETE FROM media WHERE id = $1', [row.id]);
      console.log(`  ✓ DB record deleted`);
      totalFreed += sizeMb;
      deletedCount++;
    } catch (e) {
      console.error(`  ✗ DB delete failed: ${e.message}`);
      failedCount++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  Deleted: ${deletedCount} files`);
  console.log(`  Failed: ${failedCount} files`);
  console.log(`  Space freed: ~${totalFreed.toFixed(1)} MB`);

  // Final count
  const final = await c.query(`SELECT COUNT(*) as total, ROUND(SUM(filesize)/1024.0/1024.0, 2) as total_mb FROM media`);
  console.log(`  Remaining: ${final.rows[0].total} files, ${final.rows[0].total_mb} MB`);

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
