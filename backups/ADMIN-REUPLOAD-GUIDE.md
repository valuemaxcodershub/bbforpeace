# Manual Media Reupload Guide

## Overview
**75 media files** are missing from the origin server and could not be recovered automatically. These files need to be manually reuploaded to the Payload CMS admin panel.

**Total Missing:**
- JPG: 33 files
- PNG: 17 files
- PDF: 16 files
- JPEG: 6 files
- WebP: 3 files

---

## Files to Reupload

See: `backups/admin-manual-reupload-report-2026-05-10.csv`

The CSV is ordered by **priority** (file type) to make bulk reuploads faster:
1. Start with PDFs (most critical for publications/reports)
2. Then images (JPG/PNG) used in galleries and blog posts
3. Finally WebP and other formats

---

## Step-by-Step Instructions

### 1. Access the Payload Admin Panel
- Navigate to: `https://bbforpeace.org/admin`
- Login with admin credentials

### 2. Go to Media Collection
- Click **Media** in the left sidebar
- Look for the **Upload** button

### 3. Batch Upload
- **For each file in the CSV:**
  - Click **Upload** or drag files into the Media library
  - The system will automatically assign the same filename
  - Payload will generate a new media URL in R2

### 4. After Upload - Critical Next Step
- **IMPORTANT:** Admin must provide the mapping file once reuploads are complete
- Mapping format (CSV):
  ```
  old_id,old_filename,new_url
  1,PXL_20251008_123053054 (2).jpg,https://pub-0963e194120e46498b29b2d9ccdabb16.r2.dev/media/NEW_ID/filename.jpg
  3,Northwest22.png,https://pub-0963e194120e46498b29b2d9ccdabb16.r2.dev/media/NEW_ID/filename.png
  ...
  ```

---

## Notes

- **Origin files are lost** (HTTP 404 errors) — these cannot be auto-recovered
- Files already in R2 are accessible: `https://pub-0963e194120e46498b29b2d9ccdabb16.r2.dev/media/`
- Admin can reupload original files or new versions
- Once mapping is provided, a script will safely update all `media.url` references in the database

---

## Temporary Placeholder Workflow (optional)

If you want pages to remain visually populated while admins perform manual reuploads, follow this temporary placeholder process:

1. Choose a placeholder asset to use for images (we recommend the site logo). Default placeholder URL used by scripts:

  https://pub-0963e194120e46498b29b2d9ccdabb16.r2.dev/media/  (or `https://bbforpeace.org/images/logo.jpg`)

2. Run the placeholder assignment script (safe DRY_RUN mode available):

  DRY_RUN=1 node scripts/assign-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv

  When ready to apply to the DB (ensure DB is reachable):

  node scripts/assign-placeholders.js --report backups/admin-manual-reupload-report-2026-05-10.csv

  The script will write `backups/placeholder-mapping-YYYYMMDD.csv` and a SQL backup `backups/placeholder-sql-YYYYMMDD.sql` before changing rows.

3. Admins can then go through pages and replace the placeholders by uploading the correct file(s) into Payload and collecting the new URL(s).

4. After reuploads are complete admin should provide a mapping CSV (`old_id,old_filename,new_url`). Apply mapping with:

  DRY_RUN=1 node scripts/apply-mapping.js --mapping backups/mapping-from-admin.csv
  node scripts/apply-mapping.js --mapping backups/mapping-from-admin.csv

  A backup SQL will be created for audit/rollback.

5. Once mapping applied and verified, remove any unused media rows (conservative detection):

  DRY_RUN=1 node scripts/cleanup-unused-media.js --output backups/unused-media-YYYYMMDD.csv

  Review `backups/unused-media-YYYYMMDD.csv`. When confident, delete with:

  node scripts/cleanup-unused-media.js --output backups/unused-media-YYYYMMDD.csv --delete

Notes:
- All scripts support `DRY_RUN=1` — use it until DB connectivity is confirmed.
- Scripts create backups in `backups/` for audit and rollback.
- If you need different placeholder assets (e.g., PDF icon), update `scripts/assign-placeholders.js` to point to that URL.


## Support
For questions or issues with the reupload process, contact the development team with the mapping file.
