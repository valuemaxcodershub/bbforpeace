#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const reportPath = process.argv[2] || 'backups/admin-manual-reupload-report-2026-05-10.csv'
if (!fs.existsSync(reportPath)) { console.error('Report not found:', reportPath); process.exit(1) }

const csv = fs.readFileSync(reportPath, 'utf8')

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

const imagesDir = path.resolve('public','images')
if (!fs.existsSync(imagesDir)) { console.error('Images dir not found:', imagesDir); process.exit(1) }
const files = walk(imagesDir)
const nameMap = new Map()
for(const f of files){
  const name = path.basename(f)
  if (!nameMap.has(name)) nameMap.set(name, [])
  nameMap.get(name).push(f)
}

const found = []
for(const r of rows){
  const fname = r.filename.replace(/\"/g,'')
  if (nameMap.has(fname)){
    for(const p of nameMap.get(fname)){
      found.push({ id: r.id, filename: fname, path: p })
    }
  }
}

const outPath = path.join('backups','found-local-missing.csv')
const lines = ['old_id,filename,local_path']
for(const f of found) lines.push(`"${f.id}","${f.filename}","${f.path.replace(/"/g,'""')}"`)
fs.writeFileSync(outPath, lines.join('\n'))
console.log('Wrote', outPath, 'found', found.length, 'matches')
for(const f of found.slice(0,50)) console.log(f.filename, '->', f.path)
