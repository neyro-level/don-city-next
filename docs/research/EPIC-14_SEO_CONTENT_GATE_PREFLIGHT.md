# EPIC-14 — SEO Engine / Content Gate / Seed Load: preflight

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`  
**Epic:** `EPIC-14`  
**Date:** `2026-09-24`  
**Mode:** implementation preparation; no production, database, DNS or secret write

## Source of Truth

- Master plan §§14, 16 and 16A define the only Content Gate: inventory threshold, materialized metadata, unique introduction, media/alt text, internal links and owner verification.
- `docs/seo/SEO_REGISTRY_SEED.csv` and `docs/seo/DISTRICT_REGISTRY_SEED.csv` are the seed inputs; their generated runtime projection is `src/project/seo-registry.generated.ts`.
- `src/project/site.profile.ts` owns the R1 `SINGLE_GEO` profile and fixed thresholds: P1/P2 `5`, TEST `10`.

## Entry conditions

- `EPIC-13` is delivered to canonical `main` at `d19d58887bd858f504493576c9094691376433d9`.
- RP-07 seed registry and URL grammar are present and form the compatible V4 baseline.
- No external prerequisite is needed to implement a deterministic, data-only gate. Payload seed application and production publication remain outside this task.

## Baseline findings

- Existing checks freeze 40 SEO rows, 10 district rows, materialized `title`/`description`/`h1`, tiers and seed thresholds.
- Navigation and sitemap currently interpret only the persisted `status`, robots and string `contentGateRequired` fields.
- This is insufficient as the executable definition of §16A: there is no typed decision that combines a registry row, actual inventory count and content-review evidence.

## Minimal EPIC-14 scope

1. Add one typed platform decision for Content Gate and derive effective robots/indexability from it.
2. Preserve seed rows as candidates until all required evidence and the fixed profile threshold pass.
3. Make registry route resolution, top links and sitemap consume the same decision.
4. Add focused checks for P1/P2/TEST thresholds and failed/passed content evidence, then retain an evidence document after verification.

## Boundaries

- No generic copy is generated or approved; the introduction remains explicit reviewed content.
- No registry row is promoted merely because code exists.
- No Payload migration, database seed write, production indexing request or IndexNow submission is performed.
