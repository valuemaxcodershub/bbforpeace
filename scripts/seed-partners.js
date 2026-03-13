const { Client } = require('pg');

const c = new Client({
  connectionString:
    'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await c.connect();

  // Make logo_id nullable (it was NOT NULL but we need partners without logos initially)
  await c.query(`ALTER TABLE partners ALTER COLUMN logo_id DROP NOT NULL`);
  console.log('Made partners.logo_id nullable');

  // Seed initial partners
  const partnerCount = await c.query('SELECT COUNT(*) FROM partners');
  if (parseInt(partnerCount.rows[0].count) === 0) {
    console.log('Seeding initial partners...');
    
    // Check if we have partner logo media entries
    const mediaCheck = await c.query(`
      SELECT id, filename FROM media 
      WHERE filename ILIKE '%gppac%' OR filename ILIKE '%wanep%' 
         OR filename ILIKE '%british%' OR filename ILIKE '%ford%' 
         OR filename ILIKE '%maaurthor%' OR filename ILIKE '%open society%'
      ORDER BY id
    `);
    
    const mediaMap = {};
    mediaCheck.rows.forEach(r => {
      const fn = r.filename.toLowerCase();
      if (fn.includes('gppac')) mediaMap['GPPAC'] = r.id;
      else if (fn.includes('wanep')) mediaMap['WANEP'] = r.id;
      else if (fn.includes('british')) mediaMap['British Council'] = r.id;
      else if (fn.includes('maaurthor')) mediaMap['MacArthur Foundation'] = r.id;
      else if (fn.includes('open society')) mediaMap['Open Society Foundations'] = r.id;
      else if (fn.includes('ford')) mediaMap['Ford Foundation'] = r.id;
    });
    console.log('Found media entries:', Object.keys(mediaMap).join(', '));

    const defaultPartners = [
      { name: 'GPPAC', description: 'Global Partnership for Prevention of Armed Conflict', category: 'network', order: 1 },
      { name: 'WANEP', description: 'West Africa Network for Peacebuilding', category: 'network', order: 2 },
      { name: 'British Council', description: 'Education & Cultural Relations', category: 'strategic', order: 3 },
      { name: 'MacArthur Foundation', description: 'Funding Partner', category: 'funding', order: 4 },
      { name: 'Open Society Foundations', description: 'Civic Space Protection', category: 'funding', order: 5 },
      { name: 'Ford Foundation', description: 'Social Justice Funding', category: 'funding', order: 6 },
    ];
    
    for (const p of defaultPartners) {
      const logoId = mediaMap[p.name] || null;
      await c.query(
        `INSERT INTO partners (name, description, category, "order", is_active, logo_id) VALUES ($1, $2, $3, $4, true, $5)`,
        [p.name, p.description, p.category, p.order, logoId]
      );
      console.log('  Seeded:', p.name, logoId ? `(media #${logoId})` : '(no logo)');
    }
  } else {
    console.log(`Partners already has ${partnerCount.rows[0].count} records`);
  }

  console.log('\nDone!');
  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
