# DC10-UI-06 — Token and dead UI audit preflight

Status: PREFLIGHT COMPLETE

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13

Base: `125483309c622fd751bae6c19cf643ca698213d1`

Branch: `codex/dc11-119-token-dead-ui-audit`

## Mechanical baseline

- `quality:design-tokens` passes with 587 definitions, 103 UI source files and
  one token source.
- `verify:drift` passes; no second token file or duplicate control selector is
  active.
- `tokens:report` reports zero lexical dead tokens because it treats every UI
  source file as reachable.
- The repository has no configured `quality:dead-code`/Knip command. Knip was
  therefore not installed or used as an undeclared cleanup dependency.
- Source import inventory and Graphify show no incoming runtime, package export,
  script or test dependency for either `MortgageCalculatorView` or
  `AboutCompanyDirectorView`; the same external import scan is empty for the
  entire `packages/ui/src/views/corporate/` directory.
- The public-surface guard mentions `MortgageCalculatorView` only as an expected
  unreachable future module. This assertion now preserves dead code rather than
  an active product contract.

## Findings

| Severity | Location | Finding | Evidence | Action |
| --- | --- | --- | --- | --- |
| P1 | `packages/ui/src/views/corporate/` | Fourteen unexported, unreachable historical page sections form a parallel inactive composition surface after UI-01…05. | zero external imports; Graphify affected returns no consumers | remove the directory and change the public-surface guard to require absence |
| P2 | `globals.css` | Twenty-four component-prefixed tokens are kept alive only by the unreachable corporate files. | exact prefix inventory for `about-company`, `corporate-form-section-views`, `mortgage-programs` and `sale-*` | remove only these exact definitions after source deletion |
| P2 | `view-models/content.ts` | Two corporate-only DTO aliases have no consumers outside the dead directory. | repository reference inventory | remove the two aliases |

No P0 finding exists. The remaining token source, primitives, canonical shell,
marketing composition, client boundaries, accessibility and SEO contracts have
green project guards.

## Remediation boundary

The approved epic authorizes the three mechanical actions above. Catalog,
property, home, legal and shared views remain out of scope even where future
work may exist. No token is removed solely because of naming or preference.

## Proof plan

1. Add a dead-UI guard for the absent corporate tree, absent legacy assertion,
   absent corporate DTO aliases and absent exact token prefixes.
2. Delete the fourteen unreachable files, two DTO aliases and twenty-four exact
   token definitions.
3. Run token report, design-token guard, UI Core, drift, architecture, typecheck,
   lint and build.

Production, Payload, routes, DTOs crossing the public gateway, lead behavior,
DNS, database and secrets are unchanged.
