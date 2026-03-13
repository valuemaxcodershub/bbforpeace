const { Client } = require('pg');

const c = new Client({
  connectionString:
    'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // 1. Check if 'partners' table exists
  const partnerCheck = await c.query(
    `SELECT to_regclass('public.partners') AS exists`
  );
  if (!partnerCheck.rows[0].exists) {
    console.log('Creating partners table...');
    await c.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        logo_id INTEGER REFERENCES media(id),
        website VARCHAR,
        description TEXT,
        category VARCHAR,
        "order" NUMERIC DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);
    console.log('partners table created');
  } else {
    console.log('partners table already exists');
  }

  // 2. Check award-settings columns - add heading, description, background_image_id if missing
  const awardCols = await c.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'award_settings'`
  );
  const awardColNames = awardCols.rows.map((r) => r.column_name);
  console.log('Current award_settings columns:', awardColNames.join(', '));

  if (!awardColNames.includes('heading')) {
    await c.query(`ALTER TABLE award_settings ADD COLUMN heading VARCHAR DEFAULT 'Awards & Achievements'`);
    console.log('Added heading to award_settings');
  }
  if (!awardColNames.includes('description')) {
    await c.query(`ALTER TABLE award_settings ADD COLUMN description TEXT`);
    console.log('Added description to award_settings');
  }
  if (!awardColNames.includes('background_image_id')) {
    await c.query(`ALTER TABLE award_settings ADD COLUMN background_image_id INTEGER REFERENCES media(id)`);
    console.log('Added background_image_id to award_settings');
  }

  // 3. Check award_settings_awards (the array table) - check if it has the right columns
  const awardArrayCheck = await c.query(
    `SELECT to_regclass('public.award_settings_awards') AS exists`
  );
  if (awardArrayCheck.rows[0].exists) {
    const arrayCols = await c.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'award_settings_awards'`
    );
    const arrayColNames = arrayCols.rows.map((r) => r.column_name);
    console.log('Current award_settings_awards columns:', arrayColNames.join(', '));

    // Make sure 'organization', 'year', 'description', 'image_id' exist
    if (!arrayColNames.includes('organization')) {
      await c.query(`ALTER TABLE award_settings_awards ADD COLUMN organization VARCHAR`);
      console.log('Added organization to award_settings_awards');
    }
    if (!arrayColNames.includes('year')) {
      await c.query(`ALTER TABLE award_settings_awards ADD COLUMN year VARCHAR`);
      console.log('Added year to award_settings_awards');
    }
    if (!arrayColNames.includes('description')) {
      await c.query(`ALTER TABLE award_settings_awards ADD COLUMN description TEXT`);
      console.log('Added description to award_settings_awards');
    }
    if (!arrayColNames.includes('image_id')) {
      await c.query(`ALTER TABLE award_settings_awards ADD COLUMN image_id INTEGER REFERENCES media(id)`);
      console.log('Added image_id to award_settings_awards');
    }

    // Check if 'issuer' exists (old field) - migrate data to 'organization' if so
    if (arrayColNames.includes('issuer') && !arrayColNames.includes('organization')) {
      // Already handled above - organization was added
    }
    if (arrayColNames.includes('issuer')) {
      // Copy issuer data to organization if organization is empty
      await c.query(`UPDATE award_settings_awards SET organization = issuer WHERE organization IS NULL AND issuer IS NOT NULL`);
      console.log('Migrated issuer -> organization data');
    }
  } else {
    console.log('award_settings_awards table does not exist - will be created by Payload on first save');
  }

  // 4. Check footer_settings - remove developed_by_text is not needed in DB
  // (just removing from Payload config is enough, the column stays harmlessly)
  console.log('\nFooter: developedByText field removed from config (column left in DB harmlessly)');

  // 5. Remove 'items' column from partners-settings if it exists as an array table
  // Check for partners_settings_items table
  const psItemsCheck = await c.query(
    `SELECT to_regclass('public.partners_settings_items') AS exists`
  );
  if (psItemsCheck.rows[0].exists) {
    console.log('partners_settings_items table exists (old items array) - left in DB harmlessly');
  }

  // 6. Seed initial partners from existing default data if collection is empty
  const partnerCount = await c.query('SELECT COUNT(*) FROM partners');
  if (parseInt(partnerCount.rows[0].count) === 0) {
    console.log('\nSeeding initial partners...');
    const defaultPartners = [
      { name: 'GPPAC', description: 'Global Partnership for Prevention of Armed Conflict', category: 'network', order: 1 },
      { name: 'WANEP', description: 'West Africa Network for Peacebuilding', category: 'network', order: 2 },
      { name: 'British Council', description: 'Education & Cultural Relations', category: 'strategic', order: 3 },
      { name: 'MacArthur Foundation', description: 'Funding Partner', category: 'funding', order: 4 },
      { name: 'Open Society Foundations', description: 'Civic Space Protection', category: 'funding', order: 5 },
      { name: 'Ford Foundation', description: 'Social Justice Funding', category: 'funding', order: 6 },
    ];
    for (const p of defaultPartners) {
      await c.query(
        `INSERT INTO partners (name, description, category, "order", is_active) VALUES ($1, $2, $3, $4, true)`,
        [p.name, p.description, p.category, p.order]
      );
      console.log('  Seeded:', p.name);
    }
  } else {
    console.log(`\nPartners collection already has ${partnerCount.rows[0].count} records`);
  }

  // 7. Seed award-settings data if empty
  const awardSettingsCheck = await c.query('SELECT id FROM award_settings LIMIT 1');
  if (awardSettingsCheck.rows.length > 0) {
    // Just update heading/description if empty
    await c.query(`
      UPDATE award_settings 
      SET heading = COALESCE(NULLIF(heading, ''), 'Awards & Achievements'),
          description = COALESCE(NULLIF(description, ''), 'Our commitment to peacebuilding has been recognized by national and regional bodies.')
      WHERE heading IS NULL OR heading = ''
    `);
    console.log('Award settings heading/description defaults applied');
  }

  console.log('\n=== Schema migration complete ===');
  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
