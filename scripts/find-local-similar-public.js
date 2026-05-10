#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const reportPath = process.argv[2] || 'backups/admin-manual-reupload-report-2026-05-10.csv'
if (!fs.existsSync(reportPath)) { console.error('Report not found:', reportPath); process.exit(1) }
const csv = fs.readFileSync(reportPath,'utf8')
function parseCsvLine(line){
  const res = []
  let cur = ''
  let inQuotes = false
  for(let i=0;i<line.length;i++){
    const ch = line[i]
    if (ch==='"'){
      if (inQuotes && line[i+1]==='"') { cur += '"'; i++; continue }
      inQuotes = !inQuotes
      continue
    }
    if (ch===',' && !inQuotes){ res.push(cur); cur=''; continue }
    cur += ch
  }
  res.push(cur)
  return res
}
function parseCsvWithHeader(text){
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0)
  if (lines.length===0) return []
  const header = parseCsvLine(lines[0])
  const cols = header.map(h=>h.trim())
  const out = []
  for(let i=1;i<lines.length;i++){
    const vals = parseCsvLine(lines[i])
    if (vals.length===0) continue
    const obj = {}
    for(let j=0;j<cols.length;j++) obj[cols[j]] = vals[j] || ''
    out.push(obj)
  }
  return out
}
const rows = parseCsvWithHeader(csv)

function walk(dir){
  let out = []
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for(const it of items){
    const p = path.join(dir, it.name)
    if (it.isDirectory()) out = out.concat(walk(p))
    else out.push(p)
  }
  return out
}
const imagesDir = path.resolve('public')
if (!fs.existsSync(imagesDir)) { console.error('Public dir not found:', imagesDir); process.exit(1) }
const files = walk(imagesDir)

function norm(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'') }

const similar = []
for(const r of rows){
  const fname = (r.filename||'').replace(/\"/g,'')
  const base = fname.replace(/\.[^.]+$/,'')
  const nbase = norm(base)
  for(const f of files){
    const localName = path.basename(f)
    const nlocal = norm(localName)
    if (!nbase) continue
    if (nlocal.includes(nbase) || nbase.includes(nlocal)){
      similar.push({ id: r.id, missing: fname, local: f })
    }
  }
}

const outPath = path.join('backups','found-local-similar-public.csv')
const lines = ['old_id,missing_filename,local_path']
for(const s of similar) lines.push(`"${s.id}","${s.missing}","${s.local.replace(/"/g,'""')}"`)
fs.writeFileSync(outPath, lines.join('\n'))
console.log('Wrote', outPath, 'found', similar.length, 'similar matches')
for(const s of similar.slice(0,50)) console.log(s.missing,'->',s.local)
