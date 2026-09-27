# DC11 DOC-00 preflight

Status: PREFLIGHT COMPLETE — implementation not claimed
Task: `dc11-task-100-preflight`
Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`
Plan source SHA-256: `d31ce7b41843cb51e4ef295ef91877e0bdecbc6ee6d25e00f604a0c05f7641b3`
Approved plan commit: `69abc811409ead0ec51d5dc5ca9dd2e0bfccf6fa`
Repository baseline: `origin/main@a9edd8ff59f50a888e20dd077cd415ba7817050b`
Observed: 2026-09-27

## Purpose and boundary

This artifact freezes the factual baseline and document ownership for
`DC10-DOC-00`. It does not claim that the active Source of Truth has already
converged, that runtime facts were changed, or that production is ready for a
new release.

No production, DNS, database, secret or irreversible operation is part of this
preflight. Secret values, full connection URLs and PII are excluded.

## Active document ownership

| Fact family | Canonical owner | Required convergence |
|---|---|---|
| product scope, users and launch exclusions | `docs/01_PRD.md` | describe the approved live product without treating pending implementation as current |
| public routes, indexing and canonical policy | `docs/02_PRODUCT_STRUCTURE.md` | reflect the v13 public-indexing target and preserve disabled future namespaces |
| platform, data, security and delivery boundaries | `docs/03_ARCHITECTURE.md` | point to v13 and enforce Payload-only ownership, one persistent production DB and disposable proof environments |
| current work and delivery order | `docs/04_BACKLOG.md` | identify the v13 program and its current execution state |
| release prerequisites and release-only evidence | `docs/05_RELEASE_CHECKLIST.md` | separate already observed live facts from the next release gate |
| project profile and readiness choices | `docs/PROJECT.md` | remove obsolete persistent-staging and global-noindex claims without inventing runtime evidence |
| runtime operations and recovery | `docs/OPERATIONS.md` | retain factual runtime/rollback evidence; align environment and post-release boundaries with v13 |
| machine-readable delivery state | `docs/DELIVERY_STATE.yaml` | move current program/task pointers from v9/CP-08 to v13 only when implementation records the exact Beads state |
| documentation map and current summary | `docs/README.md` | link the active v13 contract and summarize only facts owned by the documents above |
| visual policy | `docs/DESIGN.md` | remains the sole active design owner; no DOC-00 visual change is planned |

The normative platform and UI standards remain constraints, not owners of
project runtime facts. Files under `docs/research/`, `docs/replan/` and
`docs/archive/` remain evidence/history and must not become a second active
Source of Truth.

## Baseline drift matrix

| ID | Current exact evidence on `origin/main` | Approved v13 contract | Implementation owner |
|---|---|---|---|
| DOC00-01 | `docs/README.md`, `01_PRD.md`, `02_PRODUCT_STRUCTURE.md`, `PROJECT.md`, `OPERATIONS.md` and `05_RELEASE_CHECKLIST.md` state that production is globally `noindex`; `DELIVERY_STATE.yaml` records `indexing: noindex`. | v13 records the public site as `LIVE_PUBLIC`; homepage, robots and sitemap are already crawlable. This is evidence to reconcile, not authorization for another release. | PRD owns product state; Product Structure owns indexing policy; Operations/Delivery State own observed runtime identity. |
| DOC00-02 | `docs/03_ARCHITECTURE.md` points to the v8 program; `docs/README.md`, `04_BACKLOG.md` and `DELIVERY_STATE.yaml` present v9 / `AMS-DON-CITY-CORE55-POSTPROD` as current. | Current execution identity is `AMS-DON-CITY-LIVE-CONFORMANCE` v13 with 106 managed nodes in the one existing Beads store. | Architecture owns conformance pointer; Backlog and Delivery State own execution status; README only summarizes them. |
| DOC00-03 | `PROJECT.md`, `03_ARCHITECTURE.md` and `OPERATIONS.md` describe a persistent staging runtime with a separate database and storage identity. | Exactly one persistent production database is allowed. Non-production DB proof is disposable, isolated and removed after the bounded check; no staging/shadow/mirror DB is a second persistent truth. | Architecture owns topology; Operations owns the safe proof/runbook wording. |
| DOC00-04 | Current documents make external monitoring a prerequisite and still describe unfinished CP-08 delivery. | Operational readiness is pre-release work inside `DC10-OPS-00`; production is the final plan stage and no monitoring, observation or reconciliation task may follow it. | Backlog/Release Checklist own prerequisites; Operations owns factual alert/health behavior; no post-production stage is created. |
| DOC00-05 | Existing `quality:docs-sot` guards predate v13 and currently allow the contradictions above. | DOC-00 must extend and self-test the guard so the exact Plan ID/version, indexing state, persistent-DB rule and final-production boundary cannot drift silently. | `scripts/quality/docs-source-of-truth.mjs` and its self-test own mechanical enforcement. |

## Implementation contract

`TASK-100-IMPLEMENT` must:

1. Reconcile the active owners in the table above against the approved v13
   contract, without copying historical evidence into every document.
2. Update the active plan/inventory artifacts in the implementation stream only
   through the already approved exact v13 snapshot; it must not rebuild or
   re-import the Beads graph.
3. Extend `quality:docs-sot` with fail-first fixtures for at least:
   - stale v8/v9 current-plan pointers;
   - a global-production-noindex claim after the recorded live-public state;
   - a second persistent staging/shadow/mirror database;
   - work scheduled after `DC11-PROD-FINAL`.
4. Preserve truthful unknowns as explicit pending evidence instead of guessing
   deployed SHA, backup freshness, NAP, feed, delivery or legal facts.

## Verification evidence map

| Criterion | Required evidence at VERIFY |
|---|---|
| one owner per current fact | active-document ownership scan plus exact changed-file review |
| no stale current program | zero active references presenting v8/v9/CP-08 as the current program |
| indexing statements agree | PRD, Product Structure, Operations, Release Checklist and Delivery State express one factual state |
| one persistent DB | Architecture/Project/Operations agree; guard rejects persistent staging/shadow/mirror wording |
| production is last | plan/inventory proof shows no autonomous production task and no dependent work after production |
| guard is durable | `pnpm quality:docs-sot` passes, including new fail-first self-test fixtures |
| links resolve | every active Source-of-Truth path and normative baseline referenced by `docs/README.md` exists |

## Explicit unknowns and stops

- The exact currently deployed SHA/image must be observed through the release
  evidence path before an active document claims it; v13 preflight does not
  infer it from Git history.
- Backup freshness, NAP, owner account, real feed and lead-delivery readiness
  remain factual evidence questions owned by their later epics or release gate.
- Any requirement to mutate production, DNS, secrets or persistent data stops
  DOC-00 and routes to the applicable owner/release gate.
- This plan authorizes no post-production monitoring stage.

## Preflight checks

- Required active documents and both normative baseline files exist at the
  recorded repository baseline.
- The drift statements above are backed by exact active-file matches; no secret
  values, full database URLs or PII were read or recorded.
- DOC IMPACT: this new evidence file only. Active Source-of-Truth repair belongs
  to `TASK-100-IMPLEMENT`.
