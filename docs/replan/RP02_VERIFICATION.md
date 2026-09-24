# RP-02 verification

Status: PASS for the RP-02 acceptance contract.

## Scope

RP-02 moves already merged portable SEO and catalog decision behavior into
`src/platform/**`, preserves the existing `src/core/seo/**` import surface as
compatibility adapters, and adds repository-native Platform/Project boundary
guards. Unmerged geo, taxonomy and `publicUrlId` work remains owned by RP-05 and
RP-06 and was not copied from the preserved EPIC-08 worktree.

## Acceptance evidence

| Criterion | Verdict | Evidence |
|---|---|---|
| Portable behavior is owned by Platform; project values remain inputs | PASS | Portable catalog, JSON-LD, metadata, property, redirect-path and site SEO logic lives in `src/platform/seo/**`. Project-specific values enter through typed arguments and data. |
| `guard:platform-no-project-literals` covers the required literals | PASS | The guard scans `src/platform/**` for `donetsk`, `Донецк`, `ДНР`, `ДОН СИТИ` and `doncity`; its self-tests reject both a forbidden literal and a forbidden Project import. |
| Platform does not import Project | PASS | Dependency Cruiser rule `platform-does-not-import-project` reports zero violations across 382 modules and 1,104 dependencies. |
| Public behavior is unchanged | PASS | Existing Core import paths remain adapters; `verify:seo-contracts` and seed verification pass with 40 SEO rows and 10 district rows. |
| No dedicated new linter was introduced | PASS | The rule is implemented by the existing repository architecture tooling and Node quality scripts. |
| Upstream candidates are recorded | PASS | `docs/UPSTREAM_CANDIDATES.md` lists portable modules and explicit exclusions. |

## Checks

| Check | Result |
|---|---|
| `pnpm quality:architecture` | PASS |
| `pnpm guard:platform-no-project-literals` | PASS |
| `pnpm verify:seo-contracts` | PASS |
| `pnpm verify:schema` against isolated native PostgreSQL 18.6 database `don_city_rp02_test` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS with 20 pre-existing warnings outside RP-02 |
| `git diff --check` | PASS |

The umbrella `quality:guards` command reaches the legacy SourceCraft-policy
guard after all RP-02, architecture, token and module-governance checks pass.
That legacy guard expects removed CI entry points and conflicts with the
approved manual exact-head workflow. It is tracked separately as RISKY
CI-policy task `dcn-4ic0`; RP-02 does not weaken or bypass its own guards.

## Boundaries

- No production, DNS, server or production database mutation was performed.
- No secrets or database URLs were written to Git or this evidence file.
- The isolated local verification database is retained for later task proofs.
- The dirty EPIC-08 worktree and branch were not modified.
