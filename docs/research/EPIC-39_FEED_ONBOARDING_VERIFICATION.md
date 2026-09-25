# EPIC-39 — feed onboarding verification

Date: 2026-09-25

Implementation SHA: `84cc394a64b24a3aa1ac8f794e2842a7687ce903`

## Acceptance matrix

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| Known taxonomy and geography normalize to canonical values | PASS | Parser, taxonomy and geo verifiers pass; Payload fixture resolves all three geo relations. |
| Unknown taxonomy/geography is reviewable, not silently trusted | PASS | Unknown category/deal fallback sets aggregate `needsReview`; existing geo resolver does the same for unmatched city/district while retaining raw values. |
| `feedSource + externalId` retains property identity and `publicUrlId` | PASS | Payload round trip updates the same row after relationship-ID normalization and preserves `publicUrlId`. |
| First full run creates a safe baseline | PASS | Fixture exposes seven missing active rows; first-run decision makes zero deactivation calls and records `lastOfferCount=10001`. |
| External and production boundaries remain closed | PASS | Integration uses loopback PostgreSQL and in-memory/feed fixtures only; no real URL, provider credential or production source is resolved. |

## Executed checks

- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with the existing generated migration/type and legacy CSS warnings only.
- `pnpm build` — PASS.
- `pnpm verify:feed-parser` — PASS.
- `pnpm verify:feed-ingest` — PASS.
- `pnpm verify:feed-lifecycle` — PASS.
- `pnpm verify:property-taxonomy` — PASS with the corrected React server export condition.
- `pnpm verify:public-url-id` — PASS.
- `pnpm verify:geo-model` — PASS.
- `pnpm verify:feed-onboarding:integration` — PASS.
- `pnpm verify:security-boundaries` — PASS.
- `pnpm quality:architecture` — PASS; no dependency violations.
- `git diff --check` — PASS.

## Database evidence

The integration suite used local PostgreSQL database `don_city_dev` through the
restricted `don_city_dev` role. It created only uniquely named EPIC-39 fixtures,
removed them in dependency order and left counts for feed, geo and user fixtures
at `0|0|0|0|0`. A fixture left by an intentionally failing cleanup-path test was
identified by exact IDs and removed in a transaction before verification was
accepted.

## Review notes

- No schema or migration change is required; the existing aggregate
  `properties.needsReview` field owns geo, land-area and taxonomy review state.
- Relationship IDs returned by Payload are normalized before source-scope
  comparisons. This fixes repeat ingest without relaxing source isolation.
- Deterministic storage fallbacks remain `apartment` and `sale`, but they are now
  explicitly untrusted through `needsReview=true` until an operator resolves the
  source mapping.
