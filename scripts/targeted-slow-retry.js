// Targeted very-slow retry for specific media ids
// Usage: node scripts/targeted-slow-retry.js 81,82,83

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const idsArg = process.argv[2];
if (!idsArg) { console.error('Usage: node scripts/targeted-slow-retry.js 81,82,83'); process.exit(1); }
const ids = idsArg.split(',').map(s=>Number(s.trim())).filter(Boolean);

// load .env (simple)
const dotenvPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) fs.readFileSync(dotenvPath,'utf8').split(/\r?\n/).forEach(l=>{const m=l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/); if (!m) return; let v=m[2]; if (v.startsWith('"')&&v.endsWith('"')) v=v.slice(1,-1); if (!process.env[m[1]]) process.env[m[1]]=v;});

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URI;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
const SOURCE_SITE = (process.env.SOURCE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bbforpeace.org').replace(/\/$/, '');

if (!DATABASE_URL) { console.error('Missing DATABASE_URL'); process.exit(1); }
if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) { console.error('Missing R2 env vars'); process.exit(1); }

const client = new Client({ connectionString: DATABASE_URL });
const s3 = new S3Client({ region: 'auto', endpoint: R2_ENDPOINT, credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY } });

function sanitizeKey(id, filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9-_\.]/g, '-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  return `media/${String(id)}/${base}${ext}`;
}

async function fetchBuffer(url, authToken, retries = 8) {
  const attempt = async (triesLeft) => {
    try {
      const headers = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      const controller = new AbortController();
      const timeout = setTimeout(()=>controller.abort(), 60000);
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      return Buffer.from(buf);
    } catch (e) {
      const msg = (e && e.message) || e;
      const isRetryable = /429|ECONNRESET|ETIMEDOUT|AbortError|network/i.test(''+msg);
      if (triesLeft > 0 && isRetryable) {
        const backoff = Math.min(120000, (8 - triesLeft) * 15000 + Math.floor(Math.random()*3000));
        console.warn(`fetch failed (${msg}), retrying in ${backoff}ms...`);
        await new Promise(r=>setTimeout(r, backoff));
        return attempt(triesLeft-1);
      }
      throw e;
    }
  };
  return attempt(retries);
}

async function uploadToR2(key, buffer, contentType) {
  const cmd = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType || 'application/octet-stream' });
  await s3.send(cmd);
}

function generateVariants(orig) {
  const set = new Set();
  if (!orig) return [];
  set.add(orig);
  try { set.add(decodeURIComponent(orig)); } catch {}
  set.add(orig.split('?')[0]);
  if (orig.startsWith('/')) set.add(SOURCE_SITE + orig);
  set.add(orig.replace('/api/media/file/','/images/'));
  set.add(orig.replace('/api/media/file/','/uploads/'));
  set.add(orig.replace(/\s+/g,'-'));
  set.add(orig.replace(/\s+/g,'_'));
  set.add(orig.replace(/-\d+x\d+(?=(\.[a-zA-Z0-9]+)$)/,''));
  return Array.from(set).filter(Boolean);
}

(async function(){
  await client.connect();
  for (const id of ids) {
    console.log('\n[VERY-SLOW] id', id);
    try {
      const res = await client.query('SELECT id, filename, url, mime_type FROM media WHERE id=$1', [id]);
      if (!res.rows.length) { console.warn(' no media row for', id); continue; }
      const row = res.rows[0];
      const variants = generateVariants(row.url || '');
      let buf = null; let usedUrl = null;
      for (const v of variants) {
        try {
          console.log('  trying', v);
          buf = await fetchBuffer(v, process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_TOKEN || undefined, 8);
          usedUrl = v; break;
        } catch (e) {
          console.warn('   ->', e.message || e);
          await new Promise(r=>setTimeout(r, 5000));
        }
      }
      if (!buf) { console.warn('  all fetch attempts failed for', id); continue; }
      const key = sanitizeKey(id, row.filename || `file-${id}`);
      await uploadToR2(key, buf, row.mime_type || undefined);
      const newUrl = `${R2_PUBLIC_URL}/${key}`;
      await client.query('UPDATE media SET url=$1 WHERE id=$2', [newUrl, id]);
      console.log('  migrated', id, '->', newUrl, '(from', usedUrl, ')');
      // wait 30s between items to avoid rate limits
      await new Promise(r=>setTimeout(r, 30000));
    } catch (e) {
      console.error('  error for', id, e && (e.message||e));
    }
  }
  await client.end();
  console.log('\nTargeted slow retry complete');
})();
