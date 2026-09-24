# EPIC-26 — Land Geo / Facets: preflight

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`  
**Epic:** `EPIC-26`  
**Mode:** implementation preparation; no production, database, DNS or secret write

## Source of Truth

- Master plan §18 and EPIC-26 require the land root and Donetsk catalog, IZH/SNT TEST facets and unit-safe land taxonomy.
- `docs/seo/SEO_REGISTRY_SEED.csv` is the canonical seed for `LAND_ROOT`, `LAND_GEO`, `LAND_FACET_IZHS` and `LAND_FACET_SNT`.
- `src/project/site.profile.ts` owns the `uchastki` facet whitelist and the TEST threshold of 10.

## Entry conditions

- Dependencies EPIC-09, EPIC-13, EPIC-14 and RP-12 are delivered to canonical main.
- EPIC-14 main commit is `d4ad63e17c556327cf2fa6b930b19657e20e40d0`.
- No external input is necessary for fixture, route, taxonomy and Content Gate integration. Payload data writes remain out of scope.

## Baseline findings

- Payload properties and ingest normalization already preserve `plotAreaSotka`, `landCategory`, `permittedUse`, communications and an explicit `landAreaNeedsReview` fallback.
- The V4 seed already carries both land facets as TEST candidates with blank broad data, fallback source, threshold 10 and `noindex,follow`.
- The remaining EPIC scope is to prove the public land catalog/facet path contract consumes those canonical values and does not promote TEST candidates before the shared Content Gate passes.

## Minimal implementation scope

1. Add focused public-route/catalog proof for land root, Donetsk geo and IZH/SNT facet queries.
2. Keep the facet-to-taxonomy mapping project-owned and explicit; unknown source values remain reviewable.
3. Verify TEST candidates stay noindex and out of navigation/sitemap until shared Content Gate evidence passes.

## Boundaries

- Do not invent legal land enums or normalize ambiguous units without `needsReview`.
- Do not seed Payload, migrate data, call IndexNow or alter production infrastructure.
