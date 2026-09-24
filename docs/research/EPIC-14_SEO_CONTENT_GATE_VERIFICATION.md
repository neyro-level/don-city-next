# EPIC-14 — SEO Engine / Content Gate / Seed Load: verification

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`  
**Verified branch head:** `140c349b450d6fd2d2d75737c65836cfd64fb60f`  
**Mode:** local verification only

| Acceptance surface | Evidence | Result |
| --- | --- | --- |
| Seed inputs and generated registry | `pnpm verify:seo-contracts` verifies 40 SEO rows, 10 district rows, V4 URL generation and 50 Wordstat owners. | PASS |
| Profile thresholds | `siteProfile` owns P1/P2=5 and TEST=10; `verify:seo-content-gate` exercises both P1 and TEST boundaries. | PASS |
| One Content Gate decision | `src/platform/seo/content-gate.ts` requires inventory, materialized registry metadata, 600-character introduction, verified district facts, SSR and HTML property links. | PASS |
| Route robots and query canonical | `verify:route-resolver` proves a candidate remains `noindex` without evidence and becomes indexable when the complete evidence provider returns a passing decision. | PASS |
| Navigation and sitemap eligibility | `navigation.ts` and `platform/sitemap/registry.ts` both consume `isListingSitemapEligible`; default candidate seed rows remain excluded. | PASS |
| Architecture and types | `pnpm typecheck`, scoped Biome lint and `pnpm quality:architecture` pass; dependency check reports 450 modules and 1359 dependencies with no violations. | PASS |

## Deliberate boundaries

- The verified code evaluates supplied evidence; it does not fabricate content, inventory, district facts or approval state.
- The existing candidate rows remain noindex and absent from sitemap until a future Payload-backed evidence provider supplies a passing dataset.
- No database seed application, migration, IndexNow call, production deployment, DNS or secret write was performed.
