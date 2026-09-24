# EPIC-12 — Contracts / DTO preflight

- Status: ready for implementation
- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST`, version `v7`
- Source anchor: `EPIC-12`
- Base: `21c2b5c66259bf16f903140f8306f70c83cdd65c`
- Date: 2026-09-24

## Entry evidence

- `EPIC-07` froze the public NAP contract at `1.2.0`.
- `EPIC-09` defines the R1 taxonomy: `apartment`, `house`, `land`; the
  `commercial` category remains prepared-off.
- `EPIC-10` provides the stable `publicUrlId` identity.
- `RP-10` and `RP-12` are complete: public inputs and cache dimensions carry
  explicit geo identity. The current branch is fast-forwarded to canonical
  `main` before this task.

## Minimal implementation contract

The frozen public package receives an additive `1.3.1` release:

1. `geo.ts` owns the allow-listed `RegionDTO`, `CityDTO`, `DistrictDTO` and
   `PropertyLocationDTO` shapes. IDs, slugs, public labels, grammatical forms,
   publication state and parent links are explicit; no raw Payload documents
   or access state cross this boundary.
2. `property.ts` adds discriminated public details for R1 apartment, house and
   land characteristics. The base card remains stable and gets a structured
   location only as an optional additive field.
3. Commercial and development shapes are exported as prepared-off variants.
   They deliberately receive no R1 route, menu, publication predicate or
   catalog adapter in this epic.
4. The lockfile is updated only after an ADR records the approved V4 decision.

## Boundaries and non-goals

- Payload remains the only schema, auth and migration owner.
- Public Gateway is the only future runtime mapper. This epic does not add a
  database read, migration, production change, DNS change or secret mutation.
- R2/newbuild/commercial activation remains excluded until its separate
  research-first owner-approved work.

## Verification plan

- Typecheck verifies discriminated DTO fixture compatibility.
- Contract lock/check proves the exact frozen release.
- A focused contract verifier proves R1 fields and prepared-off exclusion.
- The later EPIC-12 verification task reruns the scoped evidence after the
  implementation task; delivery uses one exact-head RISKY SourceCraft gate.

## Stop conditions

None are active. A schema, public route, R2 activation, secret or production
change would be out of scope and must not be introduced by this epic.
