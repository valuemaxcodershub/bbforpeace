const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // Fix publication 27: clear file_id, set external URL
  const r = await c.query(
    'UPDATE publications SET file_id = NULL, external_file_url = $1 WHERE id = 27 RETURNING id, file_id, external_file_url',
    ['https://drive.google.com/file/d/1Ho9ah1hRT50CwdkQRG8aAksbfo1sxFfQ/view']
  );
  console.log('Fixed:', r.rows[0]);

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
