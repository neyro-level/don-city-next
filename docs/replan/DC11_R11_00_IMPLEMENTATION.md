# DC10-R11-00 — reproducible redacted inventory diagnostic

Status: `IMPLEMENTED`

Head identity is recorded in the Task Manager execution ledger.

## Outcome

The repository now owns a repeatable read-only Payload diagnostic:

- `pnpm diagnostics:production-inventory` queries only published properties;
- the Payload select allowlists public URL identity, lifecycle/category fields,
  relation IDs and `needsReview`;
- city and district lookups select only slug and publication state;
- output is restricted to category, lifecycle, geo slugs, review state,
  canonical path, data-indexability verdict and reason codes;
- title, address, coordinates, description, media, source payload, contacts,
  credentials and full database URLs cannot enter the result through a spread.

`pnpm verify:redacted-production-inventory` uses a synthetic private marker to
prove that unknown/private source fields are not copied and locks the exact
redacted output keys, URL construction, counts and missing-geo reason.

## Current production baseline

The read-only preflight remains the factual snapshot: 12/12 published rows
reconcile with the live sitemap/HTTP surface; all 12 lack a city relationship;
four have `needsReview=true`. The diagnostic implementation does not change
those records and does not replace the `DC10-R11-01` migration/backfill task.

## DOC IMPACT

- Added this implementation record and the preflight evidence.
- Active PRD, Product Structure, Architecture, Backlog, Release Checklist,
  Project, Operations and Design documents were reviewed; their target
  contracts do not require a status change from this read-only implementation.
- Production, DNS, Secret Master, database rows and runtime state were not
  changed. No post-production monitoring task was created.
