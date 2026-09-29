# TASK-05.8 — Exact deployed identity contract

Date: 2026-09-29

Mode: contract verification plus read-only production inventory

Status: `PASS` for the engineering contract; rollout evidence remains production-only and pending an explicit release command.

## Contract proof

- SourceCraft `release-main` accepts one full lowercase exact-main SHA and builds both runtime and migration images from that checkout.
- Both images receive `org.opencontainers.image.revision=<exact SHA>` and are pushed to the approved SourceCraft registry repository.
- The production helper requires clean local `main == origin/main`, pulls both exact-SHA images, resolves both registry digests and verifies both revision labels.
- The migration image runs ephemerally with `JOBS_AUTORUN=false` and is removed after a successful migration.
- Production Compose is rewritten to the resolved runtime digest, never to a mutable tag; the server does not build an image.
- Post-rollout checks bind the running digest and revision, require exactly one persistent runtime/jobs owner, timestamp the run and retain the previous Compose image as rollback evidence.

## Current live identity snapshot

The read-only snapshot at `2026-09-28T23:33:58Z` found:

- exactly one healthy production runtime;
- runtime and Compose pinned to the same SourceCraft digest;
- `org.opencontainers.image.revision=a6cdbfc3a1a1348f65934ca202f39baec5c09bca`;
- exactly one `JOBS_AUTORUN=true` owner;
- two retained rollback Compose snapshots.

This is the identity of the currently running pre-remediation artifact. It is not relabelled as the new candidate. The final EPIC-05/main SHA and its new digest may be recorded only after the approved branch is merged and the owner gives the separate `Выпускаем production` command.

## Safety

- No image was built, pushed, pulled or started by this task.
- No Compose, container, migration, database, backup, DNS, Secret Master or production state was changed.
- Secret values were consumed process-locally and were not persisted.
