# EPIC-26 — Land Geo / Facets: verification

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`  
**Verified head:** `54c137b80d2bac80e9019796da991afd63be2992`  
**Mode:** local verification only

| Surface | Evidence | Result |
| --- | --- | --- |
| Land taxonomy and unit normalization | `pnpm verify:property-taxonomy` covers m², sotka and hectare conversion plus ambiguous-value `needsReview`. | PASS |
| IZH/SNT facet grammar | `pnpm verify:land-facet-query` freezes the two project-owned facet slugs and their case-insensitive `permittedUse` query tokens. | PASS |
| Public path to catalog query | `pnpm verify:route-resolver` proves `/donetsk/uchastki/izhs/` and `/donetsk/uchastki/snt/` resolve to `category=land`, `geoSlug=donetsk` and their respective land facet. | PASS |
| Candidate indexing state | Existing seed entries remain TEST, `noindex,follow` and governed by the shared Content Gate. | PASS |
| Gateway and schema boundary | Public catalog validates only `izhs|snt`, filters `permittedUse` through the Payload Local API, and the searched source field is indexed. | PASS |
| Type and dependency integrity | `pnpm typecheck`, scoped Biome lint and `pnpm quality:architecture` pass. | PASS |

No database seed, migration, production deployment, DNS, IndexNow or secret mutation was executed.
