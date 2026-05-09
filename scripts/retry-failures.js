// Retry failed migration rows listed in migration-failures.csv
// Usage: node scripts/retry-failures.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// load .env
const dotenvPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) {
  const lines = fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2]; if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

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
  const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9-_\.]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `media/${String(id)}/${base}${ext}`;
}

async function fetchBuffer(url, authToken, retries = 4) {
  const attempt = async (triesLeft) => {
    try {
      const headers = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      return Buffer.from(buf);
    } catch (e) {
      const msg = (e && e.message) || e;
      const isRetryable = /ECONNRESET|ETIMEDOUT|AbortError|network|fetch failed|429/i.test('' + msg);
      if (triesLeft > 0 && isRetryable) {
        const backoff = (5 - triesLeft) * 2000 + Math.floor(Math.random()*1000);
        console.warn(`fetch failed (${msg}), retrying in ${backoff}ms...`);
        await new Promise(r => setTimeout(r, backoff));
        return attempt(triesLeft - 1);
      }
      throw e;
    }
  };
  return attempt(retries);
}

async function uploadToR2(key, buffer, contentType) {
  for (let i=0;i<3;i++){
    try {
      const cmd = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType || 'application/octet-stream' });
      await s3.send(cmd);
      return;
    } catch (e) {
      if (i===2) throw e;
      await new Promise(r=>setTimeout(r, (i+1)*1000));
    }
  }
}

(async function(){
  await client.connect();
  const csvPath = path.resolve(__dirname, '..', 'migration-failures.csv');
  if (!fs.existsSync(csvPath)) { console.error('No migration-failures.csv found'); process.exit(1); }
  const lines = fs.readFileSync(csvPath,'utf8').split(/\r?\n/).slice(1).filter(Boolean);
  for (const line of lines) {
    const parts = line.match(/^"?(\d+)"?,"?(.*?)"?,"?(.*?)"?,"?(.*?)"?$/);
    if (!parts) continue;
    const id = Number(parts[1]);
    console.log('\nRetrying id', id);
    try {
      const rowRes = await client.query('SELECT id, filename, url, mime_type FROM media WHERE id=$1', [id]);
      if (!rowRes.rows.length) { console.warn('  no row for id', id); continue; }
      const row = rowRes.rows[0];
      let url = row.url;
      if (!url) { console.warn('  empty url for', id); continue; }
      // if relative, build from SOURCE_SITE
      const tryUrls = [];
      if (url.startsWith('/')) {
        tryUrls.push(SOURCE_SITE + url);
        // fallback: decode
        tryUrls.push(SOURCE_SITE + decodeURIComponent(url));
        // alternate paths
        tryUrls.push(SOURCE_SITE + url.replace('/api/media/file/','/images/'));
        tryUrls.push(SOURCE_SITE + url.replace('/api/media/file/','/uploads/'));
      } else if (url.startsWith('//')) {
        tryUrls.push('https:' + url);
      } else {
        tryUrls.push(url);
      }

      let buffer = null;
      for (const t of tryUrls) {
        try {
          console.log('  trying', t);
          buffer = await fetchBuffer(t, process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_TOKEN || undefined);
          url = t; break;
        } catch (e) {
          console.warn('   ->', e.message || e);
        }
      }
      if (!buffer) { console.warn('  all fetch attempts failed for', id); continue; }
      const key = sanitizeKey(id, row.filename || `file-${id}`);
      await uploadToR2(key, buffer, row.mime_type || undefined);
      const newUrl = `${R2_PUBLIC_URL}/${key}`;
      await client.query('UPDATE media SET url=$1 WHERE id=$2', [newUrl, id]);
      console.log('  migrated id', id);
    } catch (e) {
      console.error('  retry failed for id', id, e && (e.stack || e.message || e));
    }
  }
  await client.end();
  console.log('\nRetry run complete');
})();
