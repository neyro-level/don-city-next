# DC10-UI-04 — Marketing semantic hierarchy preflight

Status: PREFLIGHT COMPLETE

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13

Base: `0e0bae6d216959c76a5197280e426f5d89eabf01`

Branch: `codex/dc11-117-marketing-semantic-hierarchy`

## Factual baseline

- `MarketingPageView` owns the shared public composition used by the static
  marketing routes.
- The hero already renders exactly one intrinsic `h1` from `page.title`.
- Section titles use the project-owned `CardTitle` primitive.
- `CardTitle` currently renders an intrinsic `h3` unconditionally. Therefore
  pages with sections have the primary sequence `h1 -> h3` and skip `h2`.
- Graph reachability identifies the shared view as an import dependency of ten
  public routes. The representative acceptance set for this epic is Sell,
  Lawyer, About and Contacts.
- The next epic, DC10-UI-05, owns page-specific composition. This epic changes
  only the shared semantic hierarchy and must not pre-empt that work.

## Convergence contract

| Requirement | Implementation owner | Durable proof |
| --- | --- | --- |
| Exactly one page H1 | `StarterMarketingPageView.tsx` | TypeScript-AST guard counts one intrinsic `h1` |
| No skipped primary level | `CardTitle` variant + marketing view | section titles explicitly select intrinsic `h2`; guard rejects `h3` in the shared composition |
| Representative routes use the shared contract | four App Router entries | verifier checks Sell/Lawyer/About/Contacts route ownership |
| Existing card consumers remain stable | project-owned `CardTitle` | default stays `h3`; only an explicit semantic variant changes output |

## Planned change

1. Add a backwards-compatible `h2 | h3` semantic variant to `CardTitle`, with
   `h3` retained as the default.
2. Select `h2` for marketing section titles.
3. Add a deterministic TypeScript-AST/source contract and include it in the UI
   Core suite.
4. Run focused semantics, accessibility, type, lint and active-route build
   checks before delivery.

## Boundaries and risks

- No Payload schema, DTO, data gateway, auth, lead flow or route grammar change.
- No visual token or layout change is intended.
- No production, DNS, database or secret mutation is allowed in this epic.
- Risk is STANDARD: the primitive change is additive and the existing default
  remains unchanged.

## Document impact

`docs/DESIGN.md` will record the explicit heading-level variant after the code
contract exists. No PRD, product structure or architecture change is required.
