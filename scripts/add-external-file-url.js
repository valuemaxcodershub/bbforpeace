const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await client.connect();

  console.log('Adding external_file_url column to publications table...\n');

  try {
    await client.query(`ALTER TABLE publications ADD COLUMN external_file_url varchar`);
    console.log('✓ Added column: external_file_url (varchar)');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('  external_file_url already exists, skipping');
    } else {
      console.error('✗ external_file_url:', e.message);
    }
  }

  // Verify
  const { rows } = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'publications' AND column_name = 'external_file_url'
  `);
  console.log('\nVerification:', rows.length ? rows[0] : 'Column NOT found!');

  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
