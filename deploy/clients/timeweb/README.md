# Timeweb production blueprint

This directory is the checked-in production contract for DON CITY. It never
provisions a second server, persistent staging runtime, database, bucket or
Secret Master scope.

## Frozen boundary

- One existing Timeweb VPS runs one production application runtime.
- One Timeweb Managed PostgreSQL database and one private S3 bucket are the
  only persistent data owners.
- Artifacts are built once outside the server and deployed by immutable tag.
  `git pull`, package installation and builds on the production host are
  forbidden.
- Exactly one runtime owns Payload jobs.
- Runtime values come only from Secret Master `DonCity Server/prod/production`;
  values never enter Git, release logs or documentation.
- Non-production database proof is disposable, isolated and removed inside the
  bounded check. A persistent staging/shadow/mirror database is forbidden.

## Release order

1. Start from clean canonical SourceCraft `main` and attest its exact SHA with
   the manual `release-main` workflow.
2. Bind the release to current backup/restore evidence and the previous
   immutable production image.
3. Build one immutable Docker image locally and record its SHA and checksum.
4. Transfer that artifact directly to the production host; do not use the
   production media bucket as transport.
5. Replace the single production service in place, preserving its approved env
   file and jobs ownership.
6. Run one bounded health and public-route smoke. Roll back immediately to the
   recorded previous image on failure.
7. Remove the transport artifact. Production is the final stage; no monitoring,
   observation or follow-up task is created afterward.

Static proof: `pnpm verify:client-readiness` and
`pnpm verify:release-artifact`. Live evidence is the exact SourceCraft release
run, immutable image metadata and bounded production smoke.
