# RP-04 — implementation evidence

## Delivered

- Portable `src/platform/grammar` with the exact eight `PageKey` variants, `buildUrl`, `parseUrl` and canonical path typing.
- Deterministic registry-backed parsing in the §8 order, including root and district/facet collision rejection.
- Project-owned registry and property-category mapping in `src/project/url-grammar.ts`; no DON CITY literals were added to Platform.
- Canonical URL construction wired into menu/shell DTOs, property cards/details, breadcrumbs, canonical metadata, JSON-LD, sitemap, lead context/validation, feed cache invalidation, CMS page paths and fixture DTOs.
- `guard:no-literal-hrefs` added to `quality:guards`.
- Generative round-trip proof covers all eight variants and project composition.

## Focused proof

- `pnpm verify:url-grammar` — PASS, 22 generated round trips plus collision/negative/project cases.
- `pnpm guard:no-literal-hrefs` — PASS.
- `pnpm guard:platform-no-project-literals` — PASS.
- `pnpm quality:architecture` — PASS, 394 modules / 1152 dependencies.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with pre-existing warnings only.
- `pnpm verify:seo-contracts` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:lead-intake` — PASS.
- `pnpm verify:feed-ingest` — PASS.
- `pnpm verify:feed-lifecycle` — PASS.
- `pnpm verify:site-profile` — PASS.
- `pnpm build` — PASS; Google font fetch timed out during retries, compilation completed with a warning.
- Native PostgreSQL 18 isolated database `don_city_rp04_test`: all existing Payload migrations — PASS; `pnpm verify:schema` — PASS.

## Known program-level limitations

- Required integration reaches the property-lead scenario, then stops at the existing client-readiness guard because retention/legal/storage/indexing decisions remain intentionally incomplete. These inputs belong to later approved epics and were not weakened in RP-04.
- Local `quality:guards` reaches the existing SourceCraft policy check and reports the already tracked non-blocking policy reconciliation task `dcn-4ic0`. URL, Platform, architecture, design-token, module and UI guards before it pass.
- RP-06 remains the owner of dynamic canonical route resolution and redirect/status behavior. RP-04 changes URL production only, as ordered by the approved dependency graph.

