# EPIC-25 — HOUSE DISTRICTS / FACETS PREFLIGHT

## Scope

EPIC-25 owns nine administrative-district house candidates and one house facet:

- P2 districts: `kuybyshevskiy` (broad 70), `budennovskiy` (68) and
  `kirovskiy` (67), each with threshold 5 plus Content Gate;
- TEST districts: `voroshilovskiy`, `kalininskiy`, `kievskiy`, `leninskiy`,
  `petrovskiy` and `proletarskiy`, each with blank broad,
  `fallback_no_wordstat` and threshold 10 plus Content Gate;
- `/donetsk/doma/dachi/` as TEST with blank broad,
  `fallback_no_wordstat`, threshold 10 and `houseType=dacha` catalog ownership.

All candidates remain `200 noindex,follow` and absent from sitemap/top links
until their own inventory/content evidence passes the shared Content Gate.
Inventory and content activation remain owned by EPIC-38.

## Entry conditions

- EPIC-24 is closed and provides the bounded five-value `houseType` query,
  exact Payload predicate and facet DTO.
- RP grammar, Geo Model, SEO registry and Content Gate foundations are closed.
- District seed contains exactly nine administrative districts for houses;
  `tekstilshchik` remains apartment-only and has no house route owner.
- The generated registry materializes exact metadata, tiers, broad/source and
  thresholds for all ten candidates.

## Existing reusable foundation

- Typed grammar resolves house `categoryGeoDistrict` and the whitelisted
  `dachi` `categoryGeoFacet`, rejecting unknown paths.
- The shared resolver already maps every house district path to
  `category=house`, `geoSlug=donetsk` and its exact `districtSlug`.
- Registry metadata and `effectiveListingRobots()` enforce candidate status,
  inventory threshold and Content Gate behavior.
- Sitemap and top-link builders include candidates only after the same Gate.

## Gap and minimal implementation boundary

`catalogQueryFor()` currently maps apartment room facets and land-use facets,
but the approved house `dachi` path does not yet add `houseType=dacha` to the
Public Gateway query. The implementation needs that one typed mapping plus a
focused verifier covering all district and facet contracts, Gate-off/Gate-on
robots, exact tiers/evidence, catalog ownership, unknown-path denial and the
absence of a house Textilshchik owner.

No seed, generated registry, schema, migration, auth, dependency, secret,
inventory activation or production change is required.

## Delivery readiness

The stream starts from confirmed canonical `origin/main`
`7a5a8f77b61dee0e07ea131433ba09c58216fc7b`. Parent dependencies are closed,
SourceCraft API/Git transport is available through the canonical secret
workflow, and no owner or external prerequisite blocks the scoped change.
