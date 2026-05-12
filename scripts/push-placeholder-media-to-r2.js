#!/usr/bin/env node
/**
 * Upload files referenced by section-placeholder mapping (local public/ paths)
 * into Cloudflare R2 and set media.url to the public R2 URL.
 *
 * Prereqs: .env with DATABASE_URL, R2_*, R2_PUBLIC_URL (same as Payload).
 *
 * Usage:
 *   DRY_RUN=1 node scripts/push-placeholder-media-to-r2.js
 *   node scripts/push-placeholder-media-to-r2.js --mapping backups/placeholder-mapping-sections-20260512.csv
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const ROOT = path.resolve(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')

const dotenvPath = path.join(ROOT, '.env')
if (fs.existsSync(dotenvPath)) {
  fs.readFileSync(dotenvPath, 'utf8')
    .split(/\r?\n/)
    .forEach((l) => {
      const m = l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!m) return
      let v = m[2]
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
      if (!process.env[m[1]]) process.env[m[1]] = v
    })
}

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URI
const R2_BUCKET = process.env.R2_BUCKET
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')

const dryRun = !!process.env.DRY_RUN

let mappingArg = ''
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--mapping' && process.argv[i + 1]) {
    mappingArg = process.argv[i + 1]
    i++
  }
}

function latestMappingPath() {
  const dir = path.join(ROOT, 'backups')
  if (!fs.existsSync(dir)) return null
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('placeholder-mapping-sections-') && f.endsWith('.csv'))
    .sort()
  return files.length ? path.join(dir, files[files.length - 1]) : null
}

function parseMappingCsv(txt) {
  const lines = txt.split(/\r?\n/).filter(Boolean)
  lines.shift()
  const rows = []
  for (const line of lines) {
    const cells = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"'
          i++
          continue
        }
        inQ = !inQ
        continue
      }
      if (!inQ && c === ',') {
        cells.push(cur)
        cur = ''
        continue
      }
      cur += c
    }
    cells.push(cur)
    if (cells.length >= 3) {
      rows.push({
        id: Number(cells[0]),
        old_filename: cells[1],
        placeholder_url: cells[2],
      })
    }
  }
  return rows
}

function placeholderUrlToLocalFile(placeholderUrl) {
  let u
  try {
    u = new URL(placeholderUrl.trim())
  } catch {
    return null
  }
  const pathname = u.pathname.replace(/^\/+/, '')
  const segments = pathname.split('/').map((s) => {
    try {
      return decodeURIComponent(s)
    } catch {
      return s
    }
  })
  return path.join(PUBLIC, ...segments)
}

function sanitizeKey(id, filename) {
  const ext = path.extname(filename).toLowerCase()
  const base = path
    .basename(filename, ext)
    .replace(/[^a-zA-Z0-9-_\.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `media/${String(id)}/${base}${ext}`
}

function guessMime(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  }
  return map[ext] || 'application/octet-stream'
}

async function fetchUrlBuffer(url) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 60000)
  const res = await fetch(url, { signal: controller.signal })
  clearTimeout(t)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = await res.arrayBuffer()
  return Buffer.from(buf)
}

async function main() {
  const mappingPath = mappingArg
    ? path.isAbsolute(mappingArg)
      ? mappingArg
      : path.join(ROOT, mappingArg)
    : latestMappingPath()

  if (!mappingPath || !fs.existsSync(mappingPath)) {
    console.error(
      'No mapping CSV. Pass --mapping backups/placeholder-mapping-sections-*.csv or generate one with assign-section-placeholders.js',
    )
    process.exit(1)
  }

  if (!dryRun) {
    if (!DATABASE_URL) {
      console.error('Missing DATABASE_URL')
      process.exit(1)
    }
    if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
      console.error('Missing R2 env vars (R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL)')
      process.exit(1)
    }
  }

  const rows = parseMappingCsv(fs.readFileSync(mappingPath, 'utf8'))
  console.log(`Mapping: ${mappingPath} (${rows.length} rows)`)

  const s3 = dryRun
    ? null
    : new S3Client({
        region: 'auto',
        endpoint: R2_ENDPOINT,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
      })

  let client = null

  async function connectWithRetry() {
    const attempts = 4
    const opts = {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 25000,
    }
    for (let a = 1; a <= attempts; a++) {
      try {
        if (client) {
          await client.end().catch(() => {})
          client = null
        }
        client = new Client(opts)
        await client.connect()
        return
      } catch (e) {
        console.warn(`DB connect attempt ${a}/${attempts} failed:`, e.message || e)
        if (a === attempts) throw e
        await new Promise((r) => setTimeout(r, 2000 * a))
      }
    }
  }

  if (!dryRun) await connectWithRetry()

  let ok = 0
  let fail = 0
  let skipped = 0
  const logPath = path.join(ROOT, 'backups', `r2-placeholder-upload-${Date.now()}.log`)
  const logLines = []

  async function ensureDb() {
    if (dryRun || !client) return
    try {
      await client.query('SELECT 1')
    } catch {
      await connectWithRetry()
      console.warn('DB connection renewed')
    }
  }

  for (const row of rows) {
    const { id, old_filename, placeholder_url } = row
    let buffer
    let sourceLabel = ''
    const localPath = placeholderUrlToLocalFile(placeholder_url)
    if (localPath && fs.existsSync(localPath)) {
      buffer = fs.readFileSync(localPath)
      sourceLabel = `local:${path.relative(ROOT, localPath)}`
    } else {
      try {
        buffer = await fetchUrlBuffer(placeholder_url)
        sourceLabel = `fetch:${placeholder_url}`
      } catch (e) {
        console.error(`[${id}] skip — no local file and fetch failed: ${e.message}`)
        logLines.push(`${id},FAIL,no-file,${placeholder_url}`)
        fail++
        continue
      }
    }

    const filenameForKey = old_filename || path.basename(localPath || placeholder_url)
    const key = sanitizeKey(id, filenameForKey)
    const mime = guessMime(filenameForKey)
    const newUrl = `${R2_PUBLIC_URL}/${key}`

    if (dryRun) {
      console.log(`[DRY_RUN] ${id} ${sourceLabel} -> ${newUrl}`)
      ok++
      continue
    }

    await ensureDb()
    try {
      const cur = await client.query('SELECT url FROM media WHERE id = $1', [id])
      const existing = cur.rows[0]?.url || ''
      if (existing.startsWith(R2_PUBLIC_URL)) {
        console.log(`[${id}] skip — already R2`)
        skipped++
        continue
      }
    } catch (e) {
      await ensureDb()
    }

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: mime,
          CacheControl: 'public, max-age=31536000',
        }),
      )
      await ensureDb()
      await client.query('UPDATE media SET url = $1 WHERE id = $2', [newUrl, id])
      console.log(`[${id}] OK ${sourceLabel} -> ${newUrl}`)
      logLines.push(`${id},OK,${newUrl}`)
      ok++
    } catch (e) {
      console.error(`[${id}] FAIL`, e.message || e)
      logLines.push(`${id},FAIL,${e.message}`)
      fail++
      await ensureDb().catch(() => {})
    }
  }

  if (client) await client.end()

  fs.writeFileSync(logPath, logLines.join('\n'), 'utf8')
  console.log(`\nDone. ok=${ok} skipped=${skipped} fail=${fail}. Log: ${logPath}`)
  console.log('DRY_RUN:', dryRun)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
