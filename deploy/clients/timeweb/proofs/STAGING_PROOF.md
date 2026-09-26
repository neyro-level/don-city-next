# DON CITY staging proof

This record is completed only after an explicitly authorized Timeweb staging
rollout from an exact canonical `main` SHA. Empty rows are gates, not inferred
proof. Never paste secrets, personal data or complete database URLs here.

| Proof | Status | Required redacted evidence |
|---|---|---|
| Exact canonical main SHA and green RISKY gate | PENDING DELIVERY | Candidate `9ad95e2`; final exact-main SHA/run belong to the delivery ledger |
| Immutable image identity | PASS (CANDIDATE) | Image ID and compressed artifact checksum recorded in EPIC-45 live verification |
| Separate staging PostgreSQL | PASS | Dedicated database/user, authenticated smoke and full migration log |
| Separate staging media | PASS (RUNTIME) | Dedicated private bucket; artifact PUT/GET/DELETE and health storage component `ok` |
| No production PII | PASS | Empty isolated database plus one synthetic `.test` lead deleted after proof |
| Payload jobs disabled | PASS | Authenticated health reports `JOBS_AUTORUN=false` |
| Staging noindex | PASS | HTTPS header and deny-all robots verified externally |
| R1 routes and metadata | PARTIAL | 15/15 active registry routes return 200; full metadata/canonical crawl is EPIC-46 |
| Districts, facets and nearby locality | PASS (ROUTES) | Active registry route matrix plus deterministic repository checks |
| Lifecycle | PASS (CONTRACT) | Deterministic route/lifecycle checks pass; no production-like staging fixture imported |
| Feeds and leads | PARTIAL | Synthetic lead accept/idempotency/delete pass; external feeds/delivery remain disabled |
| Cache and invalidation | PASS (CONTRACT) | Deterministic checks pass; representative traces remain EPIC-47 |
| Monitoring and rollback readiness | PARTIAL | Authenticated health works; independent alerts, backup snapshots and prior known-good image remain unavailable |

Production promotion is outside EPIC-45 and requires a separate owner command.
