# EPIC-11 preflight — feed taxonomy and geo normalization

Status: PASS — implementation is bounded and may start
Date: 2026-09-24
Scope: `dcv4-task-11-preflight`

## Task contract

- **Outcome:** source values are mapped explicitly into the DON CITY property
  taxonomy; a Textilshchik value in a Donetsk feed district is deterministically
  attached to the seeded microdistrict; an unknown district is retained as raw
  evidence, marked for review, and does not hide the property from the general
  catalog.
- **In scope:** YRL feed taxonomy normalization, city-scoped district matching,
  Payload ingest write boundary and deterministic fixture proofs.
- **Out of scope:** importing a production feed, applying migrations,
  changing the managed database, production routes/DNS, creating districts from
  unverified feed text, or changing the published SEO registry.
- **Risk:** STANDARD for application behaviour, with a data-quality boundary.
  The task must preserve source-scoped upsert and manual ownership contracts.

## Entry

- Base: SourceCraft `main@c80f358f312e221ed6c79bea49fce35663ad16bf`.
- Branch: `codex/epic-11-feed-geo-normalization`.
- Approved source: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`, plan v7,
  §10 and `EPIC-11`.
- Completed dependencies: RP-05 geo model, EPIC-09 taxonomy and EPIC-10 public
  URL identity.
- Platform: AMS Realty Platform Core 3.0 + Payload 3.90.1. Payload remains the
  only schema and persistence owner.

## Verified current state

1. The normalized YRL offer retains source `category`, `propertyType`,
   `houseType` and deal type, but feed ingestion currently classifies categories
   through implicit regular-expression matching.
2. Geo resolution preserves raw region/city/district strings and scopes a
   district lookup by the resolved city. Its existing Textilshchik handling
   matches only an exact label, while §10 requires a `districtRaw` value
   containing `Текстильщик`.
3. A missing district already becomes `district=null` and `needsReview=true`;
   the ingest repository continues writing a property, so the general catalog
   visibility rule is attainable without a fallback district.
4. Graph inspection identifies the contained impact: feed normalization and
   ingest repository are the only write path; geo-model and runtime fixtures
   prove the resolver boundary; scheduled jobs import the same repository.

## Implementation contract

1. Replace implicit taxonomy classification at the YRL boundary with an
   explicit, documented source-value map and a safe compatibility fallback.
2. Match a Textilshchik-containing district raw value only after resolving the
   canonical Donetsk city, and only to the seeded `tekstilshchik` microdistrict.
3. Preserve raw source values. Do not manufacture districts, change a city from
   an unmatched district, or broaden a Donetsk-specific mapping to another city.
4. Keep an unrecognized district as `null`, set `needsReview`, and retain the
   object in the ordinary ingest flow.
5. Add deterministic proofs for source taxonomy, a non-exact Textilshchik
   variant, city scoping, and the unknown-district path. No database migration
   is expected or allowed for this epic.

## Proof plan

- Run targeted feed-ingest and geo-model verification, then typecheck, scoped
  lint and whitespace checks.
- Run the post-change dependency query to confirm only intended boundaries are
  affected.
- Record any unavailable DB-dependent runtime proof as a limitation rather than
  substituting fixture evidence for it.

## Stop conditions

- A change requires creating or mutating managed geo data from unverified feed
  text.
- The exact external source labels are insufficient to make an explicit mapping
  deterministic and a fallback would silently misclassify an object.
- The proposed change bypasses the source-scoped ingest repository or alters
  manual ownership behaviour.
