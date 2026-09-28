# DC10-R11-04 — Unified Content Gate preflight

Status: factual baseline for `AMS-DON-CITY-LIVE-CONFORMANCE` v13, EPIC-106.

## Baseline

- Branch: `codex/dc11-106-unified-content-gate`.
- Base: `a8596e0c582f03f95c1d1f70edae51f1f2787357` (`origin/main`).
- Delivery profile: `CRITICAL`; planned gate: `RISKY` because this epic changes Payload schema, migration and scheduled state maintenance.
- Production, DNS, secrets and live data mutation are outside implementation.

## Confirmed drift

| Owner | Current state | Required convergence |
| --- | --- | --- |
| SEO registry seed/generated registry | 26 gated rows are split evenly between `minActiveObjects=5` and `10`. | Every gated row uses `3`; non-gated rows remain `0`. |
| Site Profile | `inventoryThreshold={P1:5,P2:5,TEST:10}`. | All gate tiers use `3`; tier remains content/research priority only. |
| Runtime gate | Indexability depends on the current object count only. | `0` objects fails immediately; `1–2` may retain indexability for at most 30 calendar days after a persisted threshold pass; `3+` passes inventory. |
| Persistent owner | `listing-contents` stores approved copy/facts but no inventory transition state. | Add system-owned inventory snapshot/evaluation/pass timestamps to the same Payload collection and managed PostgreSQL database. No second store or database. |
| State writer | Public GET counts objects and evaluates the gate; no persistence owner exists. | A Payload maintenance job updates state. Public GET remains read-only and consumes stored state. |
| Verification | Existing tests encode 5/10 and have no zero/grace/expiry transitions. | Replace equality expectations and add deterministic transition plus read-only boundary tests. |

## Affected owners

- `docs/seo/SEO_REGISTRY_SEED.csv` and generated `src/project/seo-registry.generated.ts`.
- `src/project/site.profile.ts`.
- `src/platform/seo/content-gate.ts` and all sitemap/navigation/route consumers.
- `src/project/collections/ListingContents.ts`, Payload generated types and one additive migration.
- Payload maintenance task registry/handler; it is the only state writer.
- Seed, schema, Content Gate, sitemap and integration verification scripts.

## Planned state contract

- Persist `inventorySnapshot`, `inventoryEvaluatedAt` and `lastThresholdPassedAt` on the existing `listing-contents` row.
- Maintenance evaluation writes `lastThresholdPassedAt=now` only when the current inventory is at least `3`; counts `1–2` preserve the previous pass timestamp; count `0` is always non-indexable even while the timestamp remains as audit history.
- Grace is valid through 30 calendar days from `lastThresholdPassedAt`, never renewed by a public request.
- Approved content, materialized registry metadata, SSR and HTML property links remain mandatory throughout grace.
- Missing, invalid or future timestamps fail closed.

## Acceptance evidence plan

| Final criterion | Evidence |
| --- | --- |
| Registry, Site Profile, runtime and seeds agree on `3`. | Equality guard across CSV, generated registry and profile. |
| Persistent 30-day anti-flicker state. | Additive schema/migration proof and deterministic transition tests at 0, 1–2, day 30 and expiry. |
| Public GET is read-only. | Static boundary test plus integration double proving reads do not call Payload create/update/delete. |
| One persistent database. | State lives in the existing Payload `listing-contents` table; no new connection, service or datastore. |

## Stop conditions

- Applying the migration to any live database, seeding live state, production/DNS/secret mutation or destructive data action requires a separate authorized release/operations step.
