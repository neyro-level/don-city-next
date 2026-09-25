# EPIC-39 — feed onboarding preflight

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

Date: 2026-09-25

Base main: `6c35541085fb6607f0e08cc8c9c93eed9b9b1f2d`

## Canonical contract

EPIC-39 must normalize feed taxonomy and geography, preserve `publicUrlId`
for the same `feedSource + externalId`, route unknown values to `needsReview`,
and prove a safe first baseline run. No production feed execution is part of
this implementation stream.

## Entry conditions

- EPIC-11 feed/geo normalization, EPIC-13 Public Gateway, EPIC-34 lead runtime
  and RP-12 profile proof are closed dependencies in the approved graph.
- Payload remains the only schema and persistence owner.
- The existing ingest path already provides source-scoped writes, streamed
  parsing, bounded batches, a first-run baseline that cannot deactivate missing
  objects, manual-field ownership, geo matching and stable property identity.
- The current property hook preserves an existing `publicUrlId` on updates and
  initializes it only once after create.

## Proven gap

Unknown taxonomy currently falls through to `apartment` and unknown deal type
falls through to `sale`. Unlike unknown geography and ambiguous land area, these
fallbacks do not mark the property `needsReview`. This can silently publish a
wrong category or transaction type and is the primary EPIC-39 implementation gap.

## Minimal implementation scope

1. Replace implicit taxonomy/deal fallbacks with an explicit normalization
   result that carries `needsReview` for unknown source values while retaining a
   deterministic safe stored value.
2. Propagate taxonomy review state through normalized offers and the Payload
   repository into the existing `properties.needsReview` flag without weakening
   geo or land-area review state.
3. Add a local Payload integration suite proving:
   - known taxonomy/geo normalization;
   - unknown taxonomy/geo produces `needsReview`;
   - repeated `feedSource + externalId` updates the same property and preserves
     its `publicUrlId`;
   - the first full baseline records counts but performs no missing-item
     deactivation.
4. Add a deterministic fixture-backed baseline command or verifier. It must not
   resolve a real feed URL, contact an external source, or write production data.

## Verification plan

- Existing parser, ingest, lifecycle, taxonomy, geo and `publicUrlId` verifiers.
- New fixture-backed Payload round trip against a disposable/local development
  database.
- Typecheck, security boundaries, architecture guard and production build.
- Migration/schema verification only if implementation proves a schema change is
  necessary; the expected path reuses existing fields and requires no migration.

## Stop conditions and safe fallback

- A real feed URL, provider credentials, production source identity or first
  production baseline remains an owner/release gate and is not required to
  complete EPIC-39 code readiness.
- Unexpected source values are retained as raw fields and marked for review;
  they are never silently treated as verified taxonomy or geography.
- No missing property may be deactivated during the first full run.
- Production, DNS, external secret mutation and destructive database operations
  remain out of scope.

## Dependency map evidence

Graph analysis traced `parseYrlFeed → normalizeYrlOffer → ingestNormalizedFeed →
createPayloadFeedIngestRepository → resolveFeedGeo / Properties hooks`, with
`runImportFeed → decideFeedRunCompletion` owning the safe baseline decision.
This is the complete implementation surface; public catalog code does not need a
new ownership path.
