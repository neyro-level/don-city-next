# EPIC-40 — CACHE VERIFICATION

- Task: `dcv4-task-40-verify`
- Base main: `34e9bed0dab6f759ce929689419be49daf24a9a8`
- Preflight: `8b5fa6bc4a6979f9ce8a402cd7febbd24e0bd5ca`
- Implementation checkpoint: `e243c41019cdc9db8cf7c805ce19a0a7d6dfbeff`
- Production, DNS, database data and secrets: not touched.

## Acceptance matrix

| Target | Result | Evidence |
| --- | --- | --- |
| Home | PASS | Home and NAP reads use the cached facade; tags are `site` plus `properties` where featured inventory is involved. |
| ALL | PASS | `/donetsk/` receives an independent normalized key and `properties` + `geo:donetsk` tags. |
| Category | PASS | Category input is part of the key and receives the matching `geo:{slug}:cat:{category}` tag. |
| District | PASS | District input is part of the key and receives the city-scoped `district:{city}:{slug}` tag. |
| Facet | PASS | Room/house/land facet inputs produce distinct keys and inherit geo/category invalidation without adding a competing tag grammar. |
| Property | PASS | Property reads use `properties` plus `property:{publicUrlId}`; Proxy and lifecycle HTTP stay on the uncached raw provider. |
| Write invalidation | PASS | Property/page/NAP/geo/redirect hooks reuse the authenticated allowlisted HTTP adapter; feed imports retain one batched invalidation and skip per-row hooks. |
| Safety fallback | PASS | Every Data Cache entry has a 3600-second TTL when event invalidation is unavailable. |

## Checks

- `pnpm verify:cache-targets` — PASS.
- `pnpm verify:gateway-context` — PASS.
- `pnpm verify:home-page` — PASS.
- `pnpm verify:property-detail-routes` — PASS.
- `pnpm verify:route-resolver` — PASS.
- Apartment district/room, house district/facet and land facet verifiers — PASS.
- `pnpm verify:feed-ingest` and `pnpm verify:feed-lifecycle` — PASS.
- `pnpm verify:security-boundaries` — PASS together with safe-outbound and
  secrets guards after replacing the legacy direct `overrideAccess: true`
  initializer with a named System Gateway and naming the public field policy.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS (469 modules, 1441 dependencies).
- Biome on all changed files — PASS; repository-wide lint exits successfully
  with the existing generated-migration/UI warnings.
- `pnpm build` — PASS on Next.js 16.3.5; Home and static marketing pages remain
  one-hour ISR and the catch-all catalog remains dynamic with cached data reads.

## Review notes and limitations

- Graphify confirms the cached catalog facade has one App Router consumer and
  the invalidation facade is limited to the seven intended Payload owners.
- No Cache Components flag, schema, migration, dependency or public DTO changed.
- A live multi-request cache-hit observation requires the later staging/runtime
  environment. The exact keys, tags, allowlist, hooks, compilation and build
  are covered locally; staging remains the owner of deployed behavior proof.
