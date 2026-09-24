# EPIC-04 — verification

Date: 2026-09-24

Branch: `codex/epic-04-seo-freeze`

Implementation head: `0dca31e3b720ddbf11614a21b13d808f75042e7c`

## Result

`PASS` — the approved R1 SEO freeze is materialized in the only two allowed seed files. No database import, index activation, DNS, server, secret or production mutation was performed.

## Acceptance evidence

| Criterion | Verdict | Evidence |
|---|---|---|
| Exact seed schemas and inventory | PASS | `SEO_REGISTRY_SEED.csv`: 40 exact registry IDs; `DISTRICT_REGISTRY_SEED.csv`: nine administrative districts plus Textilshchik. The verifier checks exact headers, ID/slug sets and uniqueness. |
| R1 tier and threshold freeze | PASS | P1/P2 rows require positive Wordstat broad and five active objects; TEST rows require blank broad, `fallback_no_wordstat` and ten active objects. Every candidate requires Content Gate. |
| Fail-safe indexing | PASS | All 25 candidate rows are `noindex,follow` until runtime inventory and Content Gate pass; Product Structure keeps them outside sitemap before activation. |
| URL and intent invariants | PASS | HOME `/` and ALL `/donetsk/` are distinct; no `vtorichka` route exists; exactly one legal route `/yurist/` exists and child legal routes are rejected. |
| District grammar | PASS | Textilshchik is parentless, uses `на Текстильщике`, and carries P1 / 137 / `wordstat_v1`; all district locative forms are materialized. |
| Canonical domain | PASS | Public origin is `https://doncity-home.ru` in project configuration and Product Structure; CSV URLs remain root-relative so the origin has one owner. |

## Executed checks

- `pnpm verify:seo-contracts` — PASS.
- `pnpm lint` — PASS with 19 pre-existing warnings outside the EPIC-04 diff; no errors.
- `pnpm typecheck` — PASS.
- `git diff --check` — PASS.
- Changed-file secret-pattern scan — PASS, no matches.
- Task Manager reconciliation from the canonical control root — CLEAN, 53/53 epics, 255 tasks, source hash `091d0e2a8592bac4504b5b6f925487fc2bc8c192f288eab7243c00aecbc8a396`.

## Not executed

- Browser/live indexing checks: no runtime route behavior changes in this epic.
- Database seed import: belongs to the later schema/SEO-engine epic and requires its own data gate.
- DNS and production verification: not authorized in WORK mode.
