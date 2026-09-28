# DC10-R12-04 — agglomeration public routes preflight

- Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`
- Epic: `EPIC-111` / `DC10-R12-04`
- Baseline SHA: `0a911968e07239f6b7d62c58a965aac7bbbd47c5`
- Status: implementation contract ready; owner decision `OD10-04` still required
- Production, DNS, secrets and persistent data: unchanged

## Factual baseline

1. R12-02 extended the existing Payload `cities` collection with locality kind,
   coordinates, coordinate verification, primary-city relation, calculated
   distance and owner-controlled agglomeration approval. It did not add a
   second geo collection or approve a production locality.
2. The Public Gateway returns a nearby-locality DTO only when the stored city
   is published and the R12-02 coordinate, relation, radius and approval pair
   is valid. Its counts are scoped to the actual city relation and are kept
   separate by category.
3. R12-03 recommends `makeevka` / Макеевка as the sole candidate and recommends
   apartment and house category pages first. The research explicitly records
   `Activation now: NO` and does not approve a route, locality row, coordinates,
   inventory, sitemap entry or navigation link.
4. `docs/02_PRODUCT_STRUCTURE.md` and the approved plan keep `OD10-04` open:
   public locality and canonical slug require a later explicit owner decision.
5. Site Profile contains a candidate grammar key and aliases for `makeevka`, but
   its `geoCategoryStatus.makeevka` map is empty. The current nearby resolver
   does not consume that activation state.
6. Given a synthetic eligible availability DTO with two apartments, the current
   resolver returns `200 noindex,follow` for `/makeevka/` and
   `/makeevka/kvartiry/`; it also creates inbound property links. This is the
   historical RP-08 behavior, not the v13 pre-gate target.

## Convergence contract

| Owner | Current | Required before any public activation |
| --- | --- | --- |
| Owner decision | Research recommendation only | Exact approved locality whitelist, canonical slug and route set. |
| Site Profile | Candidate grammar key; no active category | One explicit project-owned route activation allowlist; empty means fail closed. |
| URL grammar | Typed `geoHub` and `categoryGeo` forms exist | Only the approved slug/category combinations may resolve. District/facet routes stay forbidden. |
| Public Gateway | Validates actual locality and returns separate counts | Preserve actual locality DTO and city-scoped counts; never fall back to Donetsk. |
| Resolver | Eligible synthetic locality can return `200 noindex` without the later route decision | Return `404` and emit no links until the exact route is owner-approved and its inventory/content gate passes. |
| Metadata / JSON-LD | Visible page copy uses actual locality forms; property structured data already uses actual city | Keep actual locality in title, H1, breadcrumbs, address metadata and JSON-LD; never substitute Donetsk. |
| SEO transport | Current production research observed no Makeevka sitemap row | Sitemap, IndexNow, navigation and canonical reachability must use the same approved, gate-passed route set. |

## Required implementation proof after owner decision

- typed hub/category URLs for only the approved locality and categories;
- separate actual-locality total and category counts;
- `404` plus zero internal links, sitemap rows and IndexNow candidates before
  approval or when geo/inventory/content evidence is incomplete;
- factual locality metadata and JSON-LD on each reachable route;
- rejection of district/facet and alternate canonical slug routes;
- no production mutation and no second database, collection or geo owner.

## Owner decision required

`OD10-04` must explicitly state:

1. whether `makeevka` / Макеевка is approved for the public locality whitelist;
2. whether `makeevka` is the canonical slug;
3. which route set is approved (`hub`, `kvartiry`, `doma`, `uchastki`), noting
   that research currently recommends apartments and houses first, land later,
   and forbids commercial, district and facet routes.

Plan approval alone does not answer these later choices: v13 lists them as a
separate owner gate. Until that decision exists, the safe target is fail-closed
`404` with no public links.

## DOC IMPACT

This preflight adds factual evidence only. Product Structure remains the owner
of the pending decision; PRD, Architecture, Backlog, Release Checklist,
Project, Operations and Design were reviewed without semantic change.
