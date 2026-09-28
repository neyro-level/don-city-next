# DC11-R12-01 — Donetsk district completion preflight

Date: 2026-09-28

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 (`APPROVED`)

Base: `5dd05d2c0aae79b83b6135d3fed313cb8dd418e5`

Risk: `RISKY` — Payload schema, additive migration, canonical geo seed and feed mapping

## Factual baseline

- `DISTRICT_REGISTRY_SEED.csv` contains ten unique `(citySlug, slug)` rows: exactly nine Donetsk administrative districts and the `tekstilshchik` microdistrict.
- Every current row stores `name`, `slug`, `type`, `citySlug`, `preposition`, `nameLocative`, publication state and SEO research ownership. Textilshchik has `parentSlug` empty, `на`, `Текстильщике`, P1 and Wordstat evidence.
- Payload `districts` owns `(city, slug)` uniqueness, nullable same-city parent, `preposition` and `nameLocative`. The generated type and database schema do not contain district `nameGenitive` or `synonyms`.
- The idempotent geo seed persists the current fields and keeps Textilshchik at `parent=null`.
- Feed matching is city-scoped and preserves an unknown raw district as `district=null + needsReview=true`. It matches an exact district name/slug and has one hard-coded contains rule only for Textilshchik.
- Registry/runtime already expose ten apartment district/microdistrict candidates and nine house district candidates. All use Content Gate threshold `3`; a house landing on/off matrix exists, while the apartment suite proves only the gated-off state plus Textilshchik canonical/parent behavior.

Observed checks on the base:

- SEO seed verification: `PASS` — 42 SEO rows, 10 district rows and unique city/slug identities.
- Geo model verification: `PASS` — Textilshchik exact/contained mapping, other-city isolation and unknown review path.
- Apartment district contract: `PASS` — 10 canonical routes.
- House district/facet contract: `PASS` — nine district routes and Gate on/off behavior.
- Generic Content Gate transitions: `PASS`.

Graphify traced the active owners to `Districts.ts`, `seed-geo.ts`, `feed-match.ts`, the public catalog/provider, route resolver and the district/SEO verification scripts. No second geo collection or persistence owner is needed.

## Convergence contract

| Required outcome | Current state | Planned owner and proof |
|---|---|---|
| Nine administrative districts | Present and unique | Strengthen the seed guard to assert exact type/count and all canonical forms. |
| Stored inflections | `preposition` and `nameLocative` only | Add optional schema fields `nameGenitive` and `synonyms[]`; backfill the ten canonical Donetsk rows through one additive migration and the existing idempotent seed. |
| Feed synonyms/mapping | Exact name/slug plus Textilshchik special case | Replace the special case with one city-scoped, data-driven matcher over stored canonical forms and synonyms; unknown values remain unmapped and reviewable. |
| Textilshchik hard contract | Canonical route and `parent=null` already present | Preserve the route, stored forms, Wordstat ownership and parent-independent URL; prove common raw variants through the same synonym path. |
| District landing Gate=3 | Registry/runtime threshold exists | Add a district-specific matrix for all apartment and house owners, including below-threshold, pass, zero-object and persisted grace behavior. |
| Existing inventory relations | R11-01 mapping is already the upstream owner | Do not remap production data here; prove representative Payload/feed round trips and preserve unknown raw values. |

The schema extension remains in the existing Payload `districts` collection. It must not create a second collection, database or mapping store. Migration `up` backfills only recognized Donetsk identities; `down` removes only the added fields/table and does not alter district/property relations.

## Verification plan

1. Static guards: exact nine administrative rows plus Textilshchik, unique identities, non-empty canonical grammatical forms and non-empty unique normalized synonyms.
2. Mapping matrix: every administrative district matches exact, `район`, locative and configured synonym forms only inside Donetsk; Textilshchik variants match; unknown/other-city inputs remain reviewable.
3. Payload integration: all tracked migrations on fresh PostgreSQL 18, idempotent seed twice, stored fields/parent state, representative known/unknown feed resolution and rollback proof for the new migration.
4. Landing matrix: all 19 district owners use `minActive=3`; zero fails immediately; one/two use only valid persisted grace; three pass when content/SSR evidence is complete.
5. Typecheck, changed-path lint, architecture/dependency checks and one exact-head `RISKY` SourceCraft gate before merge.

## Boundaries

- No production, managed database, DNS or secret mutation is part of this epic.
- No nearby-locality/agglomeration activation is included; that belongs to later owner-gated epics.
- No automatic Russian inflection is allowed. Canonical forms and synonyms are explicit project data.
- No unknown district may default to a Donetsk district or hide a property.
- DOC IMPACT owner: this evidence plus the existing master-plan and Product Structure/Architecture contracts; active owner documents change only if implementation reveals a factual contract delta.
