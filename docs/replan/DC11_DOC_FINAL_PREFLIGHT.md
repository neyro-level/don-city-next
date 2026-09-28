# DC11-DOC-FINAL — Exact-head documentation audit preflight

Status: `IMPLEMENTATION_REQUIRED`

Baseline candidate: `9e166460de1939191671787074209fe9f6a504d3`

Observed at: 2026-09-28 (Europe/Moscow)

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`

## Task contract

- Outcome: converge every active Source of Truth, project registry and runtime
  readiness statement before the mandatory final production gate.
- Delivery: `CRITICAL`, `STANDARD`, `MERGE_AFTER_GATE`.
- Boundary: documentation, registries and deterministic guards only. No
  production, DNS, database, Secret Master or server mutation is authorized.
- Exact identity: this baseline is the input to the audit, not the final
  release candidate. The delivery ledger and SourceCraft gate will bind the
  final exact PR head; production requires a later explicit owner command.

## Baseline convergence matrix

| Contract | Runtime / registry evidence | Active document owner | Baseline verdict |
|---|---|---|---|
| project / delivery profile | `REALTY_BASE`, `catalog / BUILD`, `CRITICAL` | `PROJECT.md`, `03_ARCHITECTURE.md` | PASS |
| persistent topology | one runtime, one logical DB, one S3 bucket; staging absent | `PROJECT.md`, `03_ARCHITECTURE.md`, `OPERATIONS.md` | PASS |
| jobs / backup health | one production jobs owner; timer active; health `ok`, zero alerts | `OPERATIONS.md`, `DELIVERY_STATE.yaml`, checklist | PASS except backlog drift |
| agglomeration routes | `makeevka` allowlist contains only hub, apartments, houses and land | Product Structure + Site Profile | PASS |
| inactive agglomeration surfaces | commercial, district, facet and alternate locality routes unreachable | Product Structure + resolver/registry guards | PASS |
| legal / NAP | terms/PDF absent; NAP remains external-verification pending | PRD, Product Structure, Architecture | PASS |
| production boundary | final production is mandatory, last and separately authorized; no later task | backlog, checklist, approved plan | PASS |
| execution pointer | Task Manager has reached `DC11-DOC-FINAL` | `DELIVERY_STATE.yaml` | P1 CONTRADICTION |

## Findings to resolve

### DOC-FINAL-F01 — P1 — stale backup blocker

`docs/04_BACKLOG.md` still says authenticated health is degraded because durable
DB/media backup signals are absent. Owner-authorized DC10-OPS-00 proof and the
active Operations/Delivery State now establish current backup freshness,
sampled restore, health `ok` and zero alerts.

Resolution acceptance: remove the stale blocker while preserving unrelated
open gates such as owner bootstrap, independent delivery channel, NAP and exact
deployed identity.

### DOC-FINAL-F02 — P1 — stale execution pointer

The top-level `docs/DELIVERY_STATE.yaml` still points to
`dc11-task-101-implement` and says EPIC-101 verification/delivery remain, even
though PR 102, RISKY run 114 and merge `9e16646` closed the epic.

Resolution acceptance: make `DC11-DOC-FINAL` the current pre-production stage,
record EPIC-101 delivery evidence and keep `production.authorized=false`.

### DOC-FINAL-F03 — P1 — stale robots guard

`verify:seo-contracts` still expects the obsolete metadata `host` field even
though delivered EPIC-107 intentionally removed the unsupported `Host`
directive from both robots representations. Runtime, active Product Structure
and HTTP-policy evidence agree with the implementation; the test is stale.

Resolution acceptance: align the deterministic SEO guard with the delivered
no-`Host` policy and retain sitemap, Clean-param, allow/disallow and indexing
assertions.

### DOC-FINAL-F04 — P1 — frozen contract lock drift

Delivered EPIC-105 made `HomePageDTO.primaryAction` required so the homepage
cannot omit its canonical primary conversion, but `contracts.lock.json` still
hashes the older optional-only surface at version `1.5.0`.

Resolution acceptance: preserve the delivered required field, record the
breaking type-contract decision in an accepted ADR, bump the base contract to
`2.0.0` and regenerate the frozen lock under the already owner-approved v13
plan. Journal scope remains unchanged.

## Historical staging evidence

Historical `epic_45`, `epic_47`, `cp_08` and the old staging URL/image are
immutable release-rehearsal evidence. They remain under named historical
sections and must not be rewritten as current runtime. Active topology must
continue to state that staging runtime, database, bucket and Secret Master path
are absent.

## Required implementation and verification

1. Reconcile active Backlog and Delivery State; review PRD, Product Structure,
   Architecture, Project, Operations, Design, checklist and README for the same
   facts.
2. Align the stale robots assertion and frozen base-contract lock with their
   already delivered implementation decisions.
3. Add an exact active-doc/runtime/registry matrix guard that distinguishes
   current state from historical evidence.
4. Run documentation Source of Truth, links/release-state equivalents,
   contracts, SEO registry, Site Profile, staging-retirement and type/lint
   checks.
5. Record zero open P0/P1 contradictions at the exact pushed head, then create
   one PR and one exact-head STANDARD gate.

No production release or post-production monitoring task is part of this epic.
