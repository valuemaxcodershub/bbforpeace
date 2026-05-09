const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  const updates = [
    // Annual report covers -> reports/ subfolder
    { id: 11, prefix: 'reports/' },
    { id: 12, prefix: 'reports/' },
    // Team member photos -> ourteam/ subfolder
    { id: 23, prefix: 'ourteam/' },
    { id: 24, prefix: 'ourteam/' },
    { id: 25, prefix: 'ourteam/' },
    { id: 26, prefix: 'ourteam/' },
    { id: 27, prefix: 'ourteam/' },
    { id: 28, prefix: 'ourteam/' },
    // Board member photos -> board/ subfolder
    { id: 29, prefix: 'board/' },
    { id: 30, prefix: 'board/' },
    { id: 31, prefix: 'board/' },
    { id: 32, prefix: 'board/' },
    { id: 33, prefix: 'board/' },
    { id: 34, prefix: 'board/' },
  ];

  for (const u of updates) {
    const res = await c.query(
      `UPDATE media SET filename = $1 || filename WHERE id = $2 AND filename NOT LIKE $1 || '%' RETURNING id, filename`,
      [u.prefix, u.id]
    );
    if (res.rows.length > 0) {
      console.log('Updated ID', res.rows[0].id, '->', res.rows[0].filename);
    } else {
      console.log('Skipped ID', u.id, '(already has prefix or not found)');
    }
  }

  // Verify
  const check = await c.query(
    'SELECT id, filename FROM media WHERE id IN (11,12,23,24,25,26,27,28,29,30,31,32,33,34) ORDER BY id'
  );
  console.log('\nFinal state:');
  check.rows.forEach((r) => console.log(r.id, '|', r.filename));

  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
