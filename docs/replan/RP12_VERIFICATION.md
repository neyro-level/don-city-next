# RP-12 verification

Verified checkpoint: `13162d3027e5b91ac9f3899a3ebd1b4cfed1bc8d`.

## Acceptance matrix

| Contract | Donetsk-only | Multi-geo |
|---|---|---|
| Donetsk apartments | `200`, indexable, menu + sitemap | `200`, indexable, menu + sitemap |
| Makeevka apartments | `200`, noindex-auto, absent from menu + sitemap | `200`, indexable, menu + sitemap |
| Geo switcher | hidden | visible |
| Profile switch mutates `src/**` | no | no |
| Sitemap XML parses | pass | pass |

## Local proof

- `pnpm verify:two-profile` — PASS.
- `pnpm verify:site-profile` — PASS.
- `pnpm verify:url-grammar` — PASS (22 round trips).
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:sitemap-indexnow` — PASS.
- `pnpm verify:seo-registry` — PASS (40 registry rows, 50 Wordstat owners).
- `pnpm verify:navigation` — PASS (13 canonical targets).
- `pnpm verify:gateway-context` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with 20 pre-existing warnings.
- `pnpm quality:architecture` — PASS (426 modules, 1277 dependencies).
- `pnpm build` — PASS; the Google font endpoint timed out once, webpack retried
  and completed the production build with warnings.

## Risk gate

The root `verify` chain now includes `verify:two-profile`; `merge-risky` invokes
that chain. The final exact-head remote RISKY Gate remains a delivery-stage
requirement and is not claimed by this local evidence.
