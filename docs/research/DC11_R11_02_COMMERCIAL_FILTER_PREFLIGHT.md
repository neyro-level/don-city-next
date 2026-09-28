# DC10-R11-02 — commercial filter repair preflight

Status: PREFLIGHT COMPLETE; IMPLEMENTATION REQUIRED

Baseline SHA: `98447ca1fc47fa44ef4b0a6ed86158ee2131ef10`

Observed: 2026-09-28

## 1. Exact defect

`src/project/public-route-resolver.ts` owns the route-to-catalog query contract.
Its `CatalogQuery` type permits `commercial`, but the exhaustive runtime
`domainCategory` map contains only apartments, houses and land.

Consequently both active commercial route forms resolve as pages while their
`catalogQuery.category` is `undefined`:

- canonical `/donetsk/kommercheskaya/`;
- compatibility/root `/kommercheskaya/`.

The public catalog then receives no category constraint and can return mixed
inventory. This is a resolver defect, not a Payload schema or data defect.

## 2. Owner and minimal repair

| Concern | Owner | Required change |
| --- | --- | --- |
| URL category identity | `src/project/url-grammar.ts` | No change: `commercial → kommercheskaya` is already canonical. |
| Route query | `src/project/public-route-resolver.ts` | Add `kommercheskaya: "commercial"` to the existing map. |
| Public data query | `src/core/data-access/public/catalog.ts` | No change: it already applies `category: { equals: query.category }`. |
| Regression proof | project verification scripts | Assert both commercial route forms produce `category=commercial`; retain adjacent category controls. |

No import boundary, database, migration, route, sitemap, production, secret or
monitoring change is required.

## 3. Acceptance matrix

| Acceptance | Proof |
| --- | --- |
| Canonical commercial route is filtered | Resolver fixture asserts `/donetsk/kommercheskaya/` returns `catalogQuery.category === "commercial"`. |
| Compatibility/root route is filtered | Resolver fixture asserts `/kommercheskaya/` returns the same category. |
| Adjacent categories do not regress | Existing route resolver, CP-02A and catalog query tests stay green. |
| Scope remains bounded | Exact diff changes the mapping, targeted guard and evidence only. |

## 4. Document impact

- Added this durable defect and implementation contract.
- Reviewed PRD, Product Structure, Architecture, Backlog and Release Checklist;
  no owner contract changes are needed.
- Production and persistent data remain untouched.
