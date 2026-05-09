const { Client } = require('pg');

const DATABASE_URI = 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';

async function main() {
  const client = new Client({ connectionString: DATABASE_URI });
  await client.connect();
  console.log('Connected.\n');

  const tables = ['posts', 'events', 'publications', 'media', 'categories'];
  for (const tbl of tables) {
    const r = await client.query(
      `SELECT column_name, data_type, is_nullable, column_default 
       FROM information_schema.columns 
       WHERE table_name = $1 
       ORDER BY ordinal_position`,
      [tbl]
    );
    console.log(`=== ${tbl} (${r.rows.length} cols) ===`);
    r.rows.forEach(col => {
      console.log(`  ${col.column_name} | ${col.data_type} | null:${col.is_nullable} | def:${col.column_default || 'none'}`);
    });
    console.log('');
  }

  // Check enums relevant to posts
  const enums = await client.query(
    `SELECT t.typname, e.enumlabel 
     FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid 
     WHERE t.typname LIKE 'enum_posts%' OR t.typname LIKE 'enum_events%' OR t.typname LIKE 'enum_publications%'
     ORDER BY t.typname, e.enumsortorder`
  );
  console.log('=== RELEVANT ENUMS ===');
  let currentEnum = '';
  enums.rows.forEach(row => {
    if (row.typname !== currentEnum) {
      currentEnum = row.typname;
      process.stdout.write(`\n  ${row.typname}: `);
    }
    process.stdout.write(`${row.enumlabel}, `);
  });
  console.log('\n');

  // Row counts
  const countTables = ['posts', 'events', 'publications', 'media', 'categories', 'testimonials', 'gallery_items', 'tags'];
  for (const tbl of countTables) {
    try {
      const r = await client.query(`SELECT count(*) FROM ${tbl}`);
      console.log(`${tbl}: ${r.rows[0].count} rows`);
    } catch (e) {
      console.log(`${tbl}: ERROR - ${e.message}`);
    }
  }

  // Check if any categories exist
  const cats = await client.query('SELECT id, name FROM categories LIMIT 20');
  console.log('\nExisting categories:', cats.rows);

  // Check posts_rels table structure
  const relsCheck = await client.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'posts_rels' ORDER BY ordinal_position`
  );
  console.log('\n=== posts_rels ===');
  relsCheck.rows.forEach(col => console.log(`  ${col.column_name} | ${col.data_type}`));

  await client.end();
}

main().catch(console.error);
