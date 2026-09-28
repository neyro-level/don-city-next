# DC11-DOC-FINAL — implementation evidence

Date: 2026-09-28  
Baseline `main`: `9e166460de1939191671787074209fe9f6a504d3`  
Task: `dc11-task-120-implement`  
Production release: not authorized and not executed

## Result

The active documentation and executable contracts now describe the same
pre-release candidate. Production remains the mandatory final stage, has no
autonomous child task and requires a separate explicit owner command.

## Reconciled findings

| Finding | Resolution |
|---|---|
| Backlog still described backup/health as open and degraded | Replaced with the delivered single-runtime, automatic-backup and authenticated-health evidence from DC10-OPS-00. |
| Delivery pointer still targeted staging retirement | Advanced the active pointer to DC11-DOC-FINAL and recorded PR 102, gate 114 and the merged `main` identity. |
| Robots verification expected the retired metadata `host` field | Aligned the assertion with the intentionally delivered EPIC-107 robots contract. |
| Frozen contract lock remained at `1.5.0` after required `HomePageDTO.primaryAction` | Recorded ADR-0012 and promoted the breaking base contract to `2.0.0`; journal contract remains unchanged. |
| Design document still said production was globally `noindex` | Replaced it with public indexing controlled by page-level registry/content gates. |
| Documentation map still described the delivered R11 diagnostic as future work | Marked the redacted production matrix as delivered evidence. |

## Exact approved locality surface

Макеевка uses canonical slug `makeevka`. The only approved route types are
`hub`, `kvartiry`, `doma` and `uchastki`. Commercial, district, facet and
alternate-slug routes remain excluded and fail closed.

## Durable guard

`pnpm verify:final-documentation` checks active document convergence, the
single production topology, staging absence, the exact Макеевка allowlist,
contract `2.0.0`, and the terminal production-epic invariant. The final proof
is recorded separately against the implementation commit.
