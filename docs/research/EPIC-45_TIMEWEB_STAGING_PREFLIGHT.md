# EPIC-45 — Timeweb staging preflight

Date: 2026-09-25
Base revision: `e2fafec266eedd20c14b0b40be11b3ff4916cbf8`
Mode: staging contract and read-only discovery; no external mutation

## Outcome contract

EPIC-45 must prove the R1 route matrix, district/facet and nearby-locality
behavior, 404/410 lifecycle, feed/jobs/leads flows and cache behavior on an
isolated Timeweb staging runtime. Staging must remain `noindex`, use no
production PII and have a separate database and secrets. A local fixture or
static blueprint can prepare this proof but cannot be reported as live staging.

## Entry evidence

| Entry condition | Result | Evidence |
| --- | --- | --- |
| Approved v7 graph and dependencies | PASS | EPIC-39, EPIC-43, EPIC-44 and RP-12 are closed; canonical main is `e2fafec266eedd20c14b0b40be11b3ff4916cbf8`. |
| Existing Timeweb target identity | PASS | EPIC-03 proved one DON CITY server and one managed PostgreSQL 18 cluster; no second server is implied. |
| Private database route | PASS | EPIC-03 restored the existing private NIC configuration and proved authenticated read-only PostgreSQL 18.6 connectivity. |
| Dedicated secret contour | PARTIAL | `DonCity Server/prod` exists and contains server/database access names, but no separate staging runtime secret set is present. |
| Immutable deployment blueprint | PASS (static) | The repository contains loopback Compose, Nginx, release-manifest, backup and monitoring contracts. |
| Current client-readiness gate | FAIL (expected) | `verify:client-readiness` reports six unresolved decisions/contracts: lead retention, archive retention, legal-content marker, indexing decision, required host allowlists and storage/deployment proof. |
| Live staging resources and rollout authority | BLOCKED | Separate staging database/secrets/media target and authorization for server/DNS writes are not present in the current task authority. |

## Required owner/external gates

1. Rotate the temporary managed-database password that previously appeared in
   owner conversation and update the dedicated Secret Master values.
2. Approve or provide an isolated staging PostgreSQL database and staging
   runtime secrets. Production data and the current production-target database
   cannot be reused for staging proof.
3. Decide the staging media owner: provision/approve Timeweb S3 with its access
   policy, or explicitly approve a temporary isolated local-media rehearsal.
4. Authorize the planned Timeweb server writes needed for staging runtime,
   Nginx/TLS and monitoring. DNS remains a separate mutation; an approved
   staging hostname is required for domain-level TLS and crawl evidence.
5. Approve lead and archive retention periods and provide the real feed-image,
   feed-outbound and lead-delivery hosts before their allowlists can be frozen.

Secret creation/update, provider resource provisioning, SSH writes, package
installation, service restart and DNS changes are external mutations. The
approved product plan does not override their explicit owner gates.

## Safe implementation scope before the gates

- render and validate a staging-specific Compose/Nginx/env contract with
  `JOBS_AUTORUN=false` and fail-closed `noindex`;
- project the already delivered EPIC-33 legal documents as `approved` in the
  readiness config and keep indexing `noindex` until EPIC-48 owner approval;
- build the immutable candidate artifact outside the server and bind it to an
  exact SHA;
- prepare redacted smoke matrices for R1 routes, feeds/jobs/leads, lifecycle,
  cache and restore evidence;
- run local isolated PostgreSQL and HTTP rehearsal without representing it as
  Timeweb staging.

## Stop conditions

- any attempt to use the production-target database or real lead PII for
  staging;
- secret mutation, provider provisioning, SSH write, DNS/TLS change, migration
  or service restart without the corresponding explicit owner authorization;
- missing immutable image identity, backup/rollback point, one-jobs-owner proof
  or fail-closed staging `noindex` policy.

## Preflight decision

`READY_WITH_EXTERNAL_GATES` — repository preparation may continue. Live
Timeweb staging proof and EPIC-45 verification remain blocked until the gates
above are resolved. Production is not authorized by this epic.
