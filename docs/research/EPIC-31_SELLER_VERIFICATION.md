# EPIC-31 verification — seller page

Status: PASS
Date: 2026-09-24
Implementation head: `51bfbdda738554bfe6dbd6ac2a087ed11c1a2493`

| Requirement | Evidence | Verdict |
| --- | --- | --- |
| Exact SELL metadata | The canonical registry row is passed unchanged into `buildStaticMarketingPage`; the focused fixture asserts title and canonical `/prodat-nedvizhimost/`. | PASS |
| One H1 and meaningful page | The existing `MarketingPageView` remains the single page renderer. The seller composition supplies three factual process blocks and does not duplicate a route/view layer. | PASS |
| Seller lead flow | The page supplies `formKind="sell"`, its canonical source page and the existing consent context. The shared client adapter maps `sell` to the established intake type without changing the PII schema. | PASS |
| SEO safety | `verify:seo-contracts`, seed and registry checks retain the SELL row as indexable with the approved canonical URL. | PASS |

## Checks

- `pnpm verify:seller-page` — PASS.
- `pnpm verify:seo-contracts` — PASS.
- `pnpm typecheck` — PASS.
- Scoped Biome lint — PASS.
- `git diff --check` — PASS.

No browser/runtime smoke was run: the public Payload runtime requires a
separately configured non-production database. No attempt was made to use
production credentials or send a real lead.
