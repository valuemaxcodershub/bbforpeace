// Backup DB using pg_dump (requires pg_dump in PATH)
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Load .env
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
  console.error('DATABASE_URL or DATABASE_URI not set in .env');
  process.exit(1);
}

const backupsDir = path.resolve(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, '-');
const outFile = path.join(backupsDir, `db-backup-${ts}.sql.dump`);

console.log('Running pg_dump to', outFile);

// Use --dbname using connection string; use -Fc custom format
const args = ['--dbname', DATABASE_URL, '-Fc', '-f', outFile];
const res = spawnSync('pg_dump', args, { stdio: 'inherit' });
if (res.error) {
  console.error('pg_dump failed to start:', res.error);
  process.exit(1);
}
if (res.status !== 0) {
  console.error('pg_dump exited with status', res.status);
  process.exit(res.status || 1);
}
console.log('Backup complete:', outFile);
process.exit(0);
