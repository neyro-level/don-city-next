# EPIC-28 — Property Detail Routes: preflight

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

## Contract

- The public grammar already owns apartment, house and land detail routes,
  resolving a semantic or category mismatch to one canonical `301` by stored
  `publicUrlId`.
- The property page receives one neutral legal CTA. Its only target is
  `/yurist/`, where the existing static-page composition assigns
  `formKind=legal`.
- `documentCheckSummary` is not part of the current Payload schema or public
  DTO. The new CTA therefore makes no verification-status claim.

## Boundaries

- No Payload migration, read/write of production data, SEO registry mutation,
  DNS, Secret Master or deployment.
- No donor `/obekty/` route or duplicate property canonical is introduced.
