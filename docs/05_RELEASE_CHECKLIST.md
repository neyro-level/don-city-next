# Release Checklist

Status: Active — public production; next release not authorized
Version: 1.2
Updated: 2026-09-28

## Historical Release Evidence

- [x] Approved product contract and completed implementation graph.
- [x] Clean canonical `main`, exact SHA and green RISKY SourceCraft evidence.
- [x] Owner explicitly authorized the historical production resources and noindex rollout.
- [x] Immutable artifact built once and deployed through Compose + host Nginx/TLS.
- [x] Immutable artifact built once and identified by exact SHA.
- [x] Secrets live only in dedicated Secret Master scope.
- [x] Historical candidate proof was isolated; its temporary restore database was removed.
- [x] Provider PostgreSQL backup exists; isolated restore and migration rehearsal passed and temporary DB was removed.
- [x] Application rollback image and compose point retained.
- [x] 12 listings / 92 media items verified; real feed remains disabled.
- [x] The historical noindex release was attested; it is not the claimed identity of the currently observed public-indexing state.
- [x] SourceCraft release attestation run 82 passed for exact main SHA `cd5c743912650525f84d2d110e6a43c4e6c6e35d`.
- [x] Approved logo, compact header mark, footer lockup and favicon are live; desktop/mobile visual smoke passed.

## Required Before the Next Production Release

- [x] Deliver CP-04 with its required DB/media/performance evidence.
- [x] Deliver CP-03 after the approved narrow OD-03 exception and atomic DB concurrency evidence (PR 79, RISKY gate 91).
- [x] Historical CP-08 candidate proof passed; it does not define the v13 release candidate.
- [x] Retire the persistent staging runtime, logical database, empty S3 bucket
      and Secret Master `/staging` folder; preserve the production resources
      and shared S3 credential.
- [ ] Create the first production owner user.
- [ ] Verify NAP against external owner/Yandex Business truth.
- [x] Keep unapproved terms and managed contract PDF in explicit `ABSENT`
      state: no public route, footer/navigation/sitemap link or file URL.
- [ ] Connect independent alert and approved lead-delivery channel; prove redacted delivery smoke.
- [x] Implement and sample-restore media backup/versioning.
- [x] Expose trustworthy DB/media backup freshness in authenticated health;
      bounded 2026-09-28 proof returned `ok` with zero alerts.
- [ ] Run full production crawl for canonical, robots, sitemap, JSON-LD, 404/410 and lifecycle.
- [ ] Provide and approve a real feed endpoint/allowlist before enabling any source.
- [x] Public indexing is already observed; exact deployed SHA/image still requires factual reconciliation.
- [x] Prove the first-four-month sitemap/navigation/crawl contains only gated secondary apartments, houses, land, commercial real estate and approved legal-department pages.
- [x] Prove `/novostroyki/*` and `/komplex/*` remain disabled, non-indexable and absent from sitemap/navigation.
- [x] Prove `/donetsk/kommercheskaya/` and `/yurist/` are the only approved commercial/legal launch owners; no unsupported child legal route is exposed.
- [ ] Record `PUBLIC_INDEXING_ENABLED_AT` and the four-month scope-review due date (`+4 calendar months`); the reminder must not enable newbuild/ЖК without a new owner-approved plan.

## Stop Conditions

- Do not start a new production release without a separate explicit owner command and exact-head evidence.
- Do not enable a real feed or delivery host from an unverified URL.
- Do not run migrations without bound backup, rehearsal and rollback evidence.
- Do not expose secrets, PII, raw Payload documents or full database URLs in evidence.
- Documentation or observed infrastructure alone must not promote a fail-closed readiness flag; every promotion requires linked durable evidence.
- `DC11-PROD-FINAL` is the mandatory last stage; create no monitoring, observation, reconciliation or follow-up task after it.
