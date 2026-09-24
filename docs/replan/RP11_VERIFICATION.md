# RP-11 verification — sitemap, robots and IndexNow

## Acceptance matrix

| Criterion | Result | Evidence |
| --- | --- | --- |
| Fixture sitemap snapshot and XML validation | PASS | `scripts/fixtures/rp11-sitemap.snapshot.json`; `pnpm verify:sitemap-indexnow` |
| Only grammar-owned V4 canonical URLs | PASS | Nine registry owners round-trip through `parseProjectUrl`/`buildProjectUrl` |
| No V3, nearby geo or global category-root leak | PASS | Explicit negative assertions for category roots, Makeevka and `/kvartiry/donetsk/` |
| Published properties keep typed canonical URLs | PASS | Public gateway sitemap uses `buildPropertyUrl` and publication-only query |
| Meaningful listing/property `lastmod` | PASS | Registry revision is fixed; catalog owners take max registry/object `updatedAt`; properties use their own `updatedAt` |
| Robots contract | PASS | Public/noindex fixtures pass; production build emits project noindex policy while public indexing is not owner-enabled |
| Event-driven IndexNow | PASS | Publication, meaningful update, archive, removal and gone fixtures emit only the affected canonical URL |
| Canonical move submits old and new | PASS | Persisted-canonical fixture emits both historical and current URLs; unowned current URL is rejected |
| No deploy-wide or live submission | PASS | Payload builders only; no transport/deploy hook and no external request |

## Checks

- `pnpm verify:sitemap-indexnow` — PASS.
- `pnpm verify:seo-contracts` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with 20 pre-existing warnings and no errors.
- `pnpm quality:architecture` — PASS, 424 modules / 1266 dependencies.
- `pnpm build` — PASS; generated `/sitemap/0.xml` contains exactly the nine snapshot owners and `/robots.txt` reflects the safe noindex policy.

The aggregate `quality:guards` remains stopped by the pre-existing isolated SourceCraft policy task after all earlier guards pass. RP-11 exact-head delivery still requires the configured SourceCraft STANDARD Gate.
