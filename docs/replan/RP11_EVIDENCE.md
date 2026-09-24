# RP-11 evidence ledger

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7 APPROVED.
- Epic: `dcv4-epic-64` / RP-11.
- Branch: `codex/rp-11-sitemap-indexnow`.
- Base main: `ca7e34a592a7c80b2ef007c8390ce66997d5c790`.
- Implementation checkpoint: `e63fbc35e91bd7973df90c8fc8343d4f2a1cdb96`.
- Verified checkpoint: `e149b929ad279e4cb75c6a4707fdf97c49824bd3`.
- Acceptance proof: `docs/replan/RP11_VERIFICATION.md`.
- Snapshot: `scripts/fixtures/rp11-sitemap.snapshot.json`.
- Focused verifier: `pnpm verify:sitemap-indexnow`.
- Delivery profile: `CRITICAL`.
- Required merge gate: one manual exact-head `STANDARD` SourceCraft Gate.
- Production, DNS, live IndexNow, server and secret mutations: not performed.

Known deviation: the repository-wide SourceCraft policy guard still represents a separate pre-existing CI-policy mismatch. It is already isolated as discovered work and does not alter the RP-11 runtime contract or focused proof.
