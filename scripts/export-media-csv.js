// Export media table to CSV
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// load .env
const dotenvPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) {
  const lines = fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URI;
if (!DATABASE_URL) {
  console.error('DATABASE_URL or DATABASE_URI not set');
  process.exit(1);
}

const outDir = path.resolve(__dirname, '..', 'backups');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, '-');
const outFile = path.join(outDir, `media-export-${ts}.csv`);

(async function() {
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('SELECT id, filename, url, mime_type FROM media ORDER BY id');
    const out = fs.createWriteStream(outFile, { encoding: 'utf8' });
    out.write('id,filename,url,mime_type\n');
    for (const r of res.rows) {
      const esc = v => '"' + ('' + (v===null||v===undefined? '': v)).replace(/"/g, '""') + '"';
      out.write([esc(r.id), esc(r.filename), esc(r.url), esc(r.mime_type)].join(',') + '\n');
    }
    out.end();
    console.log('Exported', res.rows.length, 'rows to', outFile);
    await client.end();
  } catch (e) {
    console.error('Export failed:', e && (e.stack || e.message || e));
    process.exit(1);
  }
})();
