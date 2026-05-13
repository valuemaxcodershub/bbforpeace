# Media Migration: Vercel Blob to Cloudflare R2

## Status

The media migration is complete.

- Payload is configured to store new media uploads in Cloudflare R2.
- Existing media was migrated/replaced and verified.
- R2 image domains are allowlisted in `next.config.ts`.
- Unused media records and matching R2 objects were cleaned.
- Vercel Blob is no longer an active runtime dependency.
- Old migration scripts and generated CSV/log artifacts were removed.

## Current Media Architecture

```text
Payload Admin Upload
        |
        v
Payload Media Collection
        |
        v
Cloudflare R2 bucket
        |
        v
Public R2 URL used by frontend
```

## Required Environment Variables

Vercel and local production-like environments need:

```text
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_ENDPOINT
R2_REGION=auto
R2_PUBLIC_URL
DATABASE_URL or DATABASE_URI
```

Remove old Blob variables if they still exist:

```text
BLOB_READ_WRITE_TOKEN
BLOB_TOKEN
```

## Verification Checklist

Use this checklist after deployments or credential changes:

1. Open `/admin`.
2. Upload a test image in Payload Media.
3. Confirm the object appears in Cloudflare R2.
4. Confirm the media row URL starts with `R2_PUBLIC_URL`.
5. Confirm the image displays on the public site.
6. Run `node scripts/cleanup-unused-media.js --output backups/unused-media-check.csv` before any future cleanup.

## Cleanup

The only active media cleanup script is:

```bash
node scripts/cleanup-unused-media.js --output backups/unused-media.csv
```

Review the generated CSV first. To delete unused records and matching R2 objects:

```bash
node scripts/cleanup-unused-media.js --output backups/unused-media.csv --delete
```

## Notes

- Large uploads are now stored in R2, but Vercel request limits may still affect very large direct uploads.
- If very large uploads become common, implement direct browser-to-R2 presigned uploads so files bypass Vercel serverless limits.
- Keep R2 credentials in environment variables only.
- Do not reintroduce Vercel Blob unless there is a new explicit requirement.