# DC10-R11-03 — Public surface verification

Status: PASS at implementation checkpoint `da72e607ff88d737c5031968a4b51f36170eaddf`.

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13, EPIC-105.

## Requirements matrix

| Requirement | Observed evidence | Verdict |
| --- | --- | --- |
| Public HTML exposes only allowlisted active routes through DTO/buildUrl. | Homepage CTA is required by `HomePageDTO` and populated with `projectUrls.primaryCatalog`; gone-property CTA receives the same value from the App Router boundary. | PASS |
| No `/nedvizhimost` in active public UI. | Repository scan finds no `/nedvizhimost` in `src` or `packages/ui`; the href guard traverses every TypeScript module reachable from the UI package public exports. | PASS |
| No inactive CTA/link. | Homepage verification rejects every `PREPARED_OFF` category in the CTA and service-link DTO values. Navigation verification exposes only the active profile categories. | PASS |
| No inactive sitemap/IndexNow URL. | Sitemap/IndexNow contract verification passes; both surfaces retain canonical grammar/profile validation. | PASS |
| Href guard passes. | `pnpm guard:no-literal-hrefs` and the full `pnpm quality:guards` suite pass. | PASS |

## Checks executed

- `pnpm guard:no-literal-hrefs` — PASS.
- `pnpm verify:home-page` — PASS.
- `pnpm verify:navigation` — PASS, 14 canonical targets.
- `pnpm verify:sitemap-indexnow` — PASS.
- `pnpm verify:ui-public-surface` — PASS.
- `pnpm contracts:test` — PASS.
- `pnpm typecheck` — PASS.
- Targeted Biome lint and `git diff --check` — PASS.
- `pnpm quality:guards` — PASS.

## Scope and risk review

- Runtime change is limited to URL ownership at existing public CTA boundaries.
- The guard change follows actual package exports and their relative TypeScript imports; dormant, unexported future views are not misclassified as current public HTML.
- No schema, migration, auth, PII, secret, dependency, CI, deploy, DNS or production state changed.
- Final risk classification remains `STANDARD`; the SourceCraft exact-head Merge Gate is intentionally deferred to delivery.
