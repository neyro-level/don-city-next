# EPIC-09 preflight — property taxonomy

Status: PASS — implementation is bounded and may start
Date: 2026-09-24
Scope: `dcv4-task-09-preflight`

## Entry

- Base: SourceCraft `main@6aafd1c347cb989a87a69c5674b4317a58285c13`.
- Branch: `codex/epic-09-property-taxonomy`.
- Approved source: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`, plan v7,
  §18 `PROPERTY TAXONOMY`.
- Completed dependency: RP-12 / `dcv4-epic-65`.
- Platform: AMS Realty Platform Core 3.0 + Payload 3.90.1; Payload remains the
  sole owner of schema and forward migrations.

## Verified current state

1. One `properties` collection already owns `market`, `category`, `dealType`,
   publication state and `needsReview`.
2. The current collection supports `apartment`, `house`, `land` and
   `commercial`; it does not yet declare the prepared-off `room` and `garage`
   values or the required house and land fields.
3. The ingest boundary is explicit: `yrl-parser` → `feed-normalization` →
   `feed-ingest` → source-scoped Payload repository. The graph shows its
   affected verification callers and runtime import entrypoint.
4. Current area normalization is for building areas in square metres. It has
   no land-unit contract, so a dedicated m²/sotka/hectare → sotka conversion is
   required rather than reusing an implicit fallback.
5. Existing `needsReview` currently represents unresolved geo. The taxonomy
   change must preserve that signal and set it when land-unit input is
   ambiguous; it must not convert an ambiguous value into a guessed area.

## Implementation contract

1. Keep a single `properties` collection.
2. Declare R1 categories `apartment | house | land` and retain
   `commercial | room | garage` as schema-supported, prepared-off values only.
   This epic does not add public navigation, indexable routes or catalog
   promotion for prepared-off categories.
3. Keep `market = secondary | newbuild` and `dealType = sale | rent`.
4. Add the bounded taxonomy fields:
   - `houseType`: `house | cottage | townhouse | dacha | part_of_house`;
   - `plotAreaSotka`, `landCategory`, `permittedUse`, `communications`.
5. Extend normalized feed data and source-scoped writes so import-owned values
   reach Payload deterministically. Accept recognised m², sotka and hectare
   units; do not infer a missing or unknown unit. Such input remains imported
   with `needsReview=true` and without a guessed `plotAreaSotka`.
6. Preserve manual ownership, feed source isolation, stable hashes and public
   gateway boundaries. Public R1 predicate and geo routing are out of scope
   except for retaining their existing behavior.
7. Generate Payload types and one forward migration only. Do not apply a
   migration to local or production data during this epic.

## Proof plan

- Add deterministic taxonomy/normalization fixtures covering all R1 and
  prepared-off category values, house subtypes, square metre/sotka/hectare
  conversion and ambiguous land area.
- Run the affected parser and ingest proofs, then typecheck and lint.
- Treat the schema migration as `RISKY`: delivery requires an exact-head
  SourceCraft `merge-risky` gate before merge. Staging rehearsal, production
  migration, DNS, Secret Master and server actions remain outside this task.

## Stop conditions

- A required field would need a destructive migration or an unapproved
  backfill of production data.
- A source format makes a unit ambiguous and provides no explicit unit token.
  The safe fallback is `needsReview=true`, not a numeric estimate.
- Scope expands to activating prepared-off public categories, changing R1 URL
  ownership or publishing real inventory.
