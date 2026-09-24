# EPIC-13 — Public Gateway preflight

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`
- Source anchor: `EPIC-13`
- Base: `a6b734670dc71b73960b8f1bd069459b8309967e`
- Status: ready for implementation

## Entry evidence

- `RP-12` is closed; city-first route inputs are available.
- `EPIC-12` is merged: public `RegionDTO`, `CityDTO`, `DistrictDTO` and
  `PropertyLocationDTO` are frozen at contract `1.3.1`.
- The existing public catalog still selects and filters `cityRaw` and
  `districtRaw`. This is the precise residual gap; it must be replaced by
  explicit published geo relations without changing R1 publication scope.

## Minimal implementation contract

1. Extend the Public Gateway select with allow-listed Region/City/District
   relation fields and map them to the frozen geo DTOs.
2. Accept explicit grammar-owned geo/category/district/facet inputs, map them
   to Payload relations and reject unpublished or mismatched geography.
3. Keep property lookup keyed by `publicUrlId`; related-object queries use the
   actual resolved city rather than a hardcoded name or raw fallback.
4. Preserve the fixture-safe no-Payload path and public access policy. No raw
   Payload documents may be returned to UI.

## Boundaries

- No migration, production, DNS, secret or R2 activation belongs to this epic.
- Raw source locality/district text remains only a fallback for unnormalised
  feed data; it is not a canonical geo identity or SEO-owner input.
- Category×district and category×facet are mutually exclusive route inputs.

## Planned proof

- targeted gateway fixture/static verifier for geo-aware query construction;
- existing public-gateway, route-resolver, geo-model and type checks;
- full diff review and one exact-head RISKY SourceCraft gate before merge.
