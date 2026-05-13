# Scripts Archive

This folder is kept only as a marker for historical script cleanup.

One-off migration, recovery, diagnostic, and maintenance scripts were removed after the
R2 migration and media cleanup were completed.

Do not add scripts with hardcoded credentials here. Use `.env` (`DATABASE_URL`,
`DATABASE_URI`, `R2_*`, etc.) for anything that needs external access.

Active root-level scripts are intentionally limited to:

- `scripts/backup-db.js`
- `scripts/cleanup-unused-media.js`
- `scripts/test-db-conn.js`

The old `maintenance/` and `media-migration/` archives were removed because they were
date-specific, not part of runtime, and some historical scripts contained hardcoded
database credentials.
