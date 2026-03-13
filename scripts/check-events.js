const { Client } = require('pg');

const c = new Client({
  connectionString:
    'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // Check events table columns
  const cols = await c.query(`
    SELECT column_name, data_type FROM information_schema.columns 
    WHERE table_name = 'events' ORDER BY ordinal_position
  `);
  console.log('Events table columns:');
  cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

  // Check existing events count
  const count = await c.query('SELECT COUNT(*) FROM events');
  console.log(`\nExisting events: ${count.rows[0].count}`);

  if (parseInt(count.rows[0].count) > 0) {
    const events = await c.query('SELECT id, title, status, start_date FROM events ORDER BY start_date DESC LIMIT 5');
    console.log('Sample events:');
    events.rows.forEach(r => console.log(`  #${r.id}: ${r.title} (${r.status}) - ${r.start_date}`));
  }

  // Check event_page_settings columns
  const epsCols = await c.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'event_page_settings' ORDER BY ordinal_position
  `);
  console.log('\nEvent page settings columns:', epsCols.rows.map(r => r.column_name).join(', '));

  await c.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
