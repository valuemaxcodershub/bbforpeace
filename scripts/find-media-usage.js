// Find pages/collections referencing media ids listed in manual CSV
// Usage: node scripts/find-media-usage.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const dotenvPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) fs.readFileSync(dotenvPath,'utf8').split(/\r?\n/).forEach(l=>{const m=l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/); if(!m) return; let v=m[2]; if (v.startsWith('"')&&v.endsWith('"')) v=v.slice(1,-1); if(!process.env[m[1]]) process.env[m[1]]=v;});

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URI;
if (!DATABASE_URL) { console.error('Missing DATABASE_URL'); process.exit(1); }
const client = new Client({ connectionString: DATABASE_URL });

const inPath = path.resolve(__dirname, '..', 'backups', 'manual-reuploads-2026-05-09.csv');
if (!fs.existsSync(inPath)) { console.error('Input CSV not found:', inPath); process.exit(1); }
const ids = fs.readFileSync(inPath,'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l=>{ const m=l.match(/^"?(\d+)"?,/); return m?Number(m[1]):null }).filter(Boolean);

const collections = [
  { name: 'posts', fields: ['featuredImage','featuredimage','mediagallery','gallery'] },
  { name: 'publications', fields: ['coverImage','file','coverimage'] },
  { name: 'events', fields: ['featuredImage','featuredimage'] },
  { name: 'programmes', fields: ['featuredImage','featuredimage','gallery'] },
  { name: 'gallery_items', fields: ['image','media'] },
  { name: 'team', fields: ['photo'] },
  { name: 'partners', fields: ['logo'] },
  { name: 'testimonials', fields: ['image'] },
  { name: 'users', fields: ['avatar'] },
];

(async function(){
  await client.connect();
  const rows = [];
  for (const id of ids) {
    const usages = [];
    for (const col of collections) {
      for (const f of col.fields) {
        try {
          // Try equality
          const q = `SELECT id, title, name FROM ${col.name} WHERE ${f} = $1 LIMIT 20`;
          const res = await client.query(q, [id]).catch(()=>({ rows: [] }));
          for (const r of res.rows) {
            const title = r.title || r.name || `ID ${r.id}`;
            usages.push(`${col.name}:${f} => "${title}"`);
          }
        } catch (e) {
        }
        // try JSON/text search for arrays
        try {
          const q2 = `SELECT id, title FROM ${col.name} WHERE ${f}::text LIKE $1 LIMIT 20`;
          const res2 = await client.query(q2, [`%${id}%`]).catch(()=>({ rows: [] }));
          for (const r of res2.rows) usages.push(`${col.name}:${f} (array) => "${r.title || `ID ${r.id}`}"`);
        } catch (e) {}
      }
    }
    rows.push({ id, usages: usages.join('; ') });
  }
  await client.end();
  const outPath = path.resolve(__dirname, '..', 'backups', `manual-reuploads-usage-${Date.now()}.csv`);
  const hdr = 'id,usages\n';
  const body = rows.map(r=>`"${r.id}","${(r.usages||'').replace(/"/g,'""')}"`).join('\n');
  fs.writeFileSync(outPath, hdr + body);
  console.log('Wrote usage report to', outPath);
})();
