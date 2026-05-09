// Generate a CSV report mapping migration-failures.csv ids to where they are used (collection/title)
// Usage: node scripts/generate-failure-report.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// load .env
const dotenvPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) {
  const lines = fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2]; if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URI;
if (!DATABASE_URL) { console.error('Missing DATABASE_URL'); process.exit(1); }

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

const MEDIA_REFS_COLLECTIONS = {
  posts: { featuredimage: 'Blog/Press — Featured Image', 'mediaGallery': 'Blog — Gallery Image' },
  publications: { coverimage: 'Report — Cover Image', file: 'Report — PDF File' },
  events: { featuredimage: 'Event — Featured Image' },
  'gallery-items': { image: 'Gallery — Image' },
  programmes: { featuredimage: 'Programme — Featured Image', 'gallery': 'Programme — Gallery' },
  team: { photo: 'Team — Photo' },
  partners: { logo: 'Partner — Logo' },
  testimonials: { image: 'Testimonial — Image' },
  users: { avatar: 'User — Avatar' },
};

const arrayChecks = [
  { collection: 'posts', field: 'mediaGallery', label: 'Blog — Gallery Image' },
  { collection: 'programmes', field: 'gallery', label: 'Programme — Gallery Image' },
];

(async function(){
  await client.connect();
  const csvPath = path.resolve(__dirname, '..', 'migration-failures.csv');
  if (!fs.existsSync(csvPath)) { console.error('No migration-failures.csv found'); process.exit(1); }
  const lines = fs.readFileSync(csvPath,'utf8').split(/\r?\n/).slice(1).filter(Boolean);
  const out = [];
  for (const line of lines) {
    const parts = line.match(/^"?(\d+)"?,"?(.*?)"?,"?(.*?)"?,"?(.*?)"?$/);
    if (!parts) continue;
    const id = Number(parts[1]);
    const filename = parts[2] || '';
    const origUrl = parts[3] || '';
    const errors = parts[4] || '';
    const locations = [];
    // check simple equality fields
    for (const [slug, fields] of Object.entries(MEDIA_REFS_COLLECTIONS)) {
      for (const field of Object.keys(fields)) {
        try {
          // For JSON/array fields we cannot use direct equals; skip if field looks like an array name
          if (['mediaGallery','gallery'].includes(field)) continue;
          const q = `SELECT id, title, name, email FROM ${slug} WHERE ${field} = $1 LIMIT 5`;
          const res = await client.query(q, [id]).catch(()=>({ rows: [] }));
          for (const doc of res.rows) {
            const title = doc.title || doc.name || doc.email || `ID ${doc.id}`;
            locations.push(`${fields[field]}: "${title}" (${slug})`);
          }
        } catch (e) {
          // ignore errors for missing tables/columns
        }
      }
    }
    // array / JSON checks (best-effort using text search)
    for (const check of arrayChecks) {
      try {
        const q = `SELECT id, title FROM ${check.collection} WHERE ${check.field}::text LIKE $1 LIMIT 10`;
        const res = await client.query(q, [`%${id}%`]).catch(()=>({ rows: [] }));
        for (const doc of res.rows) locations.push(`${check.label} in "${doc.title || `ID ${doc.id}`}" (${check.collection})`);
      } catch (e) {}
    }

    // try to find in globals via payload globals storage (best-effort)
    try {
      // Some projects store globals in a table named 'payload_globals' or 'globals' — attempt both
      const possible = ['globals','payload_globals','payload_global'];
      for (const t of possible) {
        try {
          const res = await client.query(`SELECT * FROM ${t} WHERE true LIMIT 50`).catch(()=>({ rows: [] }));
          for (const g of res.rows) {
            const text = JSON.stringify(g);
            if (text.includes(`\"${id}\"`) || text.includes(`:${id}`)) {
              locations.push(`Global (${t}): ${g.slug || g.id || '(unknown)'}`);
            }
          }
        } catch (e) {}
      }
    } catch (e) {}

    out.push({ id, filename, origUrl, errors, locations: locations.join('; ') });
  }
  await client.end();
  const outDir = path.resolve(__dirname, '..', 'backups');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `migration-failures-usage-${Date.now()}.csv`);
  const hdr = 'id,filename,original_url,errors,locations\n';
  const rows = out.map(r => `"${r.id}","${(r.filename||'').replace(/"/g,'""')}","${(r.origUrl||'').replace(/"/g,'""')}","${(r.errors||'').replace(/"/g,'""')}","${(r.locations||'').replace(/"/g,'""')}"`).join('\n');
  fs.writeFileSync(outPath, hdr + rows);
  console.log('Report saved to', outPath);
})();