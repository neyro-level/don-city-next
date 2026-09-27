# DC11 UI-01 Preflight — public UI package surface

Status: `PREFLIGHT COMPLETE`

Task: `dc11-task-114-preflight`

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 (`APPROVED`)

Epic: `DC10-UI-01` / `EPIC-114`

Baseline: `origin/main@2b520e18843739490b8fecdfee2c462fbf416335`

## 1. Purpose and boundary

This preflight inventories the actual application imports and the published
`@ams/realtbase-ui` package surface before removing or isolating inactive
speculative exports. It does not redesign UI, remove active components, change
routes/data, deploy, mutate secrets or touch production.

UX scope is `PUBLIC_COMMERCIAL`. The existing Project Design System, semantic
tokens, primitives and canonical `public/*` views are reused. This epic changes
package reachability only; visual output, responsive behavior and page
composition must remain unchanged.

## 2. Factual baseline

`packages/ui/package.json` publishes 19 entrypoints.

### Runtime-owned entrypoints (10)

- `./analytics`
- `./primitives`
- `./public/catalog-page`
- `./public/gone-property-page`
- `./public/home-page`
- `./public/legal-document-page`
- `./public/marketing-page`
- `./public/property-page`
- `./public/site-shell`
- `./styles.css`

Application imports under `src/app` use only those entrypoints. The 404 route
uses three primitives; public routes use the seven `public/*` entrypoints;
analytics and the stylesheet use their named subpaths.

### Inactive broad/compatibility entrypoints (9)

- package root `.`;
- broad `./views` barrel;
- seven `./starter/*` aliases for catalog, gone property, home, legal document,
  marketing, property and site shell.

No runtime application module imports these nine entrypoints. Only
`scripts/quality/workspace-consumption.type-test.ts` deliberately imports the
root and `./views`; `quality:ui-core` currently preserves the old 19-entrypoint
list. The public app already has a guard rejecting `./starter/*` imports.

The root and `./views` barrels expose internal/future modules including
new-build, mortgage, articles, legal hub and alternate corporate/property
compositions. Graph navigation found no affected runtime nodes for representative
`HomeNewBuildingsView`, `MortgageCalculatorView` and `LegalHubView` exports.
These source files may remain project-internal for later approved epics, but
they must not be reachable through the package public surface now.

## 3. Tooling limitation

The repository has no Knip dependency, config or `quality:dead-code` command.
Per the cleanup protocol no tooling dependency is installed inside this feature.
Evidence therefore comes from package export inventory, repository import scan,
Graphify reachability and existing architecture/UI guards.

## 4. Fail-first cases

| ID | Current behavior | Required target proof |
|---|---|---|
| `UI01-01` | Root `.` re-exports analytics, view models, adapters, formatters, primitives and every view. | Root entrypoint is absent from package exports and no application import depends on it. |
| `UI01-02` | `./views` exposes the complete internal view tree, including future modules. | Broad views entrypoint and barrel are absent; future representative exports are unreachable. |
| `UI01-03` | Seven `./starter/*` compatibility aliases duplicate canonical `./public/*` routes. | Starter entries are absent; only canonical public entrypoints remain. |
| `UI01-04` | Workspace type-test artificially keeps root/views public. | Type-test imports canonical public/primitives/analytics entrypoints instead. |
| `UI01-05` | `quality:ui-core` asserts the obsolete 19-key surface. | Guard asserts the exact 10-key allowlist and rejects root/views/starter resurrection. |
| `UI01-06` | Active pages may regress if a removed alias was hidden outside static imports. | Typecheck, UI guards, route/page verification and production build pass on the exact head. |

## 5. Implementation contract

IMPLEMENT will remove the nine inactive entries from `packages/ui/package.json`,
delete the now-unreachable root/views barrel files, migrate the workspace
consumption proof to canonical entrypoints and add a deterministic package
surface verifier. Internal future component files are not deleted speculatively;
they become unreachable outside their owning package until a later approved
epic explicitly imports them.

No primitive API, token, CSS, DTO, route or page composition is changed. Any
discovered runtime consumer of the nine entries stops the removal and must be
classified before proceeding.

## 6. Verification matrix

| Final criterion | Exact-head evidence |
|---|---|
| Speculative exports removed or isolated | Package exports equal the exact 10-entrypoint allowlist; root/views/starter paths cannot resolve through package exports. |
| Active route build unaffected | Typecheck, UI Core/architecture guards, representative page/route tests and one production build pass. |
| Future modules unreachable | Guard proves no broad barrel or starter alias exists and no app import bypasses canonical public subpaths. |
| Design/runtime unchanged | Git diff contains package-surface, guard/type-test and documentation evidence only; no tokens/CSS/JSX/DTO/routes. |

## 7. DOC IMPACT

- Owner: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-114`.
- Reviewed: Product Structure, Architecture, Design System, Design and current
  package/runtime import owners.
- Changed in PREFLIGHT: this evidence artifact and current delivery pointer.
- Planned transition: broad speculative public package surface -> exact
  canonical runtime allowlist, with internal future modules unreachable.
