# RP-06 — verification

## Scope and identity

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7, EPIC-59/RP-06.
- Branch: `codex/rp-06-resolver-routes`.
- Implementation checkpoint: `1ffcda7efece5104ab4cac0f59db2dc1b6605369`.
- Database proof: isolated local PostgreSQL 18 database `don_city_rp06_test`; no production/server/DNS mutation.

## Acceptance matrix

| Contract | Result | Evidence |
|---|---|---|
| One shared typed result for page and metadata | PASS | `src/project/public-route-resolver.ts`, cached server adapter and `public-route.tsx` |
| Exact V4 static/service owners | PASS | seven explicit routes; HTTP metadata matrix |
| City-first geo/category/district/facet owners | PASS | resolver and HTTP matrices cover hubs, active categories, seeded districts and whitelisted facets |
| Category roots in SINGLE_GEO | PASS | `200 noindex,follow`, self-canonical |
| PREPARED_OFF | PASS | `/donetsk/novostroyki/` → `404` |
| V3 category-first | PASS | `/kvartiry/donetsk/` → `404`; no speculative redirect |
| Donor route | PASS | `/obekty/test/` → `404`; donor page removed |
| District×facet / unknown third / 4+ | PASS | all return `404` |
| Property identity | PASS | lookup uses numeric `publicUrlId`; canonical rendering uses grammar-owned URL |
| Semantic/category mismatch | PASS | exact one `301` directly to the slash-form canonical URL |
| Trailing slash | PASS | ordinary no-slash path receives exact one `308`; property mismatch plus absent slash still receives one direct `301`, not a chain |
| Existing API security boundary | PASS | anonymous raw Payload REST smoke remains `404` after proxy composition |

## Commands actually passed

- `pnpm verify:url-grammar`
- `pnpm verify:route-resolver`
- `pnpm verify:route-http` against the production build and seeded fixture
- `pnpm verify:seo-contracts`
- `pnpm verify:site-profile`
- `pnpm verify:public-gateway`
- `pnpm verify:lead-intake`
- `pnpm verify:schema`
- `pnpm quality:architecture`
- `node scripts/quality/architecture-guard.mjs`
- `pnpm typecheck`
- `pnpm lint` (exit 0; only pre-existing warnings)
- `pnpm build`

The HTTP matrix verifies exact response status, robots and canonical values for all R1 route classes. The property fixture additionally verifies canonical `200`, wrong category/semantic `301`, direct location and absence of a redirect chain.

## Full RISKY runner limitation

`pnpm verify:merge-risky` was run twice. RP-06 checks and all suites before the failure pass. The remaining monolithic baseline is not locally green for reasons already present outside this epic:

- legacy verification scripts require documents deliberately absent from the current five-document project standard (`docs/PROJECT.md`, `docs/CONTRACT_FEASIBILITY.md`);
- release verification expects an unmaterialized historical starter compose artifact;
- client-readiness still contains owner decisions assigned to later release work;
- integration lead intake is unavailable under the incomplete client-readiness environment;
- SourceCraft policy guard reports the known current workflow-policy gap.

No legacy documents, fake production decisions or release artifacts were invented to make unrelated checks green. RP-06 delivery still requires the configured exact-head SourceCraft RISKY Gate plus `verify:schema`.

## Traceability

- Route grammar/profile input: `src/project/url-grammar.ts`, `src/project/site.profile.ts`.
- Deterministic decision layer: `src/project/public-route-resolver.ts`.
- Payload-owned `publicUrlId` reads: `src/core/data-access/public/payload-reads.ts`, `catalog.ts`, `provider.ts`.
- Shared render/metadata adapter: `src/core/routing/resolve-public-route.ts`, `src/app/(site)/public-route.tsx`.
- Network status normalization and retained API denial: `src/proxy.ts`, `next.config.ts`.
- Repeatable proof: `scripts/verify-route-resolver.ts`, `scripts/verify-route-http.mjs`.
- Verification checkpoint before delivery: `33e809a14adf9f6e94a8182f4d1e0c8b0d4ef40b`.

The delivery head will be recorded by the Task Manager ledger and SourceCraft PR/Gate. This file does not claim merge or production release.
