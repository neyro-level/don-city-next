# EPIC-20 — GEO HUB PREFLIGHT

## Scope

`/donetsk/` is the indexable all-property city hub. It owns general property
intent for Donetsk; the home page retains agency, realtor and brand intent.

## Existing reusable foundation

- `PageKey.geoHub` and the URL grammar build `/donetsk/` from the primary geo.
- `resolveProjectPublicRoute()` resolves a primary geo hub through the approved
  SEO registry and passes a `{ geoSlug: "donetsk" }` catalog query.
- `CatalogPageView` receives the resolved H1, metadata and catalog query from
  the public route layer.
- R1 navigation and the home catalog links derive `Вся недвижимость` from the
  same geo-hub URL builder.

## EPIC-20 acceptance proof

The dedicated verifier must prove the exact ALL registry metadata, canonical,
`index,follow`, Donetsk catalog scope, and both menu targets. This preserves
the reusable template and prevents a city hub from becoming a home-page alias.
