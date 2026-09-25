# EPIC-21 — APARTMENT GEO CATALOG PREFLIGHT

## Scope

EPIC-21 owns the base apartment catalog pair:

- `/kvartiry/` is a meaningful global category bridge with exact `APT_ROOT`
  metadata, self-canonical URL and `noindex,follow` robots;
- `/donetsk/kvartiry/` is the indexable Donetsk apartment catalog with exact
  `APT_GEO` metadata and an apartment + Donetsk catalog query;
- secondary-market (`vtorichka`) intent belongs to `APT_GEO`; it does not get a
  separate facet or canonical path.

District, microdistrict and room-facet activation remains in EPIC-22 and
EPIC-23. Property detail routes remain outside this epic.

## Entry conditions

- EPIC-13 Public Gateway and EPIC-14 SEO Engine are closed in the approved v7
  graph.
- RP-12 is closed, so the city-first grammar and two-profile proof are the
  active route foundation.
- Product Structure names `/kvartiry/` as a noindex category bridge and
  category × Donetsk as the indexable catalog family.
- Architecture selects `/donetsk/kvartiry/` as the representative public page
  and requires DTO/ViewModel data from the Public Gateway.

## Existing reusable foundation

- Typed URL grammar materializes `categoryRoot` and `categoryGeo` paths.
- The generated SEO registry already contains exact `APT_ROOT` and `APT_GEO`
  rows with the approved metadata and robots contracts.
- `resolveProjectPublicRoute()` resolves both page keys through the registry,
  builds the apartment catalog query, and keeps raw Payload documents outside
  public UI.
- R1 navigation points `Квартиры` to `/donetsk/kvartiry/`; no `vtorichka`
  route owner exists in the approved seed or facet registry.

## Minimal implementation boundary

Implementation should reuse the shared catalog page and add a focused
invariant verifier for both apartment routes. The verifier must prove exact
metadata/H1, canonical paths, robots, catalog queries, navigation ownership,
and absence of a `vtorichka` facet owner. It must not duplicate route templates
or introduce schema, migration, auth, feed, lead or production changes.

## Delivery readiness

The stream was rebased onto confirmed `origin/main`
`72857c33c80373735e794a76ace08558456e545a`. SourceCraft API and Git transport
are available through the canonical `sourcecraft/prod` secret scope. No owner,
external, production or destructive prerequisite remains for the focused
apartment-route verifier.
