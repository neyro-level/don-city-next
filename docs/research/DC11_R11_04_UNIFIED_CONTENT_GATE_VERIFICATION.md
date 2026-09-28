# DC11-R11-04 — Unified Content Gate verification

Date: 2026-09-28

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 (`APPROVED`)

Verified implementation head: `cd32368061126c1d1bf95c86e34f8b5a5a5905b8`

Risk: `RISKY` — additive Payload schema, migration and scheduled state writer

## Verified outcome

- All 26 gated SEO registry entries and `SiteProfile` use one threshold: `minActive=3`.
- A threshold pass is persisted in the existing Payload `listing-contents` collection. No second persistent database or state store was introduced.
- One or two active objects retain eligibility for at most 30 days after the persisted pass; zero objects fail immediately; a future or invalid timestamp fails closed.
- The public gateway only reads the persisted timestamp through an explicit select/DTO. It performs no create, update or delete operation.
- Only the existing Payload maintenance queue writes the three gate-state fields. Its authorization guard rejects attempts to change approved editorial content.

## Evidence matrix

| Contract | Result | Evidence |
|---|---|---|
| Registry/profile/runtime equality | PASS | `verify:content-inventory`, `verify:seo-contracts`, generated registry check |
| Zero, grace and expiry transitions | PASS | deterministic `verify:seo-content-gate` boundary matrix |
| Persistent state and read-only public GET | PASS | `verify:content-gate-persistence` plus provider ownership assertions |
| Payload authorization boundary | PASS | integration accepts state-only `system-job` update and rejects editorial mutation |
| Schema compatibility | PASS | all tracked migrations applied to a fresh PostgreSQL 18 database; schema verification passed |
| Payload round trip | PASS | approved content, persisted state and public DTO read completed successfully |
| Architecture and static safety | PASS | typecheck, changed-path lint, repository lint, Dependency Cruiser and architecture guards |
| SEO/runtime regression surface | PASS | sitemap/IndexNow, route resolver, CP-02 surface and jobs configuration checks |

The integration database was temporary, named only for this verification stream, and was removed after each run. Its absence was checked after cleanup. No managed database, production runtime, DNS or secret was changed.

Repository-wide lint exited successfully with 24 pre-existing warnings outside this change; the changed-path lint has no findings. Production evidence is intentionally absent because production is a separate final owner-authorized stage.

## Delivery decision

The implementation is ready for one exact-head SourceCraft `RISKY` Merge Gate. The gate must run against the final PR head after this evidence commit. A production release is not authorized by this verification.
