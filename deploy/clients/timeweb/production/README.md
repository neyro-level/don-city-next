# DON CITY production noindex rollout

This directory is the checked-in fail-closed production contract. Runtime env,
credentials, rendered Nginx files and release evidence stay outside Git.

1. Require a green manual `release-main-noindex` run for the exact current
   `origin/main` SHA.
2. Bind the release record to the managed PostgreSQL backup identifier, the
   isolated restore result and the previous immutable image.
3. Build the Docker image once off-host and record its digest. Never build on
   the production server.
4. Rehearse that same digest on isolated staging with `JOBS_AUTORUN=false`.
5. Materialize `/srv/doncity/production/.env` from Secret Master `/production`.
6. Run migrations once, import/verify the curated DON CITY inventory, then
   start exactly one production runtime with `JOBS_AUTORUN=true`.
7. Render the Nginx template, obtain TLS for both hosts, run `nginx -t`, reload
   and verify HTTPS, health, Admin, catalog, property pages, media and leads.
8. Keep `X-Robots-Tag: noindex, nofollow` and `robots.txt: Disallow: /` until
   canonical NAP, external alert delivery and owner indexing approval exist.

The real feed remains disabled: no feed source is created or scheduled by this
release. Rollback switches Compose to the previous immutable digest and restores
the previous env; database rollback follows the bound managed-backup runbook.
