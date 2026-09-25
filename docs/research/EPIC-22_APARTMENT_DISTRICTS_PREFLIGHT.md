# EPIC-22 — APARTMENT DISTRICTS / MICRODISTRICTS PREFLIGHT

## Scope

EPIC-22 owns Donetsk apartment district and microdistrict catalog pages under
the city-first route family `/{geo}/kvartiry/{district}/`:

- all ten approved Donetsk district candidates resolve through the shared
  dynamic catalog route;
- `tekstilshchik` remains a microdistrict with `parent=null`, `P1`, broad 137,
  source `wordstat_v1`, preposition `на` and locative `Текстильщике`;
- TEST candidates keep blank broad, source `fallback_no_wordstat` and the
  ten-active-object threshold plus Content Gate;
- an optional parent may add one breadcrumb, but never changes the canonical
  district URL.

Room facets belong to EPIC-23. House districts belong to EPIC-25. Geo schema,
feed matching and seed loading were established by the closed RP foundation
and are outside this focused stream.

## Entry conditions

- EPIC-21 and RP-12 are closed in the approved v7 graph.
- Product Structure assigns the third city-first segment to a district,
  microdistrict or approved facet and makes district pages Gate-dependent.
- The master plan fixes district identity to `(city, slug)` and explicitly
  states that URL identity is independent of the optional parent relation.
- The active district and SEO seed files contain all approved apartment rows,
  including the exact Textilshchik hard contract and TEST tiers.

## Existing reusable foundation

- Typed grammar resolves registered `categoryGeoDistrict` keys and rejects
  unknown, district-plus-facet and four-segment routes.
- The generated SEO registry materializes exact district metadata, tier,
  threshold and canonical URL for every approved apartment district.
- `resolveProjectPublicRoute()` uses the same registry for metadata and page
  resolution and creates an apartment + Donetsk + district catalog query.
- Content Gate keeps candidates `noindex,follow` until inventory, materialized
  copy, verified context, SSR and property-link evidence all pass.
- Public catalog reads use explicit selects and city-scoped district lookup;
  raw Payload documents do not cross into public UI.

## Gap and minimal implementation boundary

The current generic breadcrumb builder proves the stable city-first URL but
has no explicit input for an optional district parent. Implementation should
add the smallest project-owned breadcrumb context needed to insert a parent
between the apartment category and current microdistrict while continuing to
derive both parent and child links from typed `categoryGeoDistrict` keys.

A focused EPIC-22 verifier must also prove the ten apartment district routes,
Textilshchik metadata and `parent=null` seed, TEST threshold/source/broad rules,
district catalog queries, unknown-route rejection, and URL equality with and
without an optional parent breadcrumb. No schema, migration, auth, feed,
dependency or production change is required.

## Delivery readiness

The stream starts from confirmed canonical `origin/main`
`cd4b36c9c37f3e2e2a19ee2b3640b22b5a997d4d`. SourceCraft API and Git
transport are available through the canonical `sourcecraft/prod` secret
scope. No owner, external, production or destructive prerequisite remains for
the scoped breadcrumb contract and invariant verifier.
