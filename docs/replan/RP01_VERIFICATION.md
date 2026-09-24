# RP-01 verification — V4 Source of Truth / ADR / archive

Verdict: `PASS`

## Acceptance matrix

| Criterion | Verdict | Evidence |
|---|---|---|
| Active documentation references V4 as the detailed contract | PASS | `docs/README.md` Source of Truth map; no root contract document except V4 itself references V3 as current |
| V3 snapshot is explicitly superseded | PASS | snapshot internal status is `SUPERSEDED`; archive index records finalized hash |
| Four durable decisions exist | PASS | ADR-001…ADR-004 each exist once and have `Status: Accepted` |
| Active docs contain no category-first listing owner | PASS | root contract scan found none of the category-first owner patterns |
| Product Structure, Architecture, Backlog and Release Checklist align | PASS | each points to the V4/ADR boundary appropriate to its scope |
| Changelog and historical evidence boundary exist | PASS | `docs/CHANGELOG.md` and `docs/research/README.md` |
| Plan approval and Beads authority are unchanged | PASS | V4 source hash unchanged; validation/reconciliation remain exact and clean |

## Exact checks

- Task Manager validation: `PASS`, coverage `55/55`, `55` epics, `265`
  tasks, source SHA-256
  `9f4b011c10520d4d4a813da5e0f10409354c84f1901a62c5cc3a89f073319418`.
- Task Manager reconciliation: `CLEAN`, managed `320`, missing `0`,
  unexpected `0`, drift `0`, cycles `0`.
- V3 finalized archive SHA-256:
  `40fc21bdfcf1f11ae66283a29acdbd26ffaaf22c92e2ab5a96c5dd26f58dc24b`.
- Active root docs V3-current-reference assertion: `PASS`.
- Category-first owner pattern assertion across active contracts: `PASS`.
- ADR uniqueness/status assertion: `PASS`.
- Full epic `git diff --check`: `PASS`.

## Limits

This is documentation governance verification. It does not claim that the
runtime already implements the V4 grammar; RP-02 and later epics own that work.
No production, DNS, server, database or secret operation was performed.
