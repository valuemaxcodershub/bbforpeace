/**
 * Enable Row-Level Security (RLS) on all public tables in Supabase.
 * 
 * Payload CMS connects via the Postgres connection string directly (not Supabase client),
 * so it bypasses RLS entirely. This means:
 * - RLS won't affect Payload CMS operations at all
 * - But it WILL block anyone trying to access tables via the Supabase public API/anon key
 * 
 * We enable RLS with NO policies = tables are locked down via Supabase API
 * while Payload continues to work normally via direct Postgres connection.
 */
const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // Get all tables in the public schema
  const { rows: tables } = await c.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename
  `);

  console.log(`Found ${tables.length} tables in public schema\n`);

  // Check which already have RLS enabled
  const { rows: rlsStatus } = await c.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class 
    WHERE relnamespace = 'public'::regnamespace 
      AND relkind = 'r'
    ORDER BY relname
  `);

  const rlsMap = {};
  rlsStatus.forEach(r => { rlsMap[r.relname] = r.relrowsecurity; });

  let enabled = 0;
  let alreadyEnabled = 0;
  let failed = 0;

  for (const { tablename } of tables) {
    if (rlsMap[tablename]) {
      console.log(`  ✓ ${tablename} - RLS already enabled`);
      alreadyEnabled++;
      continue;
    }

    try {
      await c.query(`ALTER TABLE "public"."${tablename}" ENABLE ROW LEVEL SECURITY`);
      console.log(`  ✓ ${tablename} - RLS ENABLED`);
      enabled++;
    } catch (e) {
      console.error(`  ✗ ${tablename} - FAILED: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  Already had RLS: ${alreadyEnabled}`);
  console.log(`  Newly enabled: ${enabled}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total tables: ${tables.length}`);
  console.log(`\nPayload CMS uses direct Postgres connection, so it bypasses RLS.`);
  console.log(`This only blocks unauthorized access via the Supabase public API.`);

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
