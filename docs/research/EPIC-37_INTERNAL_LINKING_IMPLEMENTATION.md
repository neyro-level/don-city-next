# EPIC-37 — Internal linking implementation

Status: COMPLETE — no runtime delta required
Date: 2026-09-25
Task: `dcv4-task-37-implement`
Verified runtime base: `c77bafb31b26a41370271deaf3c512cee3bbedaa`

## Outcome

The approved EPIC-37 graph is already materialized by RP-09 and the completed
public-product epics. Reusing that implementation is the smallest safe change:
no duplicate link policy, alternate href builder or additional runtime branch
was introduced.

## Materialized graph

- Home → ALL hub and ACTIVE R1 categories through project navigation builders.
- ALL → ACTIVE categories through the Site Profile and canonical grammar.
- Category → gate-eligible district/facet context plus canonical property cards
  rendered from Public Gateway DTOs.
- Property → actual geo/category, eligible actual district and `/yurist/`.
- Owned room/facet intent resolves to a path owner; generated navigation emits
  no query-string equivalent.
- Candidate/below-gate, redirect, 404/410, nearby-district and R2 targets are
  absent from the generated graph.

## Regression checkpoint

- `pnpm verify:navigation` — PASS, 13 canonical targets crawled.
- `pnpm verify:navigation-shell` — PASS.
- `pnpm verify:property-detail-routes` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm quality:guards` — PASS.
- `pnpm typecheck` — PASS.

No production, DNS, server, database, secret or external indexing action was
performed.
