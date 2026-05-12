# Media Migration: Vercel Blob → Cloudflare R2

**Status**: R2 bucket configured in `payload.config.ts` with S3Storage plugin enabled.
**Next Step**: Deploy to Vercel → live site will use R2 exclusively for new uploads and media operations.

---

## Deployment Checklist (Before Going Live)

### ✅ Code & Config Ready
- [x] Payload configured with `@payloadcms/storage-s3` plugin
- [x] R2 credentials in `.env` (not in git)
- [x] Media collection configured for R2 storage
- [x] Scripts committed to git for recovery & migration workflows

### 📋 Pre-Deployment Verification

1. **Verify .env has R2 credentials** (NOT in git):
   ```
   R2_BUCKET=<your-bucket-name>
   R2_ACCESS_KEY_ID=<your-key>
   R2_SECRET_ACCESS_KEY=<your-secret>
   R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
   R2_REGION=auto
   R2_PUBLIC_URL=https://pub-<hash>.r2.dev
   DATABASE_URL=postgresql://...  (Supabase)
   ```

2. **Test locally** (if DB is reachable):
   ```bash
   npm run dev
   # Visit http://localhost:3000/admin
   # Try uploading a test image to Media collection
   # Verify it stores in R2 bucket
   ```

3. **Check R2 bucket is public** (for media URLs to be accessible):
   - Cloudflare R2 → Bucket Settings → Public bucket
   - OR set up custom domain & CORS if needed

---

## Deployment to Vercel

1. **Ensure all env vars are set in Vercel dashboard**:
   - Project Settings → Environment Variables
   - Add `R2_*` and `DATABASE_URL` vars (they're masked in git)

2. **Push code to GitHub** (already done ✅):
   ```bash
   git push origin main
   ```

3. **Vercel auto-deploys** from main branch
   - Monitor build logs: https://vercel.com/valuemaxcodershub/bbforpeace
   - Deployment takes ~2-3 minutes

4. **Verify live admin panel**:
   - Navigate to https://bbforpeace.org/admin
   - Try uploading a test image to Media
   - Confirm new uploads appear in R2 bucket

---

## What Happens After Deploy

### New Uploads
- All media uploaded via Payload admin will go to R2 automatically
- Media URLs will be: `https://pub-<hash>.r2.dev/media/<id>/<filename>`

### Existing Media (from Vercel Blob)
- URLs in database still point to old Vercel blob URLs
- These will return 404 if Vercel blob is decommissioned
- **Solution**: Run placeholder assignment + admin reupload workflow

### Missing Media Workflow
1. **Deploy live** → see which media links return 404 on live site
2. **Run DRY_RUN**:
   ```bash
   DRY_RUN=1 node scripts/assign-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
   ```
3. **Assign placeholders** to replace missing media:
   ```bash
   node scripts/assign-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
   ```
4. **Admin reuploads files** via Payload admin panel
5. **Admin provides mapping** CSV
6. **Run apply-mapping**:
   ```bash
   node scripts/apply-mapping.js --mapping backups/mapping-from-admin.csv
   ```
7. **Cleanup unused media** (optional):
   ```bash
   node scripts/cleanup-unused-media.js --output backups/unused-media.csv --delete
   ```

### Section-aware placeholders (local `public/` assets)

Use this when you want placeholders to mirror folders under `public/images/` instead of a single logo URL.

| CMS usage | Local folder (under `public/images/`) |
|-----------|----------------------------------------|
| Partner logos (`partners.logo_id`) | `partners/` |
| Team photos — Meet Our Team (`team.photo_id`, category ≠ board) | `ourteam/` |
| Board of Trustees (`team.photo_id`, category = board) | `board/` |
| Annual reports (`publications`, `sub_menu = annual-report`) | `reports/` for covers; PDF slots use `documents/project-report-placeholder-*.pdf` |
| Everything else | Any image under `images/` **except** the four folders above |

Commands (preview first):
```powershell
$env:DRY_RUN="1"; node scripts/assign-section-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
```
Apply updates (requires `DATABASE_URL` in `.env`):
```powershell
node scripts/assign-section-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv
```

Outputs `backups/placeholder-mapping-sections-YYYYMMDD.csv` and `backups/placeholder-sql-sections-YYYYMMDD.sql`.

Placeholder URLs use `NEXT_PUBLIC_SITE_URL` (default `https://www.bbforpeace.org`). Deploy or sync `public/` so those paths exist on production.

**Classification** follows PostgreSQL FKs: only rows still referencing a missing `media.id` get the matching folder. If no team/board/annual-report rows appear in the summary, none of the missing IDs are linked that way in the database (IDs may only appear in posts, globals JSON, etc.).

### Push placeholders into Cloudflare R2 (finish migration for missing-media batch)

After placeholders point at `https://www.bbforpeace.org/...` static files (or you have a `placeholder-mapping-sections-*.csv`), upload those bytes to R2 and set `media.url` to the public R2 URL (same key shape as Payload: `media/<id>/<sanitized-filename>`).

Requires `.env`: `DATABASE_URL`, `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`.

```powershell
# Preview
$env:DRY_RUN="1"; node scripts/push-placeholder-media-to-r2.js --mapping backups/placeholder-mapping-sections-20260512.csv

# Apply
node scripts/push-placeholder-media-to-r2.js --mapping backups/placeholder-mapping-sections-20260512.csv
```

Uses **local files under `public/`** when paths match; otherwise fetches the placeholder URL.

### Migrate any remaining legacy URLs to R2

For media rows that still point at Vercel Blob or other non-R2 URLs (outside the placeholder batch), run:

```bash
node scripts/migrate-blob-to-r2.js
```

Optional: `node scripts/migrate-blob-to-r2.js --limit 50` for a smaller test. Rows whose `url` already starts with `R2_PUBLIC_URL` are skipped.

### NPM shortcuts

From the project root (with `.env` loaded — same shell as other scripts):

```bash
npm run media:placeholders          # section-aware placeholder URLs -> DB (after CSV report exists)
npm run media:push-placeholders-r2 # placeholder CSV -> upload bytes to R2 -> DB urls (optional --mapping path)
npm run media:migrate-legacy-to-r2 # remaining non-R2 media URLs -> fetch & upload to R2
```

---

## Database Connection Notes

- **Supabase PostgreSQL** is the source of truth
- Connection: `DATABASE_URL=postgresql://...`
- Media table stores `id, url, filename, mimeType` (among others)
- All migration scripts assume PostgreSQL (via `pg` client library)

---

## R2 Migration Scripts (in `/scripts/`)

| Script | Purpose | Usage |
|--------|---------|-------|
| `migrate-blob-to-r2.js` | Move existing blob files to R2 | `node scripts/migrate-blob-to-r2.js` |
| `assign-placeholders.js` | Replace missing media with placeholder URLs | `node scripts/assign-placeholders.js --report <csv>` |
| `assign-section-placeholders.js` | Same as above, but picks URLs from `public/images/partners`, `ourteam`, `board`, `reports`, etc. by CMS usage | `node scripts/assign-section-placeholders.js --report <csv>` |
| `push-placeholder-media-to-r2.js` | Upload placeholder assets to R2 and set `media.url` (from section mapping CSV) | `node scripts/push-placeholder-media-to-r2.js --mapping backups/placeholder-mapping-sections-*.csv` |
| `apply-mapping.js` | Apply admin mapping to update DB | `node scripts/apply-mapping.js --mapping <csv>` |
| `cleanup-unused-media.js` | Find and remove orphaned media | `node scripts/cleanup-unused-media.js --output <csv> --delete` |
| `find-local-similar-*.js` | Scan for missing files in local storage | `node scripts/find-local-similar-all.js` |

---

## Next Steps (After Live Deploy)

1. **Deploy code to Vercel** (triggers auto-build)
2. **Admin visits live site** and checks which media is missing
3. **Admin uses Payload admin** to re-upload files
4. **Dev runs mapping script** once mapping file is provided
5. **Full R2 migration complete** with zero downtime

---

## Troubleshooting

### Admin uploads not appearing in R2
- Check R2 credentials in Vercel env vars
- Verify bucket exists and is accessible
- Check Payload logs for S3Client errors

### Old blob URLs still 404
- This is expected; they need to be replaced via placeholder + reupload workflow
- Once mapping applied, all media.url will point to R2

### DB unreachable when running scripts
- Ensure DATABASE_URL is set locally
- Test connection: `node scripts/test-db-conn.js`
- If Supabase is unreachable, wait for network restore or use local DB

