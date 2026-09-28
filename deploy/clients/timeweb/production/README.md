# DON CITY public production rollout

Runtime env, credentials, rendered Nginx files and release evidence stay
outside Git.

1. Require a green manual `release-main` run for the exact current
   `origin/main` SHA.
2. Confirm one healthy production runtime, one jobs owner, current DB/media
   backup evidence and the previous immutable image.
3. Build the Docker image once off-host with the exact Git revision label.
   Never build on the production server.
4. Transfer the image directly to the server and verify its checksum.
5. Preserve `/srv/doncity/production/.env`; replace only the immutable image in
   the existing production Compose project.
6. Run migrations only when the exact release contains a migration delta and a
   bound rollback plan. This documentation-only release has no migration step.
7. Verify container health plus public HTTPS, robots, sitemap, catalog,
   Makeevka allowlisted routes and a representative property page.
8. Keep public indexing enabled. Global `noindex` and deny-all robots are not a
   release path.

The real feed remains disabled. Rollback switches Compose to the recorded
previous immutable image; database rollback is migration-specific. No
persistent staging contour or post-production monitoring task exists.
