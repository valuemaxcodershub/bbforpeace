// Load .env if present so script can run without exporting env vars
const fs = require('fs');
const path = require('path');
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

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

async function run() {
  const key = 'test-r2-upload.txt';
  const body = Buffer.from('r2 upload test ' + new Date().toISOString());
  const cmd = new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: body, ContentType: 'text/plain' });
  try {
    await s3.send(cmd);
    console.log('R2 upload OK:', key);
  } catch (e) {
    console.error('R2 upload FAILED:', e && (e.stack || e.message || e));
    process.exit(1);
  }
}
run();