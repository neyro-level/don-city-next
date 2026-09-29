# EPIC-R2 exact main proof

Observed: 2026-09-29

## Canonical identity

- SourceCraft `origin/main`: `1993a4efe0164ea9ab480cbf3b974fbffbbbe4a9`
- main Git tree: `d7df4ab5578642dbbb7c8dcc421c2bd257f052b0`
- gated EPIC-R1 head: `40b7a79410c2bd6877eb03ae7f49591395773b3a`
- gated head Git tree: `d7df4ab5578642dbbb7c8dcc421c2bd257f052b0`
- tree equality: `PASS`

The SourceCraft squash merge changed commit identity but not repository content.
Therefore the exact-head proof remains valid for the merged `main` tree.

## Reused final/release proof

SourceCraft `merge-risky` run `160` completed with `success` for exact gated
head `40b7a79410c2bd6877eb03ae7f49591395773b3a`. Its project command was
`pnpm verify:final-release-contract`. The run started at
`2026-09-29T08:20:52.693155Z` and finished at
`2026-09-29T08:21:33.008058Z`.

Run API:
`https://api.sourcecraft.tech/repos/integrator-p/don-city-next/cicd/runs/160`

## Risk-specific evidence

The unchanged gated tree also carries the focused R1 proof recorded in
`docs/research/EPIC_R1_CONSTITUTION_CLEANUP_PROOF.md`: UI Core guards, atomic
304 bookkeeping, mandatory lead retention typing, query grammar/robots policy,
TypeScript and the exact historical-file hash all passed.

No production mutation was performed by this proof task. Production identity is
read separately in `TASK-R2.2`.
