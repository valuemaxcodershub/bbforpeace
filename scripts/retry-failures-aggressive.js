// Aggressive retry + usage-report for migration-failures.csv
// Usage: node scripts/retry-failures-aggressive.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Load .env (simple parser)
const dotenvPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) {
  fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) return;
    let v = m[2]; if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1,-1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  });
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

async function fetchBuffer(url, authToken, retries = 6) {
  const attempt = async (triesLeft) => {
    try {
      const headers = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      return Buffer.from(buf);
    } catch (e) {
      const msg = (e && e.message) || e;
      const isRetryable = /ECONNRESET|ETIMEDOUT|AbortError|network|fetch failed|429/i.test('' + msg);
      if (triesLeft > 0 && isRetryable) {
        const backoff = Math.min(30000, (6 - triesLeft) * 5000 + Math.floor(Math.random()*2000));
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
  for (let i=0;i<4;i++){
    try {
      const cmd = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType || 'application/octet-stream' });
      await s3.send(cmd);
      return;
    } catch (e) {
      if (i===3) throw e;
      await new Promise(r=>setTimeout(r, (i+1)*2000));
    }
  }
}

// Collections & globals mapping (same labels used in Media collection)
const MEDIA_REFS_COLLECTIONS = {
  posts: { featuredimage: 'Blog/Press — Featured Image', mediagallery: 'Blog — Gallery Image' },
  publications: { coverimage: 'Report — Cover Image', file: 'Report — PDF File' },
  events: { featuredimage: 'Event — Featured Image' },
  'gallery-items': { image: 'Gallery — Image' },
  programmes: { featuredimage: 'Programme — Featured Image' },
  team: { photo: 'Team — Photo' },
  partners: { logo: 'Partner — Logo' },
  testimonials: { image: 'Testimonial — Image' },
  users: { avatar: 'User — Avatar' },
};

const MEDIA_REFS_GLOBALS = {
  'general-settings': { logo: 'General Settings — Logo', favicon: 'General Settings — Favicon' },
  'seo-settings': { 'og.image': 'SEO Settings — OG Image', ogImage: 'SEO Settings — OG Image' },
  'award-settings': { backgroundImage: 'Award Settings — Background Image' },
  'contact-us-page-settings': { mapBackgroundImage: 'Contact Page — Map Background' },
};

function generateUrlVariants(orig) {
  const variants = new Set();
  if (!orig) return [];
  variants.add(orig);
  try { variants.add(decodeURIComponent(orig)); } catch {}
  // strip query
  variants.add(orig.split('?')[0]);
  // if leading // -> https:
  if (orig.startsWith('//')) variants.add('https:' + orig);
  // if relative
  if (orig.startsWith('/')) {
    variants.add(SOURCE_SITE + orig);
    try { variants.add(SOURCE_SITE + decodeURIComponent(orig)); } catch {}
  }
  // try replacing /api/media/file/ with /images/ and /uploads/
  variants.add(orig.replace('/api/media/file/','/images/'));
  variants.add(orig.replace('/api/media/file/','/uploads/'));
  // spaces -> hyphens/underscores
  variants.add(orig.replace(/\s+/g,'-'));
  variants.add(orig.replace(/\s+/g,'_'));
  // remove size suffixes like -600x375 or -100x100
  variants.add(orig.replace(/-\d+x\d+(?=(\.[a-zA-Z0-9]+)$)/, ''));
  // lowercase filename
  variants.add(orig.replace(/([^\/]+)$/,(m)=>m.toLowerCase()));

  return Array.from(variants).filter(Boolean);
}

(async function(){
  await client.connect();
  const csvPath = path.resolve(__dirname, '..', 'migration-failures.csv');
  if (!fs.existsSync(csvPath)) { console.error('No migration-failures.csv found'); process.exit(1); }
  const lines = fs.readFileSync(csvPath,'utf8').split(/\r?\n/).slice(1).filter(Boolean);
  const reportRows = [];
  for (const line of lines) {
    const parts = line.match(/^"?(\d+)"?,"?(.*?)"?,"?(.*?)"?,"?(.*?)"?$/);
    if (!parts) continue;
    const id = Number(parts[1]);
    const origUrl = parts[3] || '';
    const filename = parts[2] || '';
    console.log('\n[AGGRESSIVE] id', id, '-', filename);
    let lastError = '';
    let triedUrls = [];
    let success = false;
    const variants = generateUrlVariants(origUrl);
    for (const v of variants) {
      if (success) break;
      try {
        console.log('  trying', v);
        const buffer = await fetchBuffer(v, process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_TOKEN || undefined, 6);
        const key = sanitizeKey(id, filename || `file-${id}`);
        await uploadToR2(key, buffer, undefined);
        const newUrl = `${R2_PUBLIC_URL}/${key}`;
        await client.query('UPDATE media SET url=$1 WHERE id=$2', [newUrl, id]);
        console.log('  migrated id', id, '->', newUrl);
        success = true;
        triedUrls.push(v);
        // be kind to origin
        await new Promise(r=>setTimeout(r, 1500));
      } catch (e) {
        const msg = (e && e.message) || e;
        console.warn('   ->', msg);
        lastError = msg;
        triedUrls.push(v + ` (${msg})`);
        // slow down between attempts
        await new Promise(r=>setTimeout(r, 2500));
      }
    }

    if (!success) {
      // gather usage locations
      const usages = [];
      // collections
      for (const [slug, fields] of Object.entries(MEDIA_REFS_COLLECTIONS)) {
        for (const field of Object.keys(fields)) {
          try {
            const res = await client.query(`SELECT id, title, name, email FROM ${slug} WHERE ${field} = $1 LIMIT 5`, [id]).catch(()=>({ rows: [] }));
            for (const doc of res.rows) {
              const title = doc.title || doc.name || doc.email || `ID ${doc.id}`;
              usages.push(`${fields[field]}: "${title}" (${slug})`);
            }
          } catch (e) {
            // ignore
          }
        }
      }
      // some fields are arrays or nested; search generically in JSON fields if present
      const arrayChecks = [
        { collection: 'posts', field: 'mediaGallery', label: 'Blog — Gallery Image' },
        { collection: 'programmes', field: 'gallery', label: 'Programme — Gallery Image' },
      ];
      for (const check of arrayChecks) {
        try {
          const res = await client.query(`SELECT id, title FROM ${check.collection} WHERE ${check.field}::text LIKE $1 LIMIT 5`, [`%${id}%`]).catch(()=>({ rows: [] }));
          for (const doc of res.rows) usages.push(`${check.label} in "${doc.title || `ID ${doc.id}`}" (${check.collection})`);
        } catch (e) {}
      }

      // globals
      for (const [slug, fields] of Object.entries(MEDIA_REFS_GLOBALS)) {
        try {
          const res = await client.query(`SELECT * FROM globals WHERE slug=$1 LIMIT 1`, [slug]).catch(()=>({ rows: [] }));
          // if there is a globals table different in schema, skip (best-effort)
        } catch (e) {}
      }

      reportRows.push({ id, filename, origUrl, lastError, locations: usages.join('; '), tried: triedUrls.join('; '), triedAt: new Date().toISOString() });
    }
  }
  await client.end();
  const outDir = path.resolve(__dirname, '..', 'backups');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `migration-failures-report-${Date.now()}.csv`);
  const hdr = 'id,filename,original_url,last_error,locations,tried_urls,tried_at\n';
  const body = reportRows.map(r => `"${r.id}","${(r.filename||'').replace(/"/g,'""')}","${(r.origUrl||'').replace(/"/g,'""')}","${(r.lastError||'').replace(/"/g,'""')}","${(r.locations||'').replace(/"/g,'""')}","${(r.tried||'').replace(/"/g,'""')}","${r.triedAt}"`).join('\n');
  fs.writeFileSync(outPath, hdr + body);
  console.log('\nReport saved to', outPath);
})();
