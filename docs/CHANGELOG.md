# Contract changelog

## 2026-09-29 — Compound typography and final R2 reconciliation

- Every canonical `text-*` role now owns its size, line-height and
  letter-spacing; public consumers no longer compose a parallel `leading-*` or
  `tracking-*` scale, and the UI guard rejects regressions.
- EPIC-R2 was delivered through SourceCraft PR `#120`, RISKY gate `163`, release
  run `164`, one rollout and bounded live crawl with 61 requests / 21 sitemap
  URLs / zero findings.
- Production-owner login, canonical NAP, monitoring and exact release identity
  are proved. Only lead delivery and real-feed activation remain fail-closed
  product operations.

## 2026-09-29 — Constitution cleanup and production truth

- EPIC-R1 merged through SourceCraft PR `#119`, exact-head RISKY gate run `160`
  and main `1993a4efe0164ea9ab480cbf3b974fbffbbbe4a9`.
- Read-only host proof bound the currently running production revision to
  `fbc2dab7bf2fc408f2257bc280df0fb45970354e` and immutable RepoDigest
  `sha256:423fc6671805bd92b958d9aa549e4049eb37264f59b5b862ae7ca862175b59f6`.
- Production is healthy but differs from main, so the owner-authorized path is
  one R2 gate/merge, one exact-main release, one rollout and bounded live proof.

## 2026-09-28 — Final pre-release documentation convergence

- Active backlog, design and delivery state were reconciled with public
  indexing, delivered backup health, completed staging retirement and the
  `DC11-DOC-FINAL` execution stage.
- The stale robots `Host` assertion was removed while sitemap, Clean-param and
  allow/disallow policy remain protected.
- The already delivered required `HomePageDTO.primaryAction` is formalized as
  base contract `2.0.0` through ADR-0012 and a regenerated frozen lock.
- Production remains unauthorized, mandatory and last; no task follows it.

## 2026-09-28 — Persistent staging retired

- Under explicit owner authorization, the persistent staging container,
  Compose/runtime directory, staging-only image, separate logical database,
  empty S3 bucket and Secret Master `/staging` folder were removed.
- The shared S3 access identity and every production resource were preserved;
  provider inventory now contains one managed cluster, one logical database and
  one bucket for DON CITY.
- Production remains healthy with one jobs owner. Daily backup execution,
  DB/media freshness, sampled restore and public availability passed bounded
  verification. No production release or post-production monitoring task was
  created.

## 2026-09-27 — Live Conformance v13 approved

- Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE` v13 became the current approved
  execution contract; the existing single Beads graph upgraded in place with
  stable IDs and preserved history.
- Active documents now distinguish observed public indexing from the historical
  noindex release identity. Exact deployed SHA/image remains explicit pending
  release evidence rather than an inferred fact.
- The architecture has exactly one persistent production database. Any
  non-production DB proof is disposable, isolated and removed after use.
- `DC11-PROD-FINAL` remains mandatory and last; it requires a separate owner
  release command and creates no monitoring or follow-up stage afterward.

## 2026-09-26 — Premium brand system release

- Owner-approved DON CITY logo was integrated as the compact header mark,
  original footer lockup and browser icons; Manrope remains the public typeface.
- The new porcelain, deep-pine, copper and warm-ivory semantic palette is
  documented in Design System 2.0 and live on desktop/mobile without overflow.
- SourceCraft PR 71 passed exact-head STANDARD gate run 81 and merged as
  `cd5c743912650525f84d2d110e6a43c4e6c6e35d`; release attestation run 82 passed.
- The same immutable image was proved on isolated staging and released to
  production. Global noindex, one jobs owner and immediate rollback image were
  preserved; transfer artifacts and stale image tags were cleaned up.

## 2026-09-26 — Production noindex and documentation reconciliation

- Exact SourceCraft `main` SHA `31367bfe4adf476925eca97b5dcb13088e31191e`
  was released as one immutable production image; SourceCraft release run 79
  passed and global noindex remains active.
- Production contains 12 verified VK-derived listings and 92 photos; the real
  feed remains disabled and no standalone land listing was invented.
- Active PRD, Product Structure, Architecture, Backlog, Release Checklist,
  Operations and Delivery State were reconciled with code and live runtime.
- Remaining owner/operations blockers were narrowed to owner bootstrap,
  alert/delivery, external monitoring, backup freshness/media restore, NAP
  verification and a separate indexing authorization.

## 2026-09-24 — V4 city-first contract approved

- `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` `v7` became the only active detailed
  execution/SEO/data contract.
- V3 was moved to `archive/`, explicitly marked `SUPERSEDED`, and removed from
  future Task Manager claim authority; completed historical evidence remains
  valid.
- City-first grammar, city-hub intent ownership, Platform/Project separation
  and global no-geo entity paths were recorded as ADR-001…ADR-004.
- The V4 replacement graph contains 55 executable epics and 265 task cards;
  RP-00 was delivered before RP-01 reconciliation.
