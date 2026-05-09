// Simple DB connectivity test
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

const { Client } = require('pg');

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URI;
  if (!DATABASE_URL) {
    console.error('No DATABASE_URL or DATABASE_URI in env');
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Connected. Running SELECT 1');
    const res = await client.query('SELECT 1 AS ok');
    console.log('Query result:', res.rows);
    await client.end();
    console.log('Connection closed. OK');
  } catch (e) {
    console.error('DB connection failed (plain):', e && (e.stack || e.message || e));
    console.log('Retrying with SSL (rejectUnauthorized=false)...');
    const clientSsl = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
    try {
      await clientSsl.connect();
      console.log('Connected with SSL. Running SELECT 1');
      const res2 = await clientSsl.query('SELECT 1 AS ok');
      console.log('Query result (ssl):', res2.rows);
      await clientSsl.end();
      console.log('SSL connection closed. OK');
    } catch (e2) {
      console.error('DB connection failed (ssl):', e2 && (e2.stack || e2.message || e2));
      process.exit(1);
    }
  }
}

run();
