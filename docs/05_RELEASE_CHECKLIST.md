# Release Checklist

Status: Active — production noindex
Version: 1.0
Updated: 2026-09-26

## Completed for Current Release

- [x] Approved product contract and completed implementation graph.
- [x] Clean canonical `main`, exact SHA and green RISKY SourceCraft evidence.
- [x] Owner explicitly authorized production resources and noindex rollout.
- [x] Immutable artifact built once and deployed through Compose + host Nginx/TLS.
- [x] Immutable artifact built once and identified by exact SHA.
- [x] Secrets live only in dedicated Secret Master scope.
- [x] Production and staging isolated by database/secrets/storage; staging jobs disabled.
- [x] Provider PostgreSQL backup exists; isolated restore and migration rehearsal passed and temporary DB was removed.
- [x] Application rollback image and compose point retained.
- [x] 12 listings / 92 media items verified; real feed remains disabled.
- [x] Live HTTPS, global noindex and `robots.txt` disallow verified.
- [x] SourceCraft release attestation run 79 passed for exact main SHA.

## Required Before Indexing / Lead Operations

- [ ] Create the first production owner user.
- [ ] Verify NAP against external owner/Yandex Business truth.
- [ ] Connect independent alert and approved lead-delivery channel; prove redacted delivery smoke.
- [ ] Connect external uptime monitoring outside the application server.
- [ ] Implement and sample-restore media backup/versioning.
- [ ] Expose trustworthy DB/media backup freshness in authenticated health; health must not be degraded.
- [ ] Run full production crawl for canonical, robots, sitemap, JSON-LD, 404/410 and lifecycle.
- [ ] Provide and approve a real feed endpoint/allowlist before enabling any source.
- [ ] Obtain separate owner authorization to remove global noindex.

## Stop Conditions

- Do not enable indexing while any item above is open.
- Do not enable a real feed or delivery host from an unverified URL.
- Do not run migrations without bound backup, rehearsal and rollback evidence.
- Do not expose secrets, PII, raw Payload documents or full database URLs in evidence.
