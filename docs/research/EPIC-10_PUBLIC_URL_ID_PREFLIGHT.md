# EPIC-10 preflight — public URL ID

Status: PASS — implementation is bounded and may start
Date: 2026-09-24
Scope: `dcv4-task-10-preflight`

## Task contract

- **Outcome:** every property has a dedicated, immutable numeric `publicUrlId`.
  Public lookup, canonical URL construction and lifecycle resolution use this
  value, not Payload's internal record ID.
- **In scope:** Payload schema/types/forward migration, feed create/update
  boundary, Public Gateway read DTOs and property URL consumers, plus
  deterministic fixtures.
- **Out of scope:** applying any database migration, backfilling a managed
  database, production routing/DNS, legacy URL compatibility beyond the
  already-approved semantic canonicalisation rule.
- **Risk:** RISKY — schema plus public identity. Delivery requires one
  exact-head `merge-risky` SourceCraft gate.

## Entry

- Base: SourceCraft `main@633ab49aef0242dfcaf29012f02ea218703e6d7e`.
- Branch: `codex/epic-10-public-url-id`.
- Approved source: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`, plan v7,
  §19 and `EPIC-10`.
- Completed dependencies: RP-12 / `dcv4-epic-65` and EPIC-09 /
  `dcv4-epic-09`.
- Platform: AMS Realty Platform Core 3.0 + Payload 3.90.1; Payload remains
  the sole owner of schema and forward migrations.

## Verified current state

1. The typed grammar and resolver already name the route parameter
   `publicUrlId`, but current Public Gateway reads and sitemap URLs substitute
   `properties.id`. That internal database identifier is not an explicit,
   durable public identity contract.
2. The feed upsert key is correctly scoped to `feedSource + externalId`; an
   ordinary relist reuses the same property record. The new field must be set
   only on creation and never be included in an update patch.
3. `slug` is already held immutable after publication. It is a semantic prefix
   only: a stale semantic or category must resolve with one 301 to a URL built
   from the stored category, current semantic and `publicUrlId`.
4. The grammar accepts decimal-only public identifiers and has no price input.
   The public identity value remains decimal-only; neither `priceMinor` nor a
   formatted price may participate in a generated property URL.
5. Graph inspection confirms the lookup boundary reaches the proxy, public
   route resolver, site renderer, lifecycle HTTP route, sitemap and SEO
   catalog consumers. These consumers must move together so no route can fall
   back to the internal ID.

## Implementation contract

1. Add `publicUrlId` to the `properties` collection as a unique, indexed,
   positive numeric public field. It is private for direct editor mutation.
2. Assign a new value only when a property is first created. The allocator must
   be deterministic for fixture repositories and collision-safe in the Payload
   schema/runtime; updates preserve the existing value.
3. Replace all public read/select, lookup, lifecycle, sitemap and URL-builder
   uses of `property.id` with the explicit field.
4. Keep the `feedSource + externalId` upsert contract intact: same external
   identity retains the original field across reactivation and changed offer
   content.
5. Resolve semantic or category mismatch with exactly one 301 to the
   grammar-owned canonical property path. Invalid/missing IDs remain 404 and
   price is never accepted as a URL identity component.
6. Generate Payload types and one forward migration only. Do not connect to or
   mutate a local, staging or managed database in this epic.

## Proof plan

- Add an isolated `verify:public-url-id` fixture proving create, relist,
  reactivation, public lookup and a single canonical redirect.
- Extend relevant feed, public gateway, resolver and sitemap proofs.
- Run generated types, targeted scripts, typecheck, scoped lint and exact diff
  whitespace checks. Full lint and DB-dependent checks are recorded separately
  if baseline/runtime constraints remain.

## Stop conditions

- A required migration is destructive or needs an unapproved managed-database
  backfill.
- A feed identity cannot preserve the existing record for the same
  `feedSource + externalId`.
- A proposed compatibility redirect requires unproven legacy production URL
  exposure or would form a redirect chain.
