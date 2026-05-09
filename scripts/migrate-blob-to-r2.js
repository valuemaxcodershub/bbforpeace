/*
  migrate-blob-to-r2.js

  Usage (local):
    1. Install dependency: npm install @aws-sdk/client-s3
    2. Set env vars (do NOT commit):
       - DATABASE_URL (Postgres connection string)
       - R2_ACCESS_KEY_ID
       - R2_SECRET_ACCESS_KEY
       - R2_ACCOUNT_ID
       - R2_BUCKET
       - R2_ENDPOINT (e.g. https://<ACCOUNT_ID>.r2.cloudflarestorage.com)
       - R2_PUBLIC_URL (e.g. https://pub-XXXX.r2.dev or your custom domain)
    3. Run: node scripts/migrate-blob-to-r2.js

  What it does:
    - Finds media rows with a non-empty `url` column.
    - For each row: attempts to fetch the file from the URL (public GET).
      - If fetch succeeds (200), uploads the file to R2 using key: media/<id>/<filename>
      - Updates `media.url` to point to `${R2_PUBLIC_URL}/${key}`
    - Logs failures; does not delete source blobs.

  Notes:
    - If your Vercel Blob URLs require auth, the fetch may fail. In that case provide a temporary BLOB token and we can adapt the script to use it.
    - Test on a small subset first by passing `--limit N`.
*/

// Load .env manually (no external dependency) so script can run without exporting env vars
const fs = require('fs')
const path = require('path')
const dotenvPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(dotenvPath)) {
  const lines = fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let val = m[2]
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (!process.env[m[1]]) process.env[m[1]] = val
  }
}

const { Client } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const DATABASE_URL = process.env.DATABASE_URL || process.env.PG_CONN || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_ENDPOINT = process.env.R2_ENDPOINT; // https://<ACCOUNT_ID>.r2.cloudflarestorage.com
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // https://pub-XXXX.r2.dev

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}
if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_ENDPOINT || !R2_PUBLIC_URL) {
  console.error('Missing one of R2 env vars. Please set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT, R2_PUBLIC_URL');
  process.exit(1);
}

const pg = new Client({ connectionString: DATABASE_URL });

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false,
});

let CURRENT_PROCESSING = null;
process.on('unhandledRejection', (r) => { console.error('UnhandledRejection:', r && (r.stack || r), 'CURRENT_PROCESSING=', CURRENT_PROCESSING); });
process.on('uncaughtException', (err) => { console.error('UncaughtException:', err && (err.stack || err), 'CURRENT_PROCESSING=', CURRENT_PROCESSING); process.exit(1); });

async function fetchBuffer(url, authToken, retries = 3) {
  const attempt = async (triesLeft) => {
    try {
      const headers = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buf = await res.arrayBuffer();
      return Buffer.from(buf);
    } catch (e) {
      const code = e && (e.code || e.name || '');
      const isRetryable = code === 'ECONNRESET' || code === 'AbortError' || ('' + e).toLowerCase().includes('network') || ('' + e).toLowerCase().includes('fetch failed') || ('' + e).toLowerCase().includes('ecof');
      if (triesLeft > 0 && isRetryable) {
        const backoff = (4 - triesLeft) * 1000;
        console.warn(`    fetch failed (${e && e.message}). retrying in ${backoff}ms...`);
        await new Promise(r => setTimeout(r, backoff));
        return attempt(triesLeft - 1);
      }
      throw e;
    }
  };
  return attempt(retries);
}

function sanitizeKey(id, filename) {
  // keep extension
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext)
    .replace(/[^a-zA-Z0-9-_\.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const key = `media/${String(id)}/${base}${ext}`;
  return key;
}

async function uploadToR2(key, buffer, contentType) {
  const maxTries = 3;
  for (let i = 0; i < maxTries; i++) {
    try {
      const cmd = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType || 'application/octet-stream',
        ACL: undefined,
      });
      await s3.send(cmd);
      return;
    } catch (e) {
      if (i === maxTries - 1) throw e;
      const wait = (i + 1) * 1000;
      console.warn(`    upload attempt ${i + 1} failed: ${e && e.message}. retrying in ${wait}ms...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

async function main() {
  await pg.connect();

  const limitArgIndex = process.argv.indexOf('--limit');
  const limit = limitArgIndex >= 0 ? Number(process.argv[limitArgIndex + 1]) || 0 : 0;

  // Query media rows that look like external blobs (have url and not already R2 public URL)
  const rowsRes = await pg.query(`
    SELECT id, filename, url, mime_type
    FROM media
    WHERE url IS NOT NULL AND url <> ''
    ORDER BY id
    ${limit ? 'LIMIT ' + limit : ''}
  `);

  console.log(`Found ${rowsRes.rows.length} media rows to process`);

  let success = 0;
  let failed = 0;

  // Prepare failures CSV
  const failuresPath = path.resolve(__dirname, '..', 'migration-failures.csv');
  try { fs.writeFileSync(failuresPath, 'id,filename,url,error\n', { encoding: 'utf8' }); } catch (e) { /* ignore */ }

  function csvEscape(str) {
    if (str === null || str === undefined) return '""';
    return '"' + ('' + str).replace(/"/g, '""') + '"';
  }

  for (const row of rowsRes.rows) {
    const { id, filename, url, mime_type } = row;
    CURRENT_PROCESSING = { id, filename, url };
    console.log(`\n[${id}] ${filename} -> ${url}`);

    // Skip if already points to R2 public url
    if (url.startsWith(R2_PUBLIC_URL)) {
      console.log('  ✓ already on R2; skipping');
      continue;
    }

    try {
      // Normalize relative URLs by prefixing a base site URL
      let fetchUrl = url;
      if (fetchUrl.startsWith('//')) {
        fetchUrl = 'https:' + fetchUrl;
      } else if (fetchUrl.startsWith('/')) {
        const configuredBase = process.env.SOURCE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
        const defaultBase = 'https://bbforpeace.org';
        const baseSite = (configuredBase || defaultBase).replace(/\/$/, '');
        if (!configuredBase) console.warn('No SOURCE_SITE_URL/NEXT_PUBLIC_SITE_URL set — defaulting to https://bbforpeace.org for fetches. Set SOURCE_SITE_URL in .env to change.');
        fetchUrl = baseSite + fetchUrl;
      }

      const authToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_TOKEN || '';
      console.log(`  -> fetching from ${fetchUrl}`);

      let buffer;
      try {
        buffer = await fetchBuffer(fetchUrl, authToken || undefined);
      } catch (err) {
        // If fetch fails for a relative path, try alternative bases (configured or production)
        if (url.startsWith('/')) {
          const alternatives = [];
          const configuredBase = process.env.SOURCE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
          if (configuredBase) alternatives.push(configuredBase.replace(/\/$/, ''));
          alternatives.push('https://bbforpeace.org');

          let triedOk = false;
          for (const alt of alternatives) {
            const altUrl = alt + url;
            console.log(`  -> retrying from ${altUrl}`);
            try {
              buffer = await fetchBuffer(altUrl, authToken || undefined);
              fetchUrl = altUrl;
              triedOk = true;
              break;
            } catch (e2) {
              // continue trying
            }
          }
          if (!triedOk) {
            console.error(`  all fetch retries failed for id=${id} url=${url}:`, err && (err.stack || err.message || err));
            throw err;
          }
        } else {
          throw err;
        }
      }
      console.log(`  ✓ downloaded ${buffer.length} bytes`);

      const key = sanitizeKey(id, filename || `file-${id}`);
      await uploadToR2(key, buffer, mime_type || undefined);
      console.log(`  ✓ uploaded to R2 as ${key}`);

      const newUrl = `${R2_PUBLIC_URL}/${key}`;
      await pg.query('UPDATE media SET url = $1 WHERE id = $2', [newUrl, id]);
      console.log(`  ✓ DB updated -> ${newUrl}`);

      success++;
    } catch (e) {
      const errMsg = e && (e.message || e.stack || e) || 'unknown';
      console.error(`  ✗ failed: ${errMsg}`);
      if (e && e.stack) console.error(e.stack);
      // append to failures CSV
      try {
        fs.appendFileSync(failuresPath, [csvEscape(id), csvEscape(filename), csvEscape(url), csvEscape(errMsg)].join(',') + '\n', { encoding: 'utf8' });
      } catch (ee) {
        console.warn('  failed to write to failures csv:', ee && ee.message);
      }
      failed++;
    } finally {
      CURRENT_PROCESSING = null;
    }
  }

  console.log(`\nDone. Success: ${success}, Failed: ${failed}`);
  await pg.end();
}

main().catch(e => { console.error(e); process.exit(1); });
