# EPIC-21 — APARTMENT GEO CATALOG VERIFICATION

Verification was performed on `codex/epic-21-apartment-geo` after adding the
focused apartment-route invariant.

| Acceptance surface | Evidence | Result |
| --- | --- | --- |
| `/kvartiry/` bridge | Exact `APT_ROOT` metadata, self-canonical path and `noindex,follow` are asserted. | PASS |
| `/donetsk/kvartiry/` catalog | Exact `APT_GEO` metadata, self-canonical path and `index,follow` are asserted. | PASS |
| Catalog ownership | Root query has no geo; city query owns `apartment + donetsk` without district or rooms. | PASS |
| Navigation | R1 `Квартиры` points to `/donetsk/kvartiry/`. | PASS |
| Secondary-market intent | `vtorichka` is absent from facet whitelist and SEO registry; the route returns 404. | PASS |
| Route compatibility | `verify:route-resolver` retains the approved public route matrix. | PASS |
| Types and boundaries | `pnpm typecheck` and `pnpm quality:architecture` pass. | PASS |

Implementation checkpoint: `afdf16bf89a6683bb95850ff0a3a93b9166eb6bd`.
No runtime deployment, schema, auth, gateway, dependency, secret or production
change was performed.

## Traceability checkpoint

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7, `EPIC-21`.
- Integration base: `72857c33c80373735e794a76ace08558456e545a`.
- Preflight checkpoint: `69b314cc393dffab06e06ef70738d0681055fb1a`.
- Implementation checkpoint: `afdf16bf89a6683bb95850ff0a3a93b9166eb6bd`.
- Verification checkpoint: `de7027a219d74eb97ae51b3860e90079f3e2c599`.
- Changed product-proof surface: `package.json`,
  `scripts/verify-apartment-geo-page.ts`.
- Deviations: reusable route runtime already satisfied the contract; the epic
  adds regression proof instead of duplicating a page template.
- Discovered work: none.
