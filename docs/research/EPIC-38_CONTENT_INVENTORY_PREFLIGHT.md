# EPIC-38 — Content / Inventory Activation: preflight

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

**Epic:** `EPIC-38`

**Date:** `2026-09-25`
**Mode:** implementation preparation; no production, database, DNS or secret write

## Source of Truth

- Master plan §§14, 16 and 16A own the activation contract: P1/P2 require at least 5 active objects, TEST requires at least 10, and every page must also pass the single Content Gate.
- `docs/seo/SEO_REGISTRY_SEED.csv` owns the exact page identity and materialized metadata. P1 is processed before P2 only in the content-production queue; their inventory threshold is identical.
- `src/platform/seo/content-gate.ts` is the existing fail-closed decision. `src/project/site.profile.ts` owns the fixed thresholds.

## Entry conditions and dependency evidence

- The APPROVED graph is CLEAN and the EPIC-38 parent dependencies are delivered on canonical `main` at base `5cb30d5fcfba605430d2d8701d155fbd5d15dda4`.
- EPIC-14 supplies the typed gate; EPIC-22/23/25/26 supply the approved district and facet registry rows; EPIC-36 supplies logical sitemap ownership; EPIC-37 supplies the internal-link graph.
- All district and facet rows remain `candidate`, `noindex,follow` and absent from sitemap without complete gate evidence.

## Baseline finding

The gate currently evaluates only evidence supplied by a caller. The production route resolver does not supply a Payload-backed evidence loader, and logical sitemap/internal-link construction has no runtime evidence. Therefore no candidate can be activated from real catalog/content data. Test fixtures can demonstrate a passing decision, but they are not production evidence.

## Minimal implementation scope

1. Add project-owned Payload content records keyed by the stable SEO `registryId`, with unique introduction and verified context facts. Do not generate or seed generic 600-character copy.
2. Compute `activeObjects` read-only from the public catalog predicate for the registry row and combine it with persisted content evidence.
3. Feed the same evidence into route robots/canonical, rendered server HTML, internal links and logical sitemap eligibility.
4. Expose a deterministic content queue ordered P1, then P2, then TEST without changing the P1/P2 threshold.
5. Keep missing, incomplete or unavailable evidence fail-closed (`200 noindex,follow`, no sitemap, no promoted internal link).

## Safe fallback and stop conditions

- There is no approved real inventory or unique listing copy in this checkout. EPIC-38 will implement the activation mechanism but will not fabricate content, import objects, mutate a database or promote a registry row by hand.
- Actual page activation remains blocked per page until an owner/editor enters page-specific content and real published inventory reaches the fixed threshold. This is a data prerequisite, not a blocker for implementing the fail-closed mechanism.
- Production, feed onboarding, database migration application, IndexNow submission and owner override are outside this task. Any later manual override must be owner-only and auditable under a separate approved scope.
