#!/usr/bin/env node
/**
 * scripts/cleanup-unused-media.js
 *
 * Conservative detector for unused `media` rows. It checks:
 *  - direct media FK columns (cover_image_id, logo_id, photo_id, etc.)
 *  - Payload relationship tables with a `media_id` column
 *  - common globals/media FK columns
 *
 * It does NOT delete by default. With --delete, it deletes DB rows and, if R2
 * credentials are available and the URL belongs to R2_PUBLIC_URL, the matching
 * R2 object.
 *
 * Usage:
 *  node scripts/cleanup-unused-media.js --output backups/unused-media-YYYYMMDD.csv
 *  DRY_RUN=1 node scripts/cleanup-unused-media.js --delete
 *  node scripts/cleanup-unused-media.js --delete
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const argv = parseArgs(process.argv.slice(2))
const dryRun = !!process.env.DRY_RUN
const doDelete = !!argv.delete
const out = argv.output || `backups/unused-media-${new Date().toISOString().slice(0,10)}.csv`

const dotenvPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(dotenvPath)) {
  fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m) return
    let v = m[2]
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
    if (!process.env[m[1]]) process.env[m[1]] = v
  })
}

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URI
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')
const R2_BUCKET = process.env.R2_BUCKET
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY

function parseArgs(args) {
  const parsed = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--delete') parsed.delete = true
    else if (arg === '--output' && args[i + 1]) {
      parsed.output = args[i + 1]
      i++
    }
  }
  return parsed
}

async function getTables(client) {
  const res = await client.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `)
  const tables = new Map()
  for (const row of res.rows) {
    if (!tables.has(row.table_name)) tables.set(row.table_name, [])
    tables.get(row.table_name).push({ name: row.column_name, type: row.data_type })
  }
  return tables
}

function getCandidateRefColumns(tables) {
  const known = {
    posts: ['featured_image_id', 'featuredimage', 'featured_image'],
    publications: ['cover_image_id', 'coverimage', 'cover_image', 'file_id', 'file'],
    events: ['featured_image_id', 'featuredimage', 'featured_image'],
    programmes: ['featured_image_id', 'featuredimage', 'featured_image'],
    gallery_items: ['image_id', 'image', 'media_id'],
    team: ['photo_id', 'photo'],
    partners: ['logo_id', 'logo'],
    testimonials: ['image_id', 'image'],
    users: ['avatar_id', 'avatar'],
    general_settings: ['logo_id', 'favicon_id', 'logo', 'favicon'],
    seo_settings: ['og_image_id', 'ogimage', 'og_image'],
    award_settings: ['background_image_id', 'backgroundimage', 'background_image'],
    contact_us_page_settings: ['map_background_image_id', 'mapbackgroundimage', 'map_background_image'],
    home_page_settings: ['main_image_id', 'secondary_image_id', 'background_image_id'],
    about_us_page_settings: ['story_image_1_id', 'story_image_2_id', 'story_image_3_id', 'story_image_4_id'],
  }

  const refs = []
  for (const [table, wanted] of Object.entries(known)) {
    const cols = tables.get(table)
    if (!cols) continue
    const available = new Set(cols.map((c) => c.name))
    for (const column of wanted) {
      if (available.has(column)) refs.push({ table, column })
    }
  }

  // Payload relationship tables usually contain a direct `media_id` column.
  for (const [table, cols] of tables.entries()) {
    if (table === 'media') continue
    if (cols.some((c) => c.name === 'media_id')) refs.push({ table, column: 'media_id' })
  }

  return refs.filter(
    (ref, index, arr) =>
      arr.findIndex((other) => other.table === ref.table && other.column === ref.column) === index,
  )
}

async function getUsageMap(client, refs) {
  const usage = new Map()
  for (const ref of refs) {
    try {
      const res = await client.query(
        `SELECT "${ref.column}"::int AS media_id, count(*)::int AS count
         FROM "${ref.table}"
         WHERE "${ref.column}" IS NOT NULL
         GROUP BY "${ref.column}"`,
      )
      for (const row of res.rows) {
        if (!usage.has(row.media_id)) usage.set(row.media_id, [])
        usage.get(row.media_id).push(`${ref.table}.${ref.column}(${row.count})`)
      }
    } catch (err) {
      console.warn(`Skipping ${ref.table}.${ref.column}: ${err.message}`)
    }
  }
  return usage
}

function keyFromR2Url(url) {
  if (!url || !R2_PUBLIC_URL) return null
  try {
    const publicBase = new URL(R2_PUBLIC_URL)
    const current = new URL(url)
    if (current.hostname !== publicBase.hostname) return null
    return decodeURIComponent(current.pathname.replace(/^\/+/, ''))
  } catch {
    return null
  }
}

function getR2Client() {
  if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null
  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  })
}

async function main(){
  if (!DATABASE_URL) {
    console.error('Missing DATABASE_URL or DATABASE_URI')
    process.exit(1)
  }

  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  try{ await client.connect() }catch(err){ console.error('DB connect failed:', err.message); process.exit(1) }

  const tables = await getTables(client)
  const refs = getCandidateRefColumns(tables)
  const cleanupRelTables = [
    'payload_locked_documents_rels',
    'payload_preferences_rels',
  ].filter((table) => tables.has(table) && tables.get(table).some((col) => col.name === 'media_id'))
  console.log(`Checking ${refs.length} media reference columns/tables`)

  const usage = await getUsageMap(client, refs)
  const res = await client.query(`
    SELECT id, filename, url, mime_type, filesize
    FROM media
    ORDER BY id
  `)

  const rows = res.rows.map((row) => ({
    ...row,
    usage: usage.get(row.id) || [],
  }))
  const candidates = rows.filter((row) => row.usage.length === 0)
  const csvLines = ['id,filename,url,mime_type,filesize,usage']
  for(const c of candidates){
    csvLines.push([
      c.id,
      c.filename || '',
      c.url || '',
      c.mime_type || '',
      c.filesize || '',
      '',
    ].map((v) => `"${String(v).replace(/"/g,'""')}"`).join(','))
  }
  fs.writeFileSync(out, csvLines.join('\n'))
  console.log(`Media rows: ${rows.length}`)
  console.log(`Used rows: ${rows.length - candidates.length}`)
  console.log(`Unused candidates: ${candidates.length}`)
  console.log('Wrote candidate unused list to', out)

  if (doDelete){
    const s3 = getR2Client()
    for(const c of candidates){
      const r2Key = keyFromR2Url(c.url)
      if (dryRun){
        console.log(`[DRY_RUN] would delete media id=${c.id} filename=${c.filename || ''} r2Key=${r2Key || '(none)'}`)
        continue
      }
      try{
        await client.query('BEGIN')
        for (const relTable of cleanupRelTables) {
          await client.query(`DELETE FROM "${relTable}" WHERE media_id=$1`, [c.id])
        }
        await client.query('DELETE FROM media WHERE id=$1', [c.id])
        await client.query('COMMIT')
        if (s3 && r2Key) {
          await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: r2Key }))
          console.log(`Deleted media ${c.id} and R2 object ${r2Key}`)
        } else {
          console.log(`Deleted media ${c.id} (no matching R2 object deleted)`)
        }
      }catch(err){ await client.query('ROLLBACK').catch(()=>{}); console.error('Delete failed', c.id, err.message) }
    }
  }

  await client.end()
}

main().catch(err=>{ console.error(err); process.exit(1) })
