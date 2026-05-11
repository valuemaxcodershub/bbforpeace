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

