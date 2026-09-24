# EPIC-11 evidence — feed taxonomy and geo normalization

Status: ready for delivery review
Date: 2026-09-24
Candidate head: `63b5818462486b7ea7e4601dc5e587c82596a573`
Base: `c80f358f312e221ed6c79bea49fce35663ad16bf`

The approved requirement remains in the master plan; this file only links its
implementation and proof.

- **Source taxonomy:** `src/core/ingest/feed-ingest.ts` now resolves recorded
  YRL category values through `yrlSourceCategoryMap` before the bounded legacy
  compatibility fallback. The raw normalized offer remains the input boundary.
- **Textilshchik:** `src/project/geo/feed-match.ts` maps raw values containing
  `Текстильщик` only when the resolved city slug is `donetsk`, and only to the
  existing `tekstilshchik` district document.
- **Unknown district:** no district document is created. The persisted raw value
  is retained, `district` stays null and `needsReview` is true; the existing
  normal ingest write path still creates or updates the property.

Changed paths are limited to the feed classifier, geo resolver, two fixtures and
EPIC-11 preflight/verification/evidence records. No Payload schema, migration,
database, secret, DNS or production change is included.

The exact commands and the local runtime limitation are recorded in
`EPIC-11_FEED_GEO_VERIFICATION.md`.
