# EPIC-47 — release rehearsal evidence

Date: 2026-09-26
Release candidate source: `d6359f3d8461014bf7e2946d914d7ea473102b5e`
Target: existing isolated `https://staging.doncity-home.ru`
Verdict: `PASS (APPLICATION REHEARSAL)`

Production, DNS, public indexing, secrets and production data were not changed.

## Build-once artifact

| Identity | Evidence |
| --- | --- |
| Source | Clean detached checkout at exact canonical SourceCraft `main` `d6359f3…` |
| Source gate | EPIC-46 RISKY run 62, PR 60, merge commit `d6359f3…` |
| Image tag | `don-city-next:staging-d6359f3` |
| OCI revision | `d6359f3d8461014bf7e2946d914d7ea473102b5e` |
| Local image ID | `sha256:1cb4bdcb4393b74590246624af52431962f1426b5069b5c0dcb912679ba3d34d` |
| Loaded server image ID | `sha256:0d58d25a4173b865ff315581753ae8fe819aa9f6f16a43648ad7fe40211110eb` |
| Compressed artifact SHA-256 | `f06bf1522dda001fd2e04447e839eda0257bc2a2c5b9816b4a61b207fcd6d7f8` |
| Compressed bytes | `418601204` |

Docker Desktop and the server image store normalize the loaded image
differently, so their local image IDs are not expected to match. Integrity is
bound by the matching transferred artifact checksum, the exact OCI revision
and the recorded source checkout.

The image was built once outside the server. The server performed no Git,
dependency-install or build operation. Transport files were removed after the
loaded image identity was verified.

## Deploy → rollback → redeploy

| Step | Image / revision | Result |
| --- | --- | --- |
| Baseline | `staging-d8b7d63` / `d8b7d63…` | Running, restart count 0, loopback/public HTTP 200 |
| Candidate deploy | `staging-d6359f3` / `d6359f3…` | PASS |
| Rollback | `staging-d8b7d63` / `d8b7d63…` | PASS |
| Final redeploy | same `staging-d6359f3` image / `d6359f3…` | PASS |

The final Compose checksum is
`55b035fad1622a7c1cf5d01e568fcac95145101410624556118be1520daf21af`.
The exact baseline Compose file is retained as
`compose.yml.pre-d6359f3-rehearsal`; older `b0078c3` and `9ad95e2` images and
backups remain available. No migration or database mutation occurred because
`d8b7d63..d6359f3` has no migration or application-runtime delta.

## Live proof

- Authenticated health returned HTTP 200 at the candidate, rollback and final
  candidate stages.
- Database, storage and jobs components were `ok`; `JOBS_AUTORUN=false` at all
  stages.
- Overall health remains `degraded` because independent monitoring/backup
  production-readiness signals are not yet complete. This is a known release
  blocker, not an application failure.
- Public HTTPS returned 200 and `X-Robots-Tag: noindex, nofollow` at all stages.
- Final FULL crawler: PASS — 59 requests, 40 registry pages, 9 sitemap URLs,
  zero findings.
- Final HTTP route matrix: PASS.

## Full verification

`pnpm verify` passed with the two canonical expected client-readiness blockers:

- `required-host-allowlists-missing`;
- `client-storage-deployment-contract-missing`.

The local integration suite was skipped because no local test database URI was
provided. The exact-head RISKY SourceCraft gate remains responsible for the
required isolated PostgreSQL integration run before merge. Lint exited 0 with
the existing generated-migration/UI warnings, and the production build emitted
23 static pages plus the dynamic application/API routes.

## Final status

`APPLICATION RELEASE CANDIDATE PASS` — the immutable exact-main application
artifact survived deploy, rollback and same-artifact redeploy on isolated
staging. This is not production authorization. Provider backup restore,
independent external monitoring, real integration allowlists and the explicit
EPIC-48 owner command remain required for production.

## Targeted verification closure

A separate read-only final-state inspection after the rehearsal confirmed:

- the running container still uses `staging-d6359f3`, server image
  `sha256:0d58d25…`, exact revision `d6359f3…`, restart count 0;
- rollback image `staging-d8b7d63` retains exact revision `d8b7d63…`;
- `compose.yml.pre-d6359f3-rehearsal` is retained;
- temporary server transport/log files count is 0;
- public HTTPS remains 200 with `X-Robots-Tag: noindex, nofollow`.

All applicable EPIC-47 acceptance rows are PASS for the application rehearsal.
The named operations-readiness limitations remain explicit and were not
reclassified as PASS.

## Traceability

- Canonical plan owner: V4 master plan v7, EPIC-47.
- Release candidate source: canonical main `d6359f3…`.
- Preflight task/head: `dcv4-task-47-preflight` / `e832b01…`.
- Implementation task/head: `dcv4-task-47-implement` / `b6cd1b4…`.
- Verification task/head: `dcv4-task-47-verify` / `bef16fb…`.
- Evidence paths: this record, `docs/DELIVERY_STATE.yaml` and
  `docs/research/EPIC-45_LIVE_STAGING_VERIFICATION.md`.
- The pending delivery task owns PR, exact-head RISKY gate and canonical-main
  merge evidence. It does not authorize production.
