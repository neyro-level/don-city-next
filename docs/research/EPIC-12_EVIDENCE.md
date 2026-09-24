# EPIC-12 — Contracts / DTO evidence

- Plan/version: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`
- Canonical source: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-12`
- Branch: `codex/epic-12-public-contracts`
- Base `main`: `21c2b5c66259bf16f903140f8306f70c83cdd65c`
- Implementation head: `ad5044654bac63d7ad0a5c3a4e998ee4ac1507fd`
- Verification head: `9d7bd5bb61b0533ba1fd4cc3d1cbd9d207a70438`

## Traceability

| Plan outcome | Artifact | Proof |
|---|---|---|
| Region / City / District DTO | `packages/contracts/src/geo.ts` | typed fixture and targeted verifier |
| Apartment / house / land DTO | `packages/contracts/src/property.ts` | discriminated type fixtures; taxonomy verifier |
| Prepared commercial / development | `Prepared*DTO` exports | `prepared-off` static assertion; no R1 predicate |
| Frozen public contract | `contracts.lock.json`, ADR-0007 | `pnpm contracts:check` → base `frozen 1.3.1` |

## Checks

- `pnpm verify:contracts-dto` — PASS
- `pnpm contracts:check` — PASS
- `pnpm verify:property-taxonomy` — PASS
- `pnpm typecheck` — PASS
- changed-path and whitespace check — PASS

No deviations or discovered work. The change contains no server, database,
DNS, secret, R2 route or production mutation.
