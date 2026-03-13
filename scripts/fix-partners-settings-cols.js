const { Client } = require('pg');

const c = new Client({
  connectionString:
    'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // Check existing columns
  const cols = await c.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'partners_settings' ORDER BY ordinal_position
  `);
  const existing = cols.rows.map(r => r.column_name);
  console.log('Existing columns:', existing.join(', '));

  // Required columns from the global config
  const needed = [
    { col: 'heading', type: 'varchar' },
    { col: 'subheading', type: 'varchar' },
    { col: 'description', type: 'varchar' },
    { col: 'cta_text', type: 'varchar' },
    { col: 'cta_link_label', type: 'varchar' },
  ];

  for (const { col, type } of needed) {
    if (!existing.includes(col)) {
      await c.query(`ALTER TABLE partners_settings ADD COLUMN "${col}" ${type}`);
      console.log(`Added ${col}`);
    } else {
      console.log(`${col} already exists`);
    }
  }

  // Also remove old items-related tables if they exist
  // (we removed items array from the global so these are no longer needed)

  console.log('\nDone!');
  await c.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
