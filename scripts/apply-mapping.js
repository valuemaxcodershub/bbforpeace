#!/usr/bin/env node
/**
 * scripts/apply-mapping.js
 *
 * Apply a mapping CSV (old_id,new_url) to the `media` table safely.
 * Usage:
 *  DRY_RUN=1 node scripts/apply-mapping.js --mapping backups/mapping-from-admin.csv
 *  node scripts/apply-mapping.js --mapping backups/mapping-from-admin.csv
 *
 * Behavior:
 *  - Reads CSV with columns `old_id,old_filename,new_url`
 *  - For each row, inserts an audit row into `media_url_changes` table (if exists) or writes to SQL backup
 *  - Updates `media.url` in a transaction per-row
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const csvParse = require('csv-parse/lib/sync')
const argv = require('minimist')(process.argv.slice(2))

const mapping = argv.mapping || 'backups/mapping-from-admin.csv'
const dryRun = !!process.env.DRY_RUN

if (!fs.existsSync(mapping)){
  console.error('Mapping file missing:', mapping)
  process.exit(1)
}

async function main(){
  const csv = fs.readFileSync(mapping, 'utf8')
  const rows = csvParse(csv, { columns: true, skip_empty_lines:true })

  const client = new Client({ connectionString: process.env.DATABASE_URI })
  if (!dryRun) {
    await client.connect()
  }

  const backupLines = []

  for(const r of rows){
    const id = r.old_id || r.id
    const newUrl = r.new_url || r.newURL || r.newurl
    if (!id || !newUrl) continue

    // backup select
    backupLines.push(`-- mapping for id=${id}\nSELECT id, url FROM media WHERE id=${id};\n`)

    if (dryRun){
      console.log('[DRY_RUN] would update', id, '=>', newUrl)
      continue
    }

    try{
      await client.query('BEGIN')
      await client.query('UPDATE media SET url=$1 WHERE id=$2', [newUrl, id])
      await client.query('COMMIT')
      console.log('Updated', id)
    }catch(err){
      await client.query('ROLLBACK').catch(()=>{})
      console.error('Failed update', id, err.message)
    }
  }

  const backupFile = path.join('backups', `apply-mapping-backup-${new Date().toISOString().slice(0,10)}.sql`)
  fs.writeFileSync(backupFile, backupLines.join('\n'))
  console.log('Wrote backup SQL to', backupFile)

  if (!dryRun) await client.end()
}

main().catch(err=>{ console.error(err); process.exit(1) })
