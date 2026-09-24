# RP-09 verification

- Task: `dcv4-task-62-verify`
- Implementation head: `474f608ffa34c5f55c43295f1098ce6a7f2cb2e0`
- Risk classification: `STANDARD`
- Production / DNS / secrets: not touched

## Acceptance evidence

| Requirement | Result | Evidence |
| --- | --- | --- |
| R1 menu follows section 23 | PASS | Profile-derived `Недвижимость` tree contains `/donetsk/` and three ACTIVE categories; no R2 entries. |
| Desktop/mobile shell and keyboard focus | PASS | Nested desktop `details/summary`, focus-visible states and flattened mobile canonical links are rendered by the shared shell. |
| Breadcrumbs use actual page/property context | PASS | Catalog pages derive hierarchy from `PageKey`; property pages contain actual city, category and an available district owner. |
| Internal links follow Profile + grammar + registry | PASS | Home, hub, category and property link sets use `buildProjectUrl`; gated top links require active registry state with no pending content gate. |
| No internal 404, redirect or query equivalent | PASS | `pnpm verify:navigation`: 13 unique generated targets resolved to exact canonical `200`; no query string emitted. |
| Nearby city links are conditional | PASS | Makeevka fixture links only hub + apartments; houses and land remain absent/404. |
| `SINGLE_GEO` switcher hidden | PASS | `buildGeoSwitcher()` returned an empty list and the crawl assertion passed. |

## Executed checks

- `pnpm verify:navigation` — PASS.
- `pnpm verify:nearby-geo` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:site-profile` — PASS.
- `pnpm verify:url-grammar` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:seo-contracts` — PASS.
- `pnpm guard:no-literal-hrefs` — PASS.
- `pnpm guard:platform-no-project-literals` — PASS.
- `pnpm quality:architecture` — PASS, 414 modules / 1234 dependencies.
- `pnpm typecheck` — PASS.
- `pnpm lint` — exit 0; only 20 pre-existing generated/migration/style warnings.
- `pnpm build` — PASS on Next.js 16.3.5.

## Limitations

- District/facet links intentionally remain absent from hub/category blocks until their SEO registry content gate changes to an active, passed state.
- Live production crawl is outside RP-09 and remains prohibited without the explicit release flow.

## Traceability

- Plan owner: `EPIC-62 / RP-09`, section 23.
- Base main: `14100e6cf8901cfe22486f115ec78bb759b240f6`.
- Preflight: `bd4d92450adfc11ff56eebc4c0ae0b5957991d7a`.
- Implementation: `474f608ffa34c5f55c43295f1098ce6a7f2cb2e0`.
- Verification record: `915997f905c6a5c7a7abd184e9b96437f9efdb0e`.
- Deviations: none.
- Discovered follow-up work: none; gated SEO activation remains owned by the later content/inventory epic.
