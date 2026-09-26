# ADR-0008: Lead and marketing contract reconciliation 1.3.2

- Status: Accepted
- Decision owner: approved Master Plan V4, EPIC-33 and EPIC-34
- Date: 2026-09-25

## Context

EPIC-33 added the approved public marketing CTA contract and EPIC-34 added the
approved typed lead business context. Both changes are already present on
canonical `main`, but the frozen contract lock and version remained at `1.3.1`.
The RISKY gate correctly rejects that drift.

## Decision

Reconcile the already approved additive contract surface as patch version
`1.3.2` and refresh the normalized lock manifest. No field, enum or runtime
behavior is introduced by this ADR; it records the public surface already
delivered by EPIC-33/34.

## Consequences

- Consumers can identify the additive marketing and lead-context surface by an
  exact contract version.
- The frozen contract guard returns to fail-closed operation.
- Any later contract change still requires its own approved version bump and
  ADR; this reconciliation is not a blanket approval for future drift.
