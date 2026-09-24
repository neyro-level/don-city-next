# RP-11 implementation — sitemap, robots and IndexNow

## Outcome

- Sitemap static/listing owners are projected from the V4 SEO registry only.
- Inclusion requires active, `index,follow`, content-gate-passed and grammar-owned canonical state.
- Global category roots, nearby geo, candidate district/facet owners and V3 category-first URLs are excluded.
- Generic CMS page slugs are no longer allowed to create sitemap owners outside the registry.
- Property URLs remain published-object entries produced by the typed grammar.
- Listing `lastmod` is the maximum of the reviewed registry content revision and the latest published owned-object `updatedAt`; property `lastmod` uses its own `updatedAt`.
- IndexNow is a provider-neutral payload contract for publication, meaningful update, archive, removal, gone and canonical move. Canonical moves require persisted-canonical evidence and submit both old and new URLs.
- No live IndexNow request, production mutation, DNS change or secret mutation was performed.

## Focused proof

- `pnpm verify:sitemap-indexnow` — PASS.
- `pnpm verify:seo-contracts` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with pre-existing warnings only.
- `pnpm quality:architecture` — PASS.
- `pnpm quality:guards` — scoped guards PASS until the pre-existing SourceCraft policy guard, which remains tracked by the isolated CI-policy task and is outside RP-11.
