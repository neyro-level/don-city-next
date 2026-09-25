# EPIC-36 — Sitemaps / Robots verification

Status: PASS
Date: 2026-09-25
Task: `dcv4-task-36-verify`
Verified implementation: `973687b388de77cb2f7a32f1d9c883db89f33c5a`

## Acceptance matrix

| Criterion | Result | Evidence |
| --- | --- | --- |
| Logical R1 maps exist | PASS | Stable owners are `static`, `geo`, `catalog`, `districts`, `facets`, `kvartiry`, `doma`, `uchastki`; Next build generated `/sitemap/0.xml` plus seven additional paths. |
| Registry URLs have exactly one logical owner | PASS | `epic36-logical-sitemaps.snapshot.json` and uniqueness assertion partition every currently eligible registry URL. |
| Only canonical grammar-owned URLs enter maps | PASS | Every registry entry round-trips through `parseProjectUrl` / `buildProjectUrl`; property paths use `buildPropertyUrl`. |
| Only published property URLs enter category maps | PASS | Public Gateway count/list queries retain the publication policy and add an R1 category predicate. |
| Content Gate is fail-closed | PASS | Candidate rows are excluded even with accidental evidence; an active district enters only `districts` when complete passing evidence is supplied. |
| No R2 maps | PASS | Owner snapshot and explicit negative assertion exclude newbuild, mortgage and commercial owners; property reads retain the R1 publication clauses. |
| No nearby/category-root/noindex leak | PASS | RP-11 negative assertions remain green; legal noindex entries and global category roots have no logical map owner. |
| Meaningful `lastmod` retained | PASS | Registry revision plus latest owned object timestamp remains in registry maps; property maps use each published object's `updatedAt`. |
| Robots advertises logical maps only when public | PASS | Public fixture returns all eight generated sitemap URLs; noindex fixture still returns global `Disallow: /`. |
| Runtime compatibility | PASS | Installed Next.js `16.3.5` production build generated all eight sitemap endpoints and `/robots.txt`. |

## Executed proof

- `pnpm typecheck` — PASS.
- `pnpm verify:sitemap-indexnow` — PASS.
- `pnpm verify:seo-contracts` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm quality:guards` — PASS.
- `pnpm quality:architecture` — PASS, 476 modules / 1491 dependencies, no violations.
- `pnpm build` — PASS; Next.js emitted `/sitemap/0.xml`, `/sitemap/1.xml`,
  `/sitemap/2.xml` and five more generated sitemap paths.
- `git diff --check` — PASS.

## Boundaries

No page was activated, no production indexing policy changed and no live
IndexNow/Webmaster, DNS, server, database or secret mutation was performed.
Empty district/facet maps remain intentional until EPIC-38 supplies approved
active registry rows and complete Content Gate evidence.
