# EPIC-47 — release rehearsal preflight

Date: 2026-09-26
Base revision: `d6359f3d8461014bf7e2946d914d7ea473102b5e`
Mode: `WORK / isolated staging rehearsal`
Delivery profile: `CRITICAL`

## Outcome contract

EPIC-47 must build one immutable image from the exact canonical `main` SHA,
deploy it to the existing isolated noindex staging runtime, prove the required
checks, switch back to the recorded previous image, prove rollback health, and
then restore the exact candidate as the final staging release candidate. The
same image is reused throughout the sequence. Production, public indexing,
DNS, secret mutation and production data are outside this epic.

## Entry evidence

| Entry condition | Result | Evidence |
| --- | --- | --- |
| Approved graph | PASS | V4 plan v7 is `APPROVED`; Task Manager reconciliation is `CLEAN` with 55/55 epic coverage. |
| Parent dependencies | PASS | EPIC-42, EPIC-44, EPIC-45, EPIC-46 and RP-12 are closed. |
| Canonical source | PASS | SourceCraft `main` is `d6359f3d8461014bf7e2946d914d7ea473102b5e`; PR 60 merged after RISKY gate run 62. |
| Exact-main manifest | PASS (preflight) | `RELEASE_MODE=REHEARSAL pnpm release:manifest` recorded clean source, matching `origin/main`, Docker artifact format and 29 migration files. |
| Static release contract | PASS | `verify:production-topology` and `verify:release-artifact` pass. |
| Isolated staging | PASS | Existing staging has separate PostgreSQL, media and secrets, `JOBS_AUTORUN=false`, HTTPS and deny-all indexing protection. |
| Current rollback point | PASS | Current image `staging-d8b7d63` is healthy; retained images `staging-b0078c3` and `staging-9ad95e2` plus versioned Compose backups provide earlier recovery points. |
| Current-to-main runtime delta | PASS | `d8b7d63..d6359f3` changes only staging/evidence documentation and the structural crawler report; no migration or application runtime file changed. |

## Rehearsal sequence

1. Reconfirm clean `origin/main=d6359f3…` and SourceCraft run 62 evidence.
2. Generate a fresh rehearsal manifest and build the immutable Docker image
   once outside the server with the exact revision label.
3. Record image ID, compressed artifact checksum, current staging image and
   Compose backup before any switch.
4. Transfer with checksum verification, load without server-side build and
   deploy the exact-main image with jobs disabled.
5. Run authenticated health, public HTTPS/noindex, full verification, route
   lifecycle and changed-flow smoke without creating persistent PII.
6. Roll back only the application image to the recorded `staging-d8b7d63`
   point and prove health/HTTPS/noindex.
7. Redeploy the same exact-main image, prove the final candidate again and
   retain both exact candidate and rollback image.

No database rollback is required for this sequence because the candidate has
no migration delta from the currently deployed image. A changed migration set
or any database mutation invalidates this contract and stops the rehearsal.

## Authority and stop conditions

The owner has authorized exact-head rollout to the existing isolated staging.
The approved EPIC-47 contract explicitly includes deploy/rollback simulation;
the sequence above stays inside that reversible application-image boundary.

Stop before:

- production, DNS, public indexing, production data or production database;
- secret creation, rotation or value changes;
- migration execution when the candidate migration set differs from the
  current staging image;
- creation or deletion of a database, provider snapshot or external resource;
- rollback when the current image ID, Compose file or health baseline differs
  from the recorded point;
- any artifact whose revision, checksum or loaded image identity cannot be
  bound to the exact canonical main SHA.

## Known limitations outside the app rehearsal

Independent uptime alerts and a provider backup restore drill remain required
before a production GO decision. The safe EPIC-47 fallback is to complete the
immutable application deploy/rollback proof and keep production status
`NOT AUTHORIZED`; it must not be described as production release evidence.

## Task contract

- Goal: exact-main immutable staging candidate with proved deploy, rollback
  and redeploy.
- Non-goals: production cutover, DNS, indexing activation, secret mutation,
  provider resource lifecycle and real PII.
- Data/auth boundary: existing isolated staging only; jobs disabled; no
  persistent synthetic fixture is required for the image-switch rehearsal.
- Proof: exact SHA/revision/checksum, full project verification, live staging
  smoke before and after rollback, final candidate identity and rollback point.
- Gate: `RISKY` before merge; EPIC-48 remains the only production path.
