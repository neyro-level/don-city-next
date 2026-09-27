# DC10-R11-01 — geo relation repair preflight

## Exact baseline

Read-only production inspection was executed inside an explicit PostgreSQL
`READ ONLY` transaction on 2026-09-28. The inspected scope is the 12 active,
published, secondary-sale records established by DC10-R11-00.

| `cityRaw` | `districtRaw` | Records | City linked | District linked | `needsReview` |
|---|---|---:|---:|---:|---:|
| Донецк | Будённовский | 4 | 0 | 0 | 1 |
| Донецк | Калининский | 3 | 0 | 0 | 1 |
| Донецк | Ленинский | 2 | 0 | 0 | 1 |
| Донецк | Пролетарский | 2 | 0 | 0 | 0 |
| Донецк | Ворошиловский | 1 | 0 | 0 | 1 |

Production already contains one published city, `donetsk`, and ten published
district records related to it: all nine administrative districts plus the
`tekstilshchik` microdistrict. Every raw district value in the current 12-row
inventory has an exact city-scoped district counterpart. No property, schema,
secret, DNS or runtime value was changed by this inspection.

## Affected owners

- `src/project/geo/feed-match.ts` owns normalization and city-scoped matching.
- `src/project/collections/Properties.ts` owns the nullable city and district
  relationships and the preserved raw labels.
- `migrations/` is the only allowed owner of the durable Payload backfill.
- `migrations/index.ts` owns migration ordering.
- `scripts/verify-geo-model.ts` and a new focused backfill verifier own the
  deterministic fixture and rollback proof.

Graph inspection confirms these owners are connected through the Payload geo
types, ingest repository and migration registry; no second geo collection or
second persistence layer is required.

## Implementation contract

1. Add a Payload migration that resolves the canonical city by normalized raw
   city label, then resolves a district only inside that city.
2. Update only rows whose relationship is currently null. Existing explicit
   relationships are never overwritten.
3. A known city plus unknown district keeps `district_id = null`, preserves
   `district_raw`, and sets `needs_review = true`.
4. A known city and known district receives both relationships. Review state is
   cleared only when the migration can prove that the geo fields were the sole
   unresolved condition; otherwise it remains true. The safer initial contract
   is therefore to preserve an existing `needs_review = true`.
5. The migration is idempotent: a second `up` produces no further changes.
6. `down` restores only rows changed by this migration, using a project-owned
   audit table created in the same transaction; unrelated records remain intact.
7. Verification uses a non-empty representative fixture containing a known
   district, an unknown district, an existing relationship and a non-Donetsk
   city label. Production mutation remains outside this epic.

## Acceptance mapping

| Final criterion | Planned evidence |
|---|---|
| Published records have actual city relations | migration fixture plus exact affected-row assertions |
| Safe district mapping | city-scoped known/unknown district assertions |
| Idempotent Payload migration/backfill | two consecutive `up` applications with the second reporting zero changes |
| Non-empty fixture | committed representative PostgreSQL fixture |
| Rollback proof | `up → down` equality assertion for every touched row |

## Risks and stop conditions

- RISKY: schema/data migration in a CRITICAL project.
- Stop if production identity differs from DC10-R11-00, raw labels become
  ambiguous, or an existing relationship conflicts with the raw label.
- No production migration, deploy, DNS change or secret mutation is authorized.

## Document impact

- Changed: this preflight evidence only.
- Reviewed without change: PRD, Product Structure, Architecture, Backlog,
  Release Checklist and Operations.
- Owner transition: production inventory remains current evidence; the
  relationship repair remains TARGET until its implementation is merged and a
  separately authorized final release applies the migration.
