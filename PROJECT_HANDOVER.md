# BB4Peace Project Handover Note

## Project Status

The BB4Peace website is implemented and operational on the current production architecture:

- Frontend and admin deployment: Vercel
- CMS: Payload CMS 3
- Database: Supabase PostgreSQL
- Media storage: Cloudflare R2
- Source control/deployment: GitHub `main` branch to Vercel

## Completed Work

- Built public website sections for the organization.
- Configured Payload CMS admin at `/admin`.
- Added custom admin navigation and dashboard experience.
- Configured Supabase PostgreSQL for Payload data.
- Migrated media storage from Vercel Blob to Cloudflare R2.
- Fixed Next image configuration so R2-hosted images display correctly.
- Cleaned unused media records and matching R2 objects.
- Removed obsolete generated reports, migration CSVs, Vercel Blob package usage, and old scripts.
- Removed explicit Payload media file-size limit; uploads now depend on hosting/request limits and R2 behavior.
- Updated system design documentation for the implemented Vercel/Supabase/R2 stack.

## Active Runtime/Operations Files

Active scripts:

```text
scripts/backup-db.js
scripts/cleanup-unused-media.js
scripts/test-db-conn.js
```

Important docs:

```text
SYSTEM_DESIGN.md
MEDIA-MIGRATION-VERCEL-TO-R2.md
PROJECT_HANDOVER.md
```

## Required Environment Variables

Vercel should have:

```text
DATABASE_URL or DATABASE_URI
PAYLOAD_SECRET
NEXT_PUBLIC_SITE_URL=https://www.bbforpeace.org
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_ENDPOINT
R2_REGION=auto
R2_PUBLIC_URL
```

Remove old Vercel Blob variables if present:

```text
BLOB_READ_WRITE_TOKEN
BLOB_TOKEN
```

## Admin Workflow

1. Admin logs in at `/admin`.
2. Admin manages website content in Payload.
3. Admin uploads media through Payload Media.
4. Payload stores media in Cloudflare R2.
5. Public pages read content from Supabase and media from R2.

## Security Notes

Current baseline:

- Payload CORS/CSRF origin restrictions.
- Required `PAYLOAD_SECRET` in production.
- Security headers in Next config.
- No-cache headers for admin/API routes.
- Basic rate limiting for API and admin login attempts.
- Role-based access controls in Payload.
- Referenced media deletion protection.
- Environment-only DB/R2 credentials.

Recommended next steps:

- Rotate Supabase credentials that may have appeared in old scripts or git history.
- Enable Cloudflare WAF managed rules.
- Add Cloudflare rate limiting for `/admin/*` and `/api/*`.
- Consider Cloudflare Access in front of `/admin/*`.
- Add uptime/error monitoring.
- Replace in-memory rate limiting with durable rate limiting.

## Cloudflare Security Recommendation

Use Cloudflare for DNS/security in front of the website and R2 media.

Technical setup:

- DNS under Cloudflare.
- SSL/TLS Full Strict.
- WAF managed rules.
- Rate limiting for admin/API routes.
- Bot protection / Turnstile if form spam becomes a problem.
- Optional Cloudflare Access for `/admin/*`.
- Optional custom R2 media domain.

Financial overview:

- Free plan: DNS, SSL, CDN, basic protection.
- Pro: stronger WAF/security controls; likely enough for this website.
- Business/Enterprise: advanced compliance/SLA needs.
- R2: billed by storage and operations.
- Zero Trust/Access: free tier may be enough for a small admin team; paid tiers depend on usage.

## Final Verification Checklist

- Vercel deployment from `main` is green.
- `/`, `/about`, `/gallery`, `/publications`, and `/admin` load correctly.
- Admin can upload a test image.
- Test upload appears in Cloudflare R2.
- Old Vercel Blob storage/env vars are removed.
- Supabase backups are enabled or scheduled.
- Admin users and roles are confirmed.

## Optional Future Enhancements

- Full frontend visual uplift and responsiveness polish.
- Broader admin dashboard redesign.
- Cloudflare Access for admin.
- Durable rate limiting.
- Monitoring/alerting.
- Formal security review or penetration test.
