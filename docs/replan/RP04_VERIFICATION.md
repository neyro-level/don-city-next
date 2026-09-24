# RP-04 — acceptance verification

## Requirements matrix

| Requirement | Evidence | Verdict |
| --- | --- | --- |
| Exact `PageKey` union | `src/platform/grammar/types.ts`: `home`, `geoHub`, `categoryRoot`, `categoryGeo`, `categoryGeoDistrict`, `categoryGeoFacet`, `property`, `static` | PASS |
| Lowercase trailing-slash builder | `buildUrl`; generated matrix asserts lowercase and trailing slash for every variant | PASS |
| Deterministic parser | registry-backed `parseUrl` follows static → category → geo and district → facet order | PASS |
| Round trip | `pnpm verify:url-grammar`: 22 generated keys plus real project composition | PASS |
| No literal public paths | `guard:no-literal-hrefs`: PASS; Payload admin `/:id/*` endpoints are explicitly out of public URL scope | PASS |
| Portable Platform | Platform literal guard and dependency-cruiser: PASS | PASS |
| Consumers migrated | DTO/menu, cards, breadcrumbs, sitemap, canonical/OG, JSON-LD, leads, cache targets, fixtures and CMS paths use grammar | PASS |
| Schema compatibility | isolated PostgreSQL 18 migrations and `verify:schema`: PASS; RP-04 adds no migration | PASS |

## Risk proof

- Exact implementation head: `a954d158e373b861b089269afa35257b7f0dcaf5`.
- Focused checks, typecheck, lint, architecture and production build pass as recorded in `RP04_IMPLEMENTATION.md`.
- `verify:merge-risky` is reserved for the exact PR head delivery stage. The current repository-wide client-readiness and SourceCraft-policy limitations are pre-existing, explicitly tracked, and were not weakened to manufacture a local green result.
- No production, DNS, server or secret state was changed.

