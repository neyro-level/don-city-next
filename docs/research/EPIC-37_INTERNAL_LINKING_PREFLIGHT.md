# EPIC-37 — Internal linking preflight

Status: READY — reuse verified RP-09 runtime
Date: 2026-09-25
Task: `dcv4-task-37-preflight`
Base: `origin/main@c77bafb31b26a41370271deaf3c512cee3bbedaa`
Branch: `codex/epic-37-internal-linking`

## Canonical contract

- Home links to the ALL hub and active R1 categories.
- ALL links to active categories; category pages expose eligible district/facet
  owners and server-rendered canonical property cards.
- Property pages link to the object's actual geo, category, eligible district
  and `/yurist/`.
- A query equivalent is never linked when an approved path owner exists.
- Candidate/below-gate pages, redirects, 404/410 owners, nearby district pages
  and every R2 route remain absent.

## Current-state evidence

- RP-09 is merged and owns navigation/linking in `src/project/navigation.ts`
  through Site Profile, typed URL grammar and SEO registry inputs.
- `buildR1Navigation()`, `buildHomeCatalogLinks()`, `buildCatalogLinks()` and
  `buildPropertyNavigation()` cover the approved R1 graph without literal
  catalog hrefs.
- `resolveProjectPublicRoute()` supplies canonical breadcrumbs/context links;
  catalog views render property DTO links from the Public Gateway.
- `scripts/verify-navigation.ts` performs a fixture crawl and rejects query
  strings, redirects, non-200 targets and canonical mismatches.
- Later merged catalog/property/legal epics retained these contracts; no
  conflicting link owner or product-code gap was found.

## Execution boundary

1. Reuse the RP-09 runtime implementation; do not duplicate navigation policy.
2. Replay navigation, route, property, shell, grammar, gateway and guard proof
   against current `main`.
3. Record a no-runtime-delta implementation checkpoint if all acceptance
   surfaces remain green; any failure becomes a scoped blocker before delivery.

## Dependency and risk assessment

- All fourteen parent epics are closed, including RP-12 and the public product
  pages consumed by this graph.
- Graphify confirms the shared impact surface is the project navigation module,
  public route resolver, public route renderer and their focused verifiers.
- Expected delivery risk is `STANDARD`; no schema, auth, PII, dependency,
  production or external write is required.

## Stop conditions

- A generated link resolves to redirect, 404/410 or an unowned query URL.
- A candidate Content Gate or R2 route would need activation.
- Production, DNS, server, database, secret or external indexing mutation.
