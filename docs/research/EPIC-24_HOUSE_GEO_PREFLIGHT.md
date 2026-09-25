# EPIC-24 — HOUSE GEO CATALOG PREFLIGHT

## Scope

EPIC-24 owns the base house catalog pair and reusable subtype filtering:

- `/doma/` is a meaningful global category bridge with exact `HOUSE_ROOT`
  metadata, self-canonical URL and `noindex,follow` robots;
- `/donetsk/doma/` is the indexable Donetsk house catalog with exact
  `HOUSE_GEO` metadata and a `house + donetsk` catalog query;
- the catalog may filter the approved `houseType` taxonomy (`house`,
  `cottage`, `townhouse`, `dacha`, `part_of_house`) without inventing new
  indexable paths.

District and path-facet activation belongs to EPIC-25. In particular,
`/donetsk/doma/dachi/` remains the `HOUSE_FACET_DACHI` TEST candidate and may
become indexable only through its inventory threshold and Content Gate.

## Entry conditions

- EPIC-09 already owns and verifies the bounded Payload `houseType` taxonomy,
  including `dacha` and `part_of_house`.
- EPIC-13 Public Gateway, EPIC-14 SEO Engine and RP-12 city-first closure are
  closed in the approved v7 graph.
- Product Structure defines category roots as noindex bridges and category ×
  Donetsk routes as indexable catalog pages.
- Payload remains the sole schema and migration owner; public pages consume
  selected DTOs through the Public Gateway.

## Verified current foundation

- Typed URL grammar materializes `categoryRoot` and `categoryGeo` routes.
- The generated registry contains exact `HOUSE_ROOT`, `HOUSE_GEO` and gated
  `HOUSE_FACET_DACHI` contracts.
- `resolveProjectPublicRoute()` resolves the root and Donetsk catalog through
  the registry and supplies `category: "house"` plus the appropriate geo.
- Payload schema, generated types, ingest normalization and property DTOs
  already preserve the five approved house subtype values.

## Implementation gap and boundary

The Public Gateway catalog query currently has no `houseType` allowlist,
filter predicate or facet DTO. EPIC-24 implementation therefore needs a
bounded subtype filter through the existing public select/DTO path. It must
not expose raw Payload documents, accept arbitrary field names, or activate
the `dachi` SEO path owned by EPIC-25.

The smallest proof must cover exact root/geo metadata and robots, canonical
paths, `house + donetsk` query ownership, every approved subtype value, denied
unknown subtype input, and unchanged Content Gate behavior for
`HOUSE_FACET_DACHI`.

## Delivery readiness

The local stream is rebased onto confirmed canonical `origin/main`
`e20742e8ccd6432c2380c18a537a1e1cc43e8e52`. Task Manager decision
`dcv4-epic-20.3` is closed: SourceCraft API and Git transport are available
through the canonical secret workflow. No product, schema, database, secret or
production mutation is part of this preflight, and no unresolved owner or
external prerequisite blocks the bounded subtype-filter implementation.
