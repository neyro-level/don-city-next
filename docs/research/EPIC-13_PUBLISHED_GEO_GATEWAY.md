# EPIC-13 — Published geo Public Gateway

## Outcome

Public catalog routes use canonical `geoSlug` and `districtSlug`, resolve them through published Payload `cities`, `regions` and `districts`, and then filter properties by relationship IDs. Raw feed labels (`cityRaw`, `districtRaw`) are no longer part of the public catalog selection or facet aggregation.

## Public boundary

- The gateway selects relation IDs at `depth: 0` and retrieves only allow-listed published geo fields.
- A property receives `PropertyLocationDTO` only when its city and city region are published; a district is emitted only when it is published and belongs to that city.
- Unknown, unpublished or city-mismatched geo resolves to an empty catalog/facet result and never falls back to another city.
- Property lookup remains immutable by `publicUrlId`; related-object discovery reuses the resolved city slug.

## URL grammar coverage

- `geoHub` → `geoSlug`.
- `category × geo` → category + `geoSlug`.
- `category × district` → category + `geoSlug` + `districtSlug`.
- `category × facet` keeps the approved room facet mapping and uses the same `geoSlug`.

## Compatibility evidence

Installed runtime: Payload 3.90.1. Official Payload Local API, Select and Depth documentation checked on 2026-09-24. The implementation uses Local API `find`, explicit `select`, relationship IDs at `depth: 0`, and anonymous context-aware gateway access.

## Targeted verification

- `pnpm verify:geo-model`
- `pnpm verify:public-gateway`
- `pnpm verify:gateway-context`
- `pnpm typecheck`

`pnpm lint` completes with existing repository warnings in generated migrations and shared UI; no new lint diagnostics were introduced by this epic.
