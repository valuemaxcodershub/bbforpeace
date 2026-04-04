const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // Total storage
  const total = await c.query(`SELECT COUNT(*) as total, ROUND(SUM(filesize)/1024.0/1024.0, 2) as total_mb FROM media`);
  console.log('=== TOTAL BLOB USAGE ===');
  console.log(`  ${total.rows[0].total} files, ${total.rows[0].total_mb} MB\n`);

  // By mime type
  const byType = await c.query(`SELECT mime_type, COUNT(*) as count, ROUND(SUM(filesize)/1024.0/1024.0, 2) as size_mb FROM media GROUP BY mime_type ORDER BY size_mb DESC`);
  console.log('=== BY FILE TYPE ===');
  byType.rows.forEach(r => console.log(`  ${r.mime_type}: ${r.count} files, ${r.size_mb} MB`));

  // Largest files
  const largest = await c.query(`SELECT id, filename, mime_type, ROUND(filesize/1024.0/1024.0, 2) as size_mb FROM media ORDER BY filesize DESC LIMIT 15`);
  console.log('\n=== LARGEST FILES ===');
  largest.rows.forEach(r => console.log(`  [${r.id}] ${r.size_mb} MB - ${r.filename} (${r.mime_type})`));

  // PDFs specifically (best candidates to move to Google Drive)
  const pdfs = await c.query(`SELECT id, filename, ROUND(filesize/1024.0/1024.0, 2) as size_mb FROM media WHERE mime_type = 'application/pdf' ORDER BY filesize DESC`);
  console.log('\n=== ALL PDFs (move to Google Drive) ===');
  pdfs.rows.forEach(r => console.log(`  [${r.id}] ${r.size_mb} MB - ${r.filename}`));

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
