# DC10-R12-02 — agglomeration data model preflight

## Exact baseline

Read-only production evidence from 2026-09-28 shows one published city:
`donetsk`. It has no nearby-locality coordinates or approved agglomeration
members. The current `cities` collection already owns geo identity and the
nullable `agglomerationOf` relationship, but it does not own locality kind,
coordinates, coordinate verification, measured distance or owner whitelist
state.

The current public nearby gateway accepts any published city record. The
`makeevka` alias and fixture are candidate behavior, not an owner-approved
production whitelist. This is safe in current production only because no such
city row exists; the schema must fail closed before research or seed work can
add one.

## Affected owners

- `src/project/collections/Cities.ts` — the one existing locality entity;
  creating a second collection is forbidden.
- `src/core/data-access/public/nearby-geo.ts` — explicit public select and the
  fail-closed eligibility predicate.
- `src/project/geo/` — Haversine calculation and membership validation.
- `src/project/geo/feed-match.ts` — actual locality matching and
  `needsReview` behavior.
- `src/project/site.profile.ts` — candidate aliases only; it does not grant
  membership or public activation.
- `migrations/` and `scripts/verify-nearby-geo.ts` — schema/data transition and
  regression proof.

Graph inspection indexed 3427 nodes and confirmed that Cities, the public
nearby gateway, route resolver, Site Profile and geo DTOs are the shared owners.

## Implementation contract

1. Extend `cities`; do not add another geo collection or persistence service.
2. Add typed locality kind (`primary_city | nearby_locality`), nullable latitude
   and longitude, coordinate verification timestamp, stored agglomeration
   distance and an explicit owner-approved membership flag/timestamp.
3. Existing Donetsk migrates to `primary_city`. All existing and future nearby
   rows default to unapproved/fail-closed.
4. Approved membership requires: `nearby_locality`, `agglomerationOf` pointing
   to the primary city, both coordinate pairs present, coordinate verification,
   owner approval, and Haversine distance `<= 50 km`.
5. Missing/invalid coordinates, radius overflow, self-membership or an
   unapproved locality cannot become public agglomeration data.
6. Public nearby reads use an explicit select and return `null` unless every
   eligibility condition passes. Candidate aliases alone grant nothing.
7. Feed matching continues to preserve the actual locality. Unknown locality
   produces `city=null + needsReview=true`; it is never assigned to Donetsk.
8. The migration and seed are idempotent and reversible on empty and non-empty
   PostgreSQL 18 fixtures.
9. No nearby route, sitemap row, menu link or indexability is activated here.
   That remains owner-gated EPIC-111 after research EPIC-110.

## Verification matrix

| Case | Expected result |
|---|---|
| verified approved locality at 49.9 km | eligible model record, still no route activation in this epic |
| locality above 50 km | rejected/fail-closed |
| missing or unverified coordinates | rejected/fail-closed |
| candidate alias without owner approval | rejected/fail-closed |
| self/cyclic agglomeration relation | rejected |
| unknown feed locality | null city, raw value preserved, `needsReview=true` |
| same nearby property | never counted as Donetsk and never emits Donetsk address metadata |
| migration `up` twice then `down` | second `up` no-op; original rows restored |

## Risks and stop conditions

- RISKY schema/data/public-boundary change in a CRITICAL project.
- Stop on ambiguous primary identity, unknown production schema, missing
  rollback, invented coordinates or an attempt to treat a research candidate
  as owner-approved.
- Production, DNS, secrets and the owner whitelist remain unchanged.

## Document impact

- Changed: this preflight evidence only.
- Reviewed without change: PRD, Product Structure, Architecture, Backlog,
  Release Checklist and Operations.
- CURRENT→TARGET: one-city production remains current; the fail-closed expanded
  model is TARGET until implementation is merged and the final authorized
  production release applies it.
