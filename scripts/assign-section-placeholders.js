#!/usr/bin/env node
/**
 * Assign placeholder URLs from local public/ folders by CMS usage:
 * - partners logo -> /images/partners/*
 * - team photo + category board -> /images/board/*
 * - team photo + other categories -> /images/ourteam/*
 * - publications + annual-report -> cover/images -> /images/reports/*, PDF files -> /documents/project-report-placeholder-*.pdf
 * - everything else -> round-robin any image under public/images (recursive)
 *
 * Usage:
 *   set DRY_RUN=1 && node scripts/assign-section-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
 *   node scripts/assign-section-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const argv = process.argv.slice(2)
let reportPath = 'backups/admin-manual-reupload-report-2026-05-10.csv'
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--report' && argv[i + 1]) {
    reportPath = argv[i + 1]
    i++
  }
}

const dryRun = !!process.env.DRY_RUN
const ROOT = path.resolve(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const OUT_DIR = path.join(ROOT, 'backups')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

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
const site =
  (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '') ||
  'https://www.bbforpeace.org'

const IMG_EXT = /\.(png|jpe?g|gif|webp|svg)$/i
const PDF_EXT = /\.pdf$/i

function listFilesRecursive(dir, filterRe) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) out.push(...listFilesRecursive(full, filterRe))
    else if (!filterRe || filterRe.test(name)) out.push(full)
  }
  return out.sort()
}

function publicUrlFromAbsolute(absPath) {
  const rel = path.relative(PUBLIC, absPath).split(path.sep).join('/')
  const segments = rel.split('/').map((s) => encodeURIComponent(s))
  return `${site}/${segments.join('/')}`
}

function parseReport(csvPath) {
  const txt = fs.readFileSync(csvPath, 'utf8')
  const lines = txt.split(/\r?\n/).filter(Boolean)
  const header = lines.shift()
  if (!header.includes('id')) {
    console.error('Unexpected CSV header:', header)
    process.exit(1)
  }
  const rows = []
  for (const line of lines) {
    const m = line.match(/^"?(\d+)"?\s*,\s*"?(.*?)"?\s*,\s*"?([A-Za-z]+)"?/)
    if (!m) continue
    rows.push({
      id: Number(m[1]),
      filename: m[2].replace(/^"|"$/g, ''),
      file_type: (m[3] || '').toUpperCase(),
    })
  }
  return rows
}

function todayStamp() {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function pickCycle(pool, key, counters) {
  if (!pool.length) return null
  const cur = counters[key] ?? 0
  const i = cur % pool.length
  counters[key] = cur + 1
  return pool[i]
}

async function resolveDbColumns(client) {
  const cols = async (table) => {
    const r = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      [table],
    )
    return new Set(r.rows.map((x) => x.column_name))
  }
  const partners = await cols('partners')
  const team = await cols('team')
  const pubs = await cols('publications')

  return {
    partnersLogo: partners.has('logo_id')
      ? 'logo_id'
      : partners.has('logo')
        ? 'logo'
        : null,
    teamPhoto: team.has('photo_id')
      ? 'photo_id'
      : team.has('photo')
        ? 'photo'
        : null,
    teamCategory: team.has('category') ? 'category' : null,
    pubCover: pubs.has('cover_image_id')
      ? 'cover_image_id'
      : pubs.has('coverimage')
        ? 'coverimage'
        : null,
    pubFile: pubs.has('file_id') ? 'file_id' : pubs.has('file') ? 'file' : null,
    pubSub: pubs.has('sub_menu')
      ? 'sub_menu'
      : pubs.has('submenu')
        ? 'submenu'
        : null,
  }
}

async function classify(client, mediaId, dbCols) {
  if (dbCols.partnersLogo) {
    const q = `SELECT id FROM partners WHERE ${dbCols.partnersLogo} = $1 LIMIT 1`
    const r = await client.query(q, [mediaId]).catch(() => ({ rows: [] }))
    if (r.rows.length) return { kind: 'partners' }
  }

  if (dbCols.teamPhoto && dbCols.teamCategory) {
    const q = `SELECT ${dbCols.teamCategory} AS cat FROM team WHERE ${dbCols.teamPhoto} = $1 LIMIT 1`
    const r = await client.query(q, [mediaId]).catch(() => ({ rows: [] }))
    if (r.rows.length) {
      const cat = r.rows[0].cat
      if (cat === 'board') return { kind: 'board' }
      return { kind: 'ourteam' }
    }
  }

  if ((dbCols.pubCover || dbCols.pubFile) && dbCols.pubSub) {
    const conds = []
    if (dbCols.pubCover) conds.push(`${dbCols.pubCover} = $1`)
    if (dbCols.pubFile) conds.push(`${dbCols.pubFile} = $1`)
    const where = conds.join(' OR ')
    const q = `SELECT ${dbCols.pubSub} AS sm FROM publications WHERE ${where} LIMIT 1`
    const r = await client.query(q, [mediaId]).catch(() => ({ rows: [] }))
    if (r.rows.length) {
      const sm = r.rows[0].sm
      let refKind = null
      if (dbCols.pubCover) {
        const c = await client
          .query(
            `SELECT 1 FROM publications WHERE ${dbCols.pubCover} = $1 LIMIT 1`,
            [mediaId],
          )
          .catch(() => ({ rows: [] }))
        if (c.rows.length) refKind = 'cover'
      }
      if (!refKind && dbCols.pubFile) {
        const f = await client
          .query(`SELECT 1 FROM publications WHERE ${dbCols.pubFile} = $1 LIMIT 1`, [mediaId])
          .catch(() => ({ rows: [] }))
        if (f.rows.length) refKind = 'file'
      }
      if (sm === 'annual-report')
        return { kind: 'annual-report', refKind: refKind || undefined }
      return { kind: 'publications-other', refKind: refKind || undefined }
    }
  }

  return { kind: 'general' }
}

function buildPools() {
  const partnersDir = path.join(PUBLIC, 'images', 'partners')
  const ourteamDir = path.join(PUBLIC, 'images', 'ourteam')
  const boardDir = path.join(PUBLIC, 'images', 'board')
  const reportsDir = path.join(PUBLIC, 'images', 'reports')
  const docsDir = path.join(PUBLIC, 'documents')
  const imagesRoot = path.join(PUBLIC, 'images')

  const partnersPool = listFilesRecursive(partnersDir, IMG_EXT)
  const ourteamPool = listFilesRecursive(ourteamDir, IMG_EXT)
  const boardPool = listFilesRecursive(boardDir, IMG_EXT)
  const reportsPool = listFilesRecursive(reportsDir, IMG_EXT)
  const pdfPool = listFilesRecursive(docsDir, PDF_EXT).filter((p) =>
    path.basename(p).includes('project-report-placeholder'),
  )
  const reservedDirs = new Set([partnersDir, ourteamDir, boardDir, reportsDir].map((d) =>
    path.normalize(d),
  ))
  const allUnderImages = listFilesRecursive(imagesRoot, IMG_EXT)
  const generalPool = allUnderImages.filter((abs) => {
    const dir = path.normalize(path.dirname(abs))
    for (const r of reservedDirs) {
      if (dir === r || dir.startsWith(r + path.sep)) return false
    }
    return true
  })

  return {
    partnersPool,
    ourteamPool,
    boardPool,
    reportsPool,
    pdfPool,
    generalPool,
    /** Full tree — only used when generalPool is empty */
    allImagesPool: generalPool.length ? generalPool : allUnderImages,
  }
}

function choosePlaceholder(row, classification, pools, counters) {
  const isPdf =
    row.file_type === 'PDF' || PDF_EXT.test(row.filename || '')
  const isImage =
    ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG'].includes(row.file_type) ||
    IMG_EXT.test(row.filename || '')

  const { kind, refKind } = classification

  if (kind === 'partners') {
    const f = pickCycle(pools.partnersPool, 'partners', counters)
    return f ? publicUrlFromAbsolute(f) : pickGeneralImage(pools, counters)
  }
  if (kind === 'board') {
    const f = pickCycle(pools.boardPool, 'board', counters)
    return f ? publicUrlFromAbsolute(f) : pickGeneralImage(pools, counters)
  }
  if (kind === 'ourteam') {
    const f = pickCycle(pools.ourteamPool, 'ourteam', counters)
    return f ? publicUrlFromAbsolute(f) : pickGeneralImage(pools, counters)
  }

  if (kind === 'annual-report') {
    if (refKind === 'file' || isPdf) {
      const p = pickCycle(pools.pdfPool, 'pdf', counters)
      if (p) return publicUrlFromAbsolute(p)
      const r = pickCycle(pools.reportsPool, 'reports', counters)
      return r ? publicUrlFromAbsolute(r) : pickGeneralImage(pools, counters)
    }
    const r = pickCycle(pools.reportsPool, 'reports', counters)
    return r ? publicUrlFromAbsolute(r) : pickGeneralImage(pools, counters)
  }

  if (kind === 'publications-other') {
    if (isPdf) {
      const p = pickCycle(pools.pdfPool, 'pdf_pub', counters)
      if (p) return publicUrlFromAbsolute(p)
    }
    return pickGeneralImage(pools, counters)
  }

  if (isPdf) {
    const p = pickCycle(pools.pdfPool, 'pdf_general', counters)
    if (p) return publicUrlFromAbsolute(p)
  }
  return pickGeneralImage(pools, counters)
}

function pickGeneralImage(pools, counters) {
  const pool = pools.generalPool?.length ? pools.generalPool : pools.allImagesPool
  const f = pickCycle(pool, 'general', counters)
  return f ? publicUrlFromAbsolute(f) : `${site}/images/logo.jpg`
}

async function main() {
  const absReport = path.isAbsolute(reportPath)
    ? reportPath
    : path.join(ROOT, reportPath)
  if (!fs.existsSync(absReport)) {
    console.error('Report not found:', absReport)
    process.exit(1)
  }

  const rows = parseReport(absReport)
  const pools = buildPools()

  console.log('Pools:', {
    partners: pools.partnersPool.length,
    ourteam: pools.ourteamPool.length,
    board: pools.boardPool.length,
    reports: pools.reportsPool.length,
    pdfPlaceholders: pools.pdfPool.length,
    generalImages: pools.generalPool.length,
    allImagesFallback: pools.allImagesPool.length,
  })

  if (!pools.generalPool.length && !pools.allImagesPool.length) {
    console.warn('No images found under public/images — placeholders may fall back to logo URL.')
  }

  let client
  let dbCols = {
    partnersLogo: 'logo_id',
    teamPhoto: 'photo_id',
    teamCategory: 'category',
    pubCover: 'cover_image_id',
    pubFile: 'file_id',
    pubSub: 'sub_menu',
  }

  if (!DATABASE_URL) {
    console.warn('Missing DATABASE_URL — classifying all rows as general (set .env for accurate sections).')
  } else {
    client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
    await client.connect()
    dbCols = await resolveDbColumns(client)
    console.log('DB columns:', dbCols)
  }

  const counters = {}
  const summary = {}
  const outLines = []
  const sqlLines = []

  for (const row of rows) {
    const classification = client
      ? await classify(client, row.id, dbCols)
      : { kind: 'general' }
    const kind = classification.kind
    summary[kind] = (summary[kind] || 0) + 1

    const placeholder = choosePlaceholder(row, classification, pools, counters)
    outLines.push(
      [row.id, row.filename, placeholder, kind].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','),
    )

    const esc = placeholder.replace(/'/g, "''")
    sqlLines.push(
      `-- id=${row.id} kind=${kind}\nSELECT id, url FROM media WHERE id=${row.id};\nUPDATE media SET url='${esc}' WHERE id=${row.id};\n`,
    )

    if (!dryRun && client) {
      try {
        await client.query('BEGIN')
        await client.query('UPDATE media SET url=$1 WHERE id=$2', [placeholder, row.id])
        await client.query('COMMIT')
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {})
        console.error('Update failed id=', row.id, err.message)
      }
    }
  }

  if (client) await client.end()

  const ts = todayStamp()
  const mappingFile = path.join(OUT_DIR, `placeholder-mapping-sections-${ts}.csv`)
  const sqlFile = path.join(OUT_DIR, `placeholder-sql-sections-${ts}.sql`)
  fs.writeFileSync(
    mappingFile,
    'old_id,old_filename,placeholder_url,section_kind\n' + outLines.join('\n'),
  )
  fs.writeFileSync(sqlFile, sqlLines.join('\n'))

  console.log('Classification counts:', summary)
  console.log('Wrote', mappingFile)
  console.log('Wrote', sqlFile)
  console.log('DRY_RUN:', dryRun, dryRun ? '(no DB updates)' : '(DB updated)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
