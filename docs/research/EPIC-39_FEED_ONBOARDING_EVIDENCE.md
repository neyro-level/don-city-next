# EPIC-39 evidence — feed onboarding

Status: `PASS`

Date: `2026-09-25`

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

Implementation SHA: `84cc394a64b24a3aa1ac8f794e2842a7687ce903`
Verification SHA: `97225503d8f4c02d5b5f4fdfb7216757c0ccccfc`

This record is traceability evidence only. The canonical requirement remains
`docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-39`.

## Traceability

| Requirement | Implementation evidence | Verification evidence | Verdict |
|---|---|---|---|
| Normalize feed taxonomy and geography | Taxonomy normalization now distinguishes trusted mappings from deterministic fallback values; existing geo resolution remains the canonical owner. | Parser, taxonomy, geo and local Payload integration checks pass. | PASS |
| Unknown values require review | Unknown category, deal type, house type or geography contributes to the aggregate `properties.needsReview` flag while raw source values remain available. | The integration round trip changes a known offer to unknown taxonomy and observes `needsReview=true`. | PASS |
| Preserve property identity and `publicUrlId` | Payload relationship IDs are normalized before matching the source-scoped `feedSource + externalId` identity. | Reimport updates the same property row and retains the original `publicUrlId`. | PASS |
| First full run is a safe baseline | The first-run decision records the observed offer count and suppresses missing-item deactivation. | A fixture with seven missing active candidates and `10001` observed offers produces zero deactivation calls. | PASS |
| Keep production and external sources out of the implementation proof | The suite rejects non-loopback and non-development/test database targets and uses generated local fixtures. | Local fixtures were removed after the run; exact post-check counts are zero. | PASS |

## Evidence chain

- Preflight and dependency surface: `docs/research/EPIC-39_FEED_ONBOARDING_PREFLIGHT.md`.
- Detailed acceptance and database proof: `docs/research/EPIC-39_FEED_ONBOARDING_VERIFICATION.md`.
- Implementation commit: `84cc394a64b24a3aa1ac8f794e2842a7687ce903`.
- Verification commit: `97225503d8f4c02d5b5f4fdfb7216757c0ccccfc`.
- Final local checks: typecheck, lint, production build, feed parser/ingest/lifecycle, taxonomy, public URL identity, geo model, local Payload integration, security boundaries, architecture guard and `git diff --check` — PASS.

## Boundaries and risk

- No schema or migration change was required; Payload remains the only schema and persistence owner.
- The proof used the restricted local `don_city_dev` role and database. No password, full database URL, PII or provider credential is recorded here.
- A real provider feed, first production baseline and production database execution remain release/owner gates and were not performed.
- Delivery is classified `RISKY` because the diff changes business-critical ingest and persistence behavior, even though it does not alter schema.

No unresolved EPIC-39 acceptance failure or discovered follow-up work remains.
