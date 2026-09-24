# EPIC-04 — SEO Freeze Preflight

Date: 2026-09-24
Task: `dcn-task-04-preflight`
Status: `PASS — implementation contract is executable`

## Task contract

- Goal: materialize the approved R1 SEO and district registries from master-plan v6 into the only allowed seed CSV files and align the Product Structure with their ownership.
- Non-goals: new keyword research, invented frequency, R2 routes, live indexing, database import, Payload schema changes, DNS/server changes, production deployment or creation of a second SEO source of truth.
- Platform: AMS Realty Platform Core 3.0 + Payload Platform; profile `catalog`, mode `BUILD`, delivery profile `CRITICAL`.
- Data owner: the approved master-plan registry is the input contract; `docs/02_PRODUCT_STRUCTURE.md` owns final URL/index/canonical decisions; the two CSV files are deterministic seed artifacts consumed by later epics.
- Boundaries: documentation and seed artifacts only. No database, auth, PII, Secret Master or external-service write is required.
- Canonical origin: the owner confirmed `https://doncity-home.ru` as the single production origin. It already matches `src/project/site.config.ts`, Product Structure and master-plan metadata rules.
- Verification: schema/header validation, deterministic row counts and IDs, URL/domain invariants, tier/broad/source rules, duplicate/collision checks and explicit negative checks for `vtorichka` and `/yurist/[usluga]/`.
- Gate: `RISKY`, because these seeds become canonical inputs for future SEO/data loading even though this epic performs no runtime or database mutation.
- Done state: exact seed CSVs, Product Structure ownership, targeted verifier and evidence are committed/pushed; delivery follows the approved `MERGE_AFTER_GATE` policy. No production action.

## Approved inputs

- Master plan §§6–16A: SINGLE_GEO, URL resolver, Donetsk districts, tiers, thresholds, facet registry and Content Gate.
- Master plan §§24–31: exact static metadata, district/facet templates, Wordstat mapping, canonical/index/sitemap rules and the two allowed CSV schemas.
- Owner decision: `doncity-home.ru` is the final main domain for canonical URLs, metadata, sitemap, robots and JSON-LD.
- EPIC-03 evidence: the managed database is empty, so no legacy SEO rows or routes need reconciliation.

## Frozen R1 decisions

1. Home owns agency/realtor/brand intent; `/donetsk/` owns general-property intent.
2. R1 active categories are apartments, houses and land in `SINGLE_GEO` Donetsk.
3. District/facet URLs are candidates until their inventory threshold and Content Gate pass.
4. `vtorichka` is not a facet or route; secondary intent belongs to `/kvartiry/donetsk/`.
5. Legal scope has exactly `/yurist/`; `/yurist/[usluga]/` is absent in R1.
6. Empty/fallback `broad` values remain blank, never zero.
7. Textilshchik keeps `parentSlug` blank, preposition `на`, locative `Текстильщике`, apartment tier P1 and broad 137.
8. Canonicals are clean trailing-slash URLs under `https://doncity-home.ru`; seed URLs remain root-relative so environments cannot replace the production origin.

## Entry and stop conditions

- Parent EPIC-03 is closed and the Task Manager reconciliation is CLEAN 53/53.
- Worktree is clean, registered, based on canonical `main` SHA `1d25364282c1991c52487250333b6f0a49ec62ed`, and uses branch `codex/epic-04-seo-freeze`.
- Any new URL, R2 activation, altered frequency, live/DNS mutation or owner-dependent grammar publication decision must not be inferred inside this epic.
- Administrative-district grammar may be materialized from the approved Russian forms, but index activation remains protected by the later Content Gate and owner verification required by the master plan.

No blocker prevents deterministic seed materialization.
