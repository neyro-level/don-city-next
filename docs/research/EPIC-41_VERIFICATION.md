# EPIC-41 Analytics verification

## Result

`PASS` at implementation head `2bfb178fd60d807ab05ce03fc7cc7b15508a1fe5`.

The public UI now emits the approved page, filter, property and lead lifecycle events through one provider-neutral browser boundary. The boundary accepts only explicit non-PII dimensions, appends the normalized record to `window.amsAnalyticsQueue`, and dispatches the local `ams:analytics` custom event for a future consent/provider adapter. No external analytics request, cookie, identifier, secret, server write or schema change is part of EPIC-41.

## Acceptance matrix

| Criterion | Verdict | Evidence |
|---|---|---|
| `all_property_view` | PASS | `geoHub` resolves to the event in `src/app/(site)/public-route.tsx`; `CatalogPageView` emits it with canonical page identity. |
| `category_catalog_view` | PASS | Category root and category-by-geo catalog pages use the category event. |
| `district_view` | PASS | `categoryGeoDistrict` has an explicit event mapping. |
| `facet_view` | PASS | `categoryGeoFacet` has an explicit event mapping. |
| `filter_apply` | PASS | Only supported query filter-key names (`rooms`, `houseType`) are emitted; filter values and free text are excluded. |
| `property_open` | PASS | Property detail emits one view event from `PropertyPageView` with `PublicPageIdentityDTO` dimensions. |
| Lead events | PASS | `lead_form_view`, valid `lead_submit`, `lead_success` and `lead_error` are emitted from the shared lead form. |
| No PII | PASS | The runtime normalizer constructs records from an allowlist. Verification injects `name`, `phone`, `message`, `query` and an unknown filter key and proves they are dropped. |
| Canonical identity | PASS | Page events consume the existing `PublicPageIdentityDTO` from ADR-0005; no second route identity is introduced. |

## Executed checks

- `pnpm verify:analytics` — PASS: all approved names are wired; hostile PII input is removed; browser queue and local custom-event dispatch are observed.
- `pnpm typecheck` — PASS.
- Targeted Biome lint for analytics modules, touched views and verifier — PASS.
- `pnpm quality:architecture` — PASS: 479 modules / 1,504 dependencies, no violations.
- `git diff --check` — PASS.

Repository-wide `pnpm lint` also completed without errors and reported only 26 pre-existing warnings outside the EPIC-41 diff.

## Limitations / next boundary

A provider adapter is intentionally not configured because the approved plan does not choose a vendor, consent mode, external script or credential. Connecting Yandex Metrica, GA or another external collector is a separate owner/privacy configuration task; this implementation already exposes the stable non-PII event stream it may consume.

No production action was performed.
