# RP-04 — preflight

## Execution identity

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7, `APPROVED`.
- Source hash: `9f4b011c10520d4d4a813da5e0f10409354c84f1901a62c5cc3a89f073319418`.
- Task: `dcv4-task-57-preflight`.
- Branch: `codex/rp-04-canonical-url-grammar`.
- Base: `b4dea6ee9215bbe1c178e72f630a3d5d4f3dcc2a` (`origin/main`).
- Delivery: `MERGE_AFTER_GATE`, `RISKY`, plus `verify:schema`.

## Task Contract

Implement only EPIC-57/RP-04: introduce portable typed URL grammar and route every existing public/internal URL producer through it. Preserve Payload as the only schema owner and keep DON CITY literals outside `src/platform/**`. Do not implement RP-05 geo schema, RP-06 route lifecycle/resolver behavior, production, DNS, server or secret mutations.

## Confirmed contract

- `src/platform/grammar` owns `PageKey`, `buildUrl` and `parseUrl`.
- `PageKey` variants are exactly `home | geoHub | categoryRoot | categoryGeo | categoryGeoDistrict | categoryGeoFacet | property | static`.
- Builders emit lowercase paths with one trailing slash.
- Parsing follows §8 order: static/service, category root, geo; then geo/category or category/property; then city district before category facet.
- A project-owned typed registry supplies categories, geos, static slugs, city-scoped districts and category-scoped facets. This makes the district/facet decision deterministic while keeping Platform portable.
- Property paths use `{category}/{semantic}-{publicUrlId}`. Until RP-05 adds the dedicated field, current public records supply the existing stable numeric Payload id as `publicUrlId`; no schema mutation belongs to RP-04.
- Current route-file ownership remains unchanged. RP-06 owns the canonical dynamic resolver and redirect/status behavior; RP-04 makes produced URLs canonical ahead of that switch.

## Consumer inventory

The implementation must replace construction in:

- public DTOs: property cards, header/footer/menu, breadcrumbs, service links and lead source pages;
- catalog page metadata and card links;
- property metadata, JSON-LD breadcrumbs and lead context;
- sitemap static, CMS page and property entries;
- property lead validation;
- CMS page canonical paths and portable catalog SEO base paths.

Non-public operational paths (`/api`, Payload custom endpoints, cache revalidation paths), media URLs, `tel:` links and explicit redirect destinations are outside the catalog-path guard.

## Verification design

- Generative round-trip matrix covers every `PageKey` variant with multiple lowercase slug samples.
- Negative/collision cases cover reserved roots, unknown values, 4+ segments, invalid property ids, and district-before-facet precedence.
- `guard:no-literal-hrefs` scans application source and rejects catalog path literals outside grammar, tests and the project registry/composition input.
- Required final checks: focused grammar verification, guard, architecture, typecheck/lint, `verify:merge-risky`, `verify:schema` against an isolated native PostgreSQL database.

## Stop conditions checked

- Plan/inventory drift: none.
- RP-03 dependency: merged and closed.
- Production/DNS/secret mutation: not required and forbidden in this stream.
- Destructive migration: not required.

