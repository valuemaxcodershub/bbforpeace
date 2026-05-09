const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await client.connect();

  console.log('Adding missing columns to publications table...\n');

  // 1. Add 'region' column (text, nullable)
  try {
    await client.query(`ALTER TABLE publications ADD COLUMN region varchar`);
    console.log('✓ Added column: region (varchar)');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('  region already exists, skipping');
    } else {
      console.error('✗ region:', e.message);
    }
  }

  // 2. Add 'pages' column (numeric, nullable)
  try {
    await client.query(`ALTER TABLE publications ADD COLUMN pages numeric`);
    console.log('✓ Added column: pages (numeric)');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('  pages already exists, skipping');
    } else {
      console.error('✗ pages:', e.message);
    }
  }

  // 3. Add 'accent_color' column (enum type, nullable, default 'blue')
  // First create the enum type if it doesn't exist
  try {
    await client.query(`CREATE TYPE enum_publications_accent_color AS ENUM ('blue', 'emerald', 'purple', 'amber')`);
    console.log('✓ Created enum type: enum_publications_accent_color');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('  enum_publications_accent_color type already exists, skipping');
    } else {
      console.error('✗ enum type:', e.message);
    }
  }

  try {
    await client.query(`ALTER TABLE publications ADD COLUMN accent_color enum_publications_accent_color DEFAULT 'blue'`);
    console.log('✓ Added column: accent_color (enum, default blue)');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('  accent_color already exists, skipping');
    } else {
      console.error('✗ accent_color:', e.message);
    }
  }

  // Verify
  const cols = await client.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'publications' ORDER BY ordinal_position`
  );
  console.log('\n=== UPDATED PUBLICATIONS COLUMNS ===');
  cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

  // Quick test: try a query similar to what Payload would run
  try {
    const test = await client.query('SELECT id, title, region, pages, accent_color FROM publications LIMIT 3');
    console.log('\n=== TEST QUERY (with new columns) ===');
    test.rows.forEach(r => console.log(`  ${r.id}: region=${r.region}, pages=${r.pages}, accent_color=${r.accent_color}`));
    console.log('\n✓ All columns accessible!');
  } catch (e) {
    console.error('\n✗ Test query failed:', e.message);
  }

  await client.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
