# RP-05 — preflight

## Execution identity

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7, `APPROVED`.
- Task: `dcv4-task-58-preflight`.
- Branch: `codex/rp-05-geo-model`.
- Base: `b80e96d29cb485b065f9073d805d7d2a7de63e5e` (`origin/main`).
- Delivery: `MERGE_AFTER_GATE`, `RISKY`, plus `verify:schema`.

## Task Contract

Implement only EPIC-58/RP-05: Payload-owned Region/City/District schema, city-scoped identity and feed matching, collision guards, idempotent Donetsk seed and reversible empty/non-empty PostgreSQL 18 migration proof. Preserve unknown feed geo text and listing visibility. Do not implement RP-06 routes/resolver, RP-07 SEO ownership or production/data migration.

## Confirmed schema contract

- Region adds `shortName` and owner-verification state.
- City adds grammatical fields, nullable self relation `agglomerationOf`, publication state and owner-verification state; slug remains globally unique.
- District identity is `(city, slug)`, parent is nullable and same-city, and URL does not depend on parent.
- Property relates to Region → City → optional District and retains unmatched `districtRaw` plus `needsReview` without hiding the listing.
- City slugs reject reserved/category roots; district slugs reject categories and configured facets; facet/category collision remains impossible.
- Donetsk forms and DNR short name start with `ownerVerified=false`.
- Textilshchik is a microdistrict with `parent=null`, `preposition=на`, `nameLocative=Текстильщике`.

## Preserved EPIC-08 WIP inventory

Read-only source: `codex/epic-08-geo-model`, worktree `4. Дон сити--epic-08`, base `8dfd7a6c8568a46dc9c0c7430e99c2e75ce9bcfd`. It contains two committed documentation files and 17 modified plus 10 untracked implementation files. The dirty worktree remains untouched.

Potentially reusable after fresh reimplementation:

- district CSV parsing shape;
- normalization idea that retains `districtRaw` and marks unmatched values for review;
- collection registration and public/system access patterns;
- idempotent upsert intent and focused verification scenarios.

Rejected as incompatible and not copied:

- generated migration: globally unique district slug, destructive `region/locality` column drops, missing representative-data backfill, missing new V4 fields and unsafe down-ordering;
- WIP collections: missing `shortName`, grammatical/owner-verification fields, `agglomerationOf`, composite uniqueness hooks and collision guards;
- district seed lookup by global slug instead of `(city, slug)`;
- Donetsk-specific feed resolver that is not city-registry scoped;
- seed that assigns `parent` after first upsert and can temporarily violate deterministic identity/parent rules.

No cherry-pick, stash operation, checkout or write was performed against the preserved WIP.

## Verification design

- Generate a new Payload migration from the fresh RP-05 schema, then inspect and harden it for representative non-empty data.
- Prove up/down/up on isolated empty and representative non-empty PostgreSQL 18 databases.
- Run the seed twice and assert stable counts/identities.
- Assert rejection of city `kvartiry` and district `odnokomnatnye`.
- Assert same district slug can exist in different cities but not twice in one city.
- Assert Textilshchik remains `parent=null` and unmatched district text remains visible with `needsReview=true`.
- Final delivery requires focused geo/feed proof, typecheck/lint, dependency architecture, `verify:merge-risky` and `verify:schema`.

## Stop conditions checked

- Plan/inventory drift: none.
- RP-04 dependency: merged and closed.
- Production/DNS/server/secret mutation: not required and forbidden.
- Existing WIP: preserved read-only; only compatible concepts may be reimplemented on fresh main.

