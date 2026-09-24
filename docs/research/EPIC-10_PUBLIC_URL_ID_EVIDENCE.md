# EPIC-10 — evidence ledger

Date: 2026-09-24
Scope: stable public property URL identity

This index records delivery evidence without duplicating the approved V4
master plan. Requirements remain in
`AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` §19 and `EPIC-10`.

## Implemented surface

- `Properties.ts` owns `publicUrlId`: a unique indexed numeric field assigned
  once by a guarded `afterChange` hook after Payload has generated the record
  ID. Direct changes are overwritten with the existing value.
- `feed-ingest.ts` retains the existing object for the same
  `feedSource + externalId`; its update data has no public-identity field.
- Public Gateway catalog, lifecycle lookup, DTO cards, sitemap and lead
  canonicalisation use the stored public identity. Internal `properties.id`
  remains the Payload relation/database key only.
- `public-url-id.ts` validates the one-way conversion to a positive decimal
  public value. `verify-public-url-id.ts` covers this conversion, canonical
  path construction, semantic/category mismatch 301 and absence of internal-ID
  lookup fallback.
- `20260924_144035_public_url_id` is the generated forward Payload migration;
  it has not been applied.

## Verification index

- Contract and implementation boundaries:
  `EPIC-10_PUBLIC_URL_ID_PREFLIGHT.md`.
- Acceptance/check matrix:
  `EPIC-10_PUBLIC_URL_ID_VERIFICATION.md`.
- Exact implementation head: `7a020f5750869aea5a5a275cc7c9b5d3f309fbf3`.

## Boundary statement

No Secret Master, server, DNS, production action or database mutation was
performed. The pending database-backed migration proof belongs only to an
explicitly authorised staging/release task; it is not represented as completed
here.
