# EPIC-36 — Sitemaps / Robots evidence

Status: implementation and verification complete
Date: 2026-09-25
Task: `dcv4-task-36-evidence`
Branch: `codex/epic-36-sitemaps-robots`
Implementation: `973687b388de77cb2f7a32f1d9c883db89f33c5a`
Verification: `50e5c992aa30dc562ec3717330a5ab612e44fb19`

## Delivered contract

- Eight deterministic R1 logical maps partition static, geo, catalog,
  district, facet and published apartment/house/land property URLs.
- Generated map IDs are stable and public robots advertises their exact URLs
  only when the project indexing policy is `public`.
- Registry inclusion now requires both `status=active` and the existing
  canonical/indexable/Content Gate decision.
- Published property maps reuse the Public Gateway publication policy and typed
  property URL grammar, with no raw CMS exposure.
- Existing aggregate sitemap provider APIs remain available for internal
  compatibility; the Next metadata route consumes the logical projection.

## Traceability

- Owner partition and registry gate: `src/platform/sitemap/registry.ts`,
  `src/project/sitemap.ts`.
- Published category maps: `src/core/data-access/public/payload-reads.ts`,
  `src/core/data-access/public/provider.ts`.
- Next routes and robots: `src/app/sitemap.ts`, `src/app/robots.ts`,
  `src/project/indexing-policy.ts`.
- Fixtures and proof: `scripts/fixtures/epic36-logical-sitemaps.snapshot.json`,
  `scripts/verify-sitemap-indexnow.ts`, `scripts/verify-seo-contracts.mjs`.
- Full acceptance matrix: `EPIC-36_SITEMAPS_ROBOTS_VERIFICATION.md`.

## Delivery classification

`STANDARD`: SEO/runtime routing and deterministic gateway reads changed, but no
schema, migration, auth, PII, dependency, secret or production configuration
changed. Required delivery is one exact-head SourceCraft `merge-standard` gate
after full diff review.

## Known boundaries

- District/facet maps are intentionally empty until EPIC-38 activates approved
  rows with complete Content Gate evidence.
- Production remains under noindex policy until an explicit release decision.
- No live IndexNow/Webmaster submission or production action is included.
