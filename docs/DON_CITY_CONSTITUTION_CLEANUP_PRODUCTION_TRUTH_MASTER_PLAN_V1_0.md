# DON CITY — Constitution Cleanup & Production Truth Master Plan

Plan ID: DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH  
Version: v1  
Status: APPROVED  
Approved by: owner  
Approved at: 2026-09-29T10:55:14+03:00  
Delivery profile: CRITICAL  
Repository mode: SOURCECRAFT_PRIMARY_GITHUB_MIRROR

## 0. Owner intent and authority

The owner approved this exact plan in the current session and instructed the
agent to finish the omitted constitution work, merge it through a RISKY gate,
then establish production truth. If production does not equal the final exact
`main`, the same instruction authorizes one project-canonical production
release followed by bounded live proof. It does not authorize destructive data
changes, DNS changes, a second server, feed activation or secret rotation.

## 1. Shared invariants

- Payload remains the only schema, auth and migration owner; Prisma is forbidden.
- Public data continues through Public Gateway, explicit select and DTO.
- One independent epic stream uses one branch, one worktree and one SourceCraft PR.
- SourceCraft is canonical; GitHub remains a public mirror.
- No production build occurs on the host; release uses one immutable artifact.
- Secret values, PII, private keys and full database URLs never enter evidence.
- `SKIPPED` and an unobserved surface are not `PASS`.

# EPIC-R1 — Constitution Cleanup

Risk: RISKY  
Delivery: MERGE_AFTER_GATE  
Production: forbidden inside this epic

Goal: remove the six remaining constitution drifts without redesigning the UI,
changing product scope or introducing a second platform/data owner.

## TASK-R1.1 — Typography role contract

- Expose only the UI Core roles `h1/h2/h3/h4/body-lg/body/body-sm/label/caption`.
- Replace the project-only `process-step` typography role with an approved base
  role plus independent weight/tracking/line-height properties.
- Keep HTML semantics independent from visual typography roles.
- Add a negative guard proving an unapproved role fails.

Acceptance: no `text-process-step` role or private numeric typography bypass
remains; representative UI and UI Core verification pass.

## TASK-R1.2 — Radius normalization

- Keep the installed shadcn radius mapping and only proved semantic card/large
  roles; remove value aliases that merely rename numeric radii.
- Controls consume the actual shadcn mapping, not a parallel `control-radius`.
- Replace component usage without changing the intended visual hierarchy.
- Add a negative guard for unapproved radius aliases and literal bypasses.

Acceptance: the token source contains one compact radius contract, primitives
and views consume it, and the compile/design-token fixtures pass.

## TASK-R1.3 — UI guards

- Make typography and radius allowlists explicit and source-derived.
- Guard consumers against private numeric typography/radius tokens.
- Preserve the single primitive owners and existing light-only policy.
- Cover both positive canonical fixtures and negative drift fixtures.

Acceptance: `verify:ui-core`, `quality:design-tokens`, drift, accessibility and
representative production build checks pass without baseline suppression.

## TASK-R1.4 — 304 bookkeeping

- Prove the conditional-feed `304/unchanged` path performs no inventory mutation.
- Keep its bounded run/source bookkeeping atomic and terminal exactly once.
- Preserve retry/schedule and baseline identity without opening a mutating
  transaction for an unchanged body.
- Add regression proof for duplicate terminal transition and accidental writes.

Acceptance: focused feed lifecycle/ingest/integration tests prove zero property
writes and one coherent successful unchanged-run state.

## TASK-R1.5 — Retention typing

- Align accepted lead, repository and cleanup types with the already-enforced
  mandatory `retentionUntil` data contract.
- Invalid/missing retention configuration must fail before lead persistence;
  cleanup must not silently model a current lead as permanently skippable.
- Do not rewrite the applied migration or perform production DDL.

Acceptance: typecheck, lead intake/outbox/retention tests and existing migration
fixtures prove mandatory retention while legacy migration evidence stays intact.

## TASK-R1.6 — Clean-param hygiene

- Derive the robots `Clean-param` list from the actual public query grammar.
- Add `sort` only if it is an accepted non-semantic public query parameter.
- Keep one root-scoped directive, stable ordering and no speculative parameters.
- Prove robots output and route/query behavior together.

Acceptance: focused indexing/SEO checks assert the exact directive and no
indexable URL semantics are erased.

## TASK-R1.7 — Historical loose-file hygiene and focused proof

- Preserve the loose 2026-09-27 conformance input under `docs/archive/` with
  unchanged SHA-256; it remains history, never an active Source of Truth.
- Run the focused checks for TASK-R1.1 through TASK-R1.6, inspect the exact diff,
  update Graphify once and record any discovered work explicitly.

Acceptance: no untracked project file remains in the original checkout and the
archived input is present in the R1 commit.

## TASK-R1-DELIVERY — Review, gate and merge EPIC-R1

- Push the exact branch, create one SourceCraft PR to `main` and verify its head.
- Review the full diff against this plan and active Source of Truth.
- Run exactly one manual exact-head RISKY SourceCraft gate.
- Fix blockers before the gate is accepted; any new commit invalidates old proof.
- Merge only after green attestation and record PR, run, head and merge SHA.

Exit: canonical `origin/main` contains EPIC-R1 and is clean.

# EPIC-R2 — Production Truth & Source of Truth

Risk: RISKY  
Delivery: MERGE_AFTER_GATE, then owner-authorized conditional release  
Production: exactly one rollout only when final production identity differs

Goal: make repository, deployed artifact and active documents tell one factual,
verifiable story without redeploying an already-current production artifact.

## TASK-R2.1 — Full proof of current exact main

- Start from the merged EPIC-R1 `origin/main`.
- Run the project final/release proof once, reusing the R1 gate evidence where
  the SHA and covered diff are unchanged.
- Record exact main SHA and required risk-specific proof; no production mutation.

## TASK-R2.2 — Read-only production identity

- Through the project server/Secret Master route, read the running container
  revision label, immutable image ID/digest and health without printing secrets.
- Compare the observed revision with canonical SourceCraft `origin/main`.
- If equal, explicitly record `NO DEPLOY`; if different, record the conditional
  owner release decision already granted by this approved plan.

## TASK-R2.3 — Synchronize active Source of Truth

- Reconcile `PROJECT.md`, `OPERATIONS.md`, `DELIVERY_STATE.yaml`, `AGENTS.md`,
  `README.md`, backlog, release checklist and changelog where they carry active
  status, commands or production claims.
- Separate observed public state, deployed artifact identity, code-main state,
  operational readiness, feed readiness and lead delivery readiness.
- Do not embed secrets or invent an exact future merge SHA. Immutable release
  run/log evidence is the authority for the self-referential final merge SHA.

## TASK-R2-DELIVERY — Review, gate and merge EPIC-R2

- Create one SourceCraft PR, review the exact documentation/proof diff, run one
  exact-head RISKY gate and merge to `main`.
- Record PR, gate run, exact head and final merge SHA.

## PROD-R2 — Conditional one-rollout release and live proof

This section is owner release work and is not imported as Developer role work.

1. Re-read final clean SourceCraft `origin/main` and production revision/digest.
2. If they are equal: do not deploy; proceed directly to bounded live proof.
3. If they differ: run the project-canonical SourceCraft release workflow once,
   build one immutable artifact, perform one rollout and preserve rollback.
4. Verify running revision equals final `origin/main`; capture immutable image
   identity from the running container and release attestation.
5. Run health, owner/admin authentication, jobs/backup checks and the bounded
   full public crawl/smoke including headings, robots, sitemap and key journeys.
6. Store exact SHA/digest evidence in the release run and local redacted release
   artifact; do not create a post-release commit that would invalidate equality.

Stop and rollback according to the project runbook on failed health, identity,
migration compatibility, owner access or changed-path live acceptance.

## Final done-state

- EPIC-R1 and EPIC-R2 are merged through exact-head RISKY gates.
- Canonical `main`, GitHub mirror and production revision are equal.
- Production image identity and live proof are available as redacted evidence.
- Active Source of Truth has no stale pre-release or unknown-SHA claims.
- No second rollout, persistent staging resource or follow-up monitoring stage
  is created by this plan.
