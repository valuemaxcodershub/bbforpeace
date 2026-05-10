#!/usr/bin/env node
/**
 * scripts/assign-placeholders.js
 *
 * Assign temporary placeholder URLs to missing media rows and emit a mapping CSV
 * Usage:
 *  DRY_RUN=1 node scripts/assign-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
 *  node scripts/assign-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
 *
 * Behavior:
 *  - Reads the prioritized report CSV (id,filename,file_type,...)
 *  - Picks a placeholder URL per file_type (default: site logo)
 *  - Writes `backups/placeholder-mapping-YYYYMMDD.csv` with rows: old_id,old_filename,placeholder_url
 *  - If DRY_RUN is not set, attempts to update `media.url` in DB and logs SQL backup to backups/placeholder-sql-YYYYMMDD.sql
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const csvParse = require('csv-parse/lib/sync')

const argv = require('minimist')(process.argv.slice(2))
const reportPath = argv.report || 'backups/admin-manual-reupload-report-2026-05-10.csv'
const dryRun = !!process.env.DRY_RUN
const OUT_DIR = path.resolve('backups')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

function today() {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
}

async function main(){
  if(!fs.existsSync(reportPath)){
    console.error('Report not found:', reportPath)
    process.exit(1)
  }

  const csv = fs.readFileSync(reportPath, 'utf8')
  const rows = csvParse(csv, { columns: true, skip_empty_lines:true })

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://bbforpeace.org'
  const placeholderImage = `${site}/images/logo.jpg`
  const placeholderPdf = `${site}/images/logo.jpg`

  const outCsv = []
  const sqlBackupLines = []

  let client
  if (!dryRun) {
    client = new Client({ connectionString: process.env.DATABASE_URI })
    try { await client.connect() } catch (err) {
      console.error('DB connect failed:', err.message)
      console.error('Run with DRY_RUN=1 to preview mapping without DB updates')
      process.exit(1)
    }
  }

  for(const r of rows){
    const oldId = r.id
    const filename = r.filename
    const fileType = (r.file_type || '').toLowerCase()
    let placeholder = placeholderImage
    if (fileType === 'pdf') placeholder = placeholderPdf

    outCsv.push([oldId, filename, placeholder].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))

    const backupSql = `-- backup placeholder assign for media.id=${oldId}\nSELECT id, url FROM media WHERE id=${oldId};\nUPDATE media SET url='${placeholder.replace(/'/g,"''")}' WHERE id=${oldId};\n`
    sqlBackupLines.push(backupSql)

    if (!dryRun) {
      try {
        await client.query('BEGIN')
        // store previous URL in a backup table or a log file; here we just run update and keep a backup SQL file
        await client.query('UPDATE media SET url=$1 WHERE id=$2', [placeholder, oldId])
        await client.query('COMMIT')
      } catch (err) {
        await client.query('ROLLBACK').catch(()=>{})
        console.error('Failed update id=', oldId, err.message)
      }
    }
  }

  const outFile = path.join(OUT_DIR, `placeholder-mapping-${today()}.csv`)
  fs.writeFileSync(outFile, 'old_id,old_filename,placeholder_url\n' + outCsv.join('\n'))

  const sqlFile = path.join(OUT_DIR, `placeholder-sql-${today()}.sql`)
  fs.writeFileSync(sqlFile, sqlBackupLines.join('\n'))

  if (!dryRun) await client.end()

  console.log('Wrote mapping:', outFile)
  console.log('Wrote SQL backup:', sqlFile)
  console.log('DRY_RUN:', !!dryRun)
}

main().catch(err=>{ console.error(err); process.exit(1) })
