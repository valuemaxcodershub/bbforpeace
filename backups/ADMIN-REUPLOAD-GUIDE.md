# Historical Manual Media Reupload Guide

This guide is retained for context only.

The manual reupload and placeholder workflow has been completed:

- Media has been moved to Cloudflare R2.
- Images are displaying from R2.
- Unused media records and matching R2 objects have been cleaned.
- Generated CSV/SQL/log artifacts were removed from the repository workspace.
- One-off migration scripts were removed after completion.

## Current Admin Media Workflow

Admins should now upload or replace media directly from Payload admin:

1. Open `https://www.bbforpeace.org/admin`.
2. Go to **Media**.
3. Upload or replace the file.
4. Confirm the uploaded object appears in Cloudflare R2.
5. Confirm the public page displays the new media.

## Current Cleanup Workflow

If future cleanup is needed, use the active cleanup script:

```bash
node scripts/cleanup-unused-media.js --output backups/unused-media.csv
```

Review the generated CSV first. When confident:

```bash
node scripts/cleanup-unused-media.js --output backups/unused-media.csv --delete
```

## Note

The old mapping/reupload scripts are intentionally no longer present. Do not reintroduce historical scripts with hardcoded database credentials.
