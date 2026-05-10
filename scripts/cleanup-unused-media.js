#!/usr/bin/env node
/**
 * scripts/cleanup-unused-media.js
 *
 * Conservative detector for unused `media` rows. This script attempts to find media rows
 * that are not referenced by common content collections. It does NOT delete by default.
 *
 * Usage:
 *  DRY_RUN=1 node scripts/cleanup-unused-media.js --output backups/unused-media-YYYYMMDD.csv
 *  node scripts/cleanup-unused-media.js --output backups/unused-media-YYYYMMDD.csv --delete
 *
 * Notes:
 *  - Payload collections vary by project. This script checks common tables: posts, pages, publications, events
 *  - Adjust SQL to match your schema if different. It searches for media.id occurrences inside JSON columns and relationship fields.
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const argv = require('minimist')(process.argv.slice(2))
const dryRun = !!process.env.DRY_RUN
const doDelete = !!argv.delete
const out = argv.output || `backups/unused-media-${new Date().toISOString().slice(0,10)}.csv`

async function main(){
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  try{ await client.connect() }catch(err){ console.error('DB connect failed:', err.message); process.exit(1) }

  // This query attempts to list media IDs and a count of references across common collections.
  // It is intentionally conservative.
  const sql = `
  WITH all_media AS (
    SELECT id, url FROM media
  ),
  refs AS (
    SELECT m.id as media_id,
      COALESCE((SELECT count(*) FROM posts p WHERE p.payload->>'featuredImage' = m.id::text),0) as post_featured_count,
      COALESCE((SELECT count(*) FROM posts p WHERE p.payload::text LIKE '%' || m.url || '%'),0) as post_body_count
    FROM all_media m
  )
  SELECT a.id, a.url, (refs.post_featured_count + refs.post_body_count) as ref_count
  FROM all_media a
  LEFT JOIN refs ON refs.media_id=a.id
  ORDER BY ref_count ASC NULLS FIRST
  LIMIT 1000;
  `

  let res
  try{ res = await client.query(sql) }catch(err){ console.error('Query failed', err.message); await client.end(); process.exit(1) }

  const rows = res.rows
  const candidates = rows.filter(r => Number(r.ref_count) === 0)
  const csvLines = ['id,url,ref_count']
  for(const c of candidates){ csvLines.push(`"${c.id}","${String(c.url).replace(/"/g,'""')}","${c.ref_count}"`) }
  fs.writeFileSync(out, csvLines.join('\n'))
  console.log('Wrote candidate unused list to', out)

  if (doDelete){
    for(const c of candidates){
      if (dryRun){ console.log('[DRY_RUN] would delete media id=', c.id); continue }
      try{
        await client.query('BEGIN')
        await client.query('DELETE FROM media WHERE id=$1', [c.id])
        await client.query('COMMIT')
        console.log('Deleted', c.id)
      }catch(err){ await client.query('ROLLBACK').catch(()=>{}); console.error('Delete failed', c.id, err.message) }
    }
  }

  await client.end()
}

main().catch(err=>{ console.error(err); process.exit(1) })
