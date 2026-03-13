const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kzcegxvzpwaccjlglnvo:bbforpeabb4peace247DB@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
});

async function main() {
  await client.connect();
  
  // Image media IDs (1-10 are actual images in /images/)
  const imageIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Update photo gallery items (IDs 1-20) to cycle through image IDs
  for (let i = 1; i <= 20; i++) {
    const mediaId = imageIds[(i - 1) % imageIds.length];
    await client.query('UPDATE gallery_items SET image_id = $1 WHERE id = $2', [mediaId, i]);
    console.log(`Gallery item ${i} → media ${mediaId}`);
  }
  
  // Verify
  const r = await client.query('SELECT id, image_id FROM gallery_items WHERE media_type = $1 ORDER BY id', ['photo']);
  console.log('\nVerification:');
  r.rows.forEach(row => console.log(`  item ${row.id} → image_id=${row.image_id}`));
  
  await client.end();
  console.log('\nDone!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
