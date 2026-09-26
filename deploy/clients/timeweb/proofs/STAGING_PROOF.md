# DON CITY staging proof

This record is completed only after an explicitly authorized Timeweb staging
rollout from an exact canonical `main` SHA. Empty rows are gates, not inferred
proof. Never paste secrets, personal data or complete database URLs here.

| Proof | Status | Required redacted evidence |
|---|---|---|
| Exact canonical main SHA and green RISKY gate | PASS (CANDIDATE SOURCE) | Canonical `main` `d6359f3`; SourceCraft RISKY run 62 and PR 60; EPIC-47 artifact revision matches |
| Immutable image identity | PASS | Build-once `staging-d6359f3`; local/server image IDs and artifact checksum are recorded in EPIC-47 evidence |
| Separate staging PostgreSQL | PASS | Dedicated database/user, authenticated smoke and full migration log |
| Separate staging media | PASS (RUNTIME) | Dedicated private bucket; artifact PUT/GET/DELETE and health storage component `ok` |
| No production PII | PASS | Synthetic `.test` lead and EPIC-46 non-PII property lifecycle fixture were deleted after proof |
| Payload jobs disabled | PASS | Authenticated health reports `JOBS_AUTORUN=false` |
| Staging noindex | PASS | HTTPS header and deny-all robots verified externally |
| R1 routes and metadata | PASS (CANDIDATE) | EPIC-46 live FULL crawler: 40/40 registry pages and 59 HTTP requests with zero findings |
| Districts, facets and nearby locality | PASS (ROUTES) | Active registry route matrix plus deterministic repository checks |
| Lifecycle | PASS (LIVE FIXTURE) | Temporary non-PII fixture proved active `200`, mismatch `301`, archived noindex, canonical `410` and final cleanup `404` |
| Feeds and leads | PARTIAL | Synthetic lead accept/idempotency/delete pass; external feeds/delivery remain disabled |
| Cache and invalidation | PASS (CONTRACT) | Deterministic checks pass; representative traces remain EPIC-47 |
| Monitoring and rollback readiness | PASS (APP) / PARTIAL (OPS) | EPIC-47 deploy→`d8b7d63` rollback→same-artifact redeploy passed; independent alerts and provider restore evidence remain unavailable |

Production promotion is outside EPIC-47 and requires a separate owner command.
