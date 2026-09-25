# DON CITY staging proof

This record is completed only after an explicitly authorized Timeweb staging
rollout from an exact canonical `main` SHA. Empty rows are gates, not inferred
proof. Never paste secrets, personal data or complete database URLs here.

| Proof | Status | Required redacted evidence |
|---|---|---|
| Exact canonical main SHA and green RISKY gate | NOT PROVEN | SHA, SourceCraft run and log API |
| Immutable image identity | NOT PROVEN | registry image digest and manifest checksum |
| Separate staging PostgreSQL | NOT PROVEN | non-secret resource identity, TLS and migration log |
| Separate staging media | NOT PROVEN | non-secret bucket identity and upload/read/delete proof |
| No production PII | NOT PROVEN | sanitized fixture/import declaration and sample audit |
| Payload jobs disabled | NOT PROVEN | health output showing `JOBS_AUTORUN=false` |
| Staging noindex | NOT PROVEN | HTTP `X-Robots-Tag` and `/robots.txt` evidence |
| R1 routes and metadata | NOT PROVEN | status/canonical/title/description/H1 matrix |
| Districts, facets and nearby locality | NOT PROVEN | representative route/status matrix |
| Lifecycle | NOT PROVEN | active/archived/withdrawn/deleted status proof |
| Feeds and leads | NOT PROVEN | sanitized ingest/save/outbox proof; no real delivery |
| Cache and invalidation | NOT PROVEN | hit/invalidation/stale-window traces |
| Monitoring and rollback readiness | NOT PROVEN | alert receipt and previous known-good digest |

Production promotion is outside EPIC-45 and requires a separate owner command.
