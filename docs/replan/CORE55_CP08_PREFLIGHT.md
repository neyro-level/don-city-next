# CORE 5.5 CP-08 — isolated staging preflight

Status: PREFLIGHT COMPLETE — IMPLEMENTATION PASS
Date: 2026-09-27
Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`
Task: `dc55-task-75-preflight`
Branch: `codex/dc55-epic-75`
Integrated base: `origin/main@01b3af8584bf79b2a3ab4efa507c42b40444a4ce`

## Purpose and boundary

This document freezes the CP-08 acceptance surface before any staging action.
CP-08 must prove one integrated exact candidate on an isolated staging contour,
while the externally visible staging edge remains `noindex`. It must not change
production, DNS, the production indexing policy, real-feed state or secrets.

This preflight is planning evidence only. It does not claim a staging identity,
candidate image, database snapshot, runtime proof or release readiness.

## Entry state

Canonical SourceCraft `main` now contains the delivered CP-01 through CP-07
trees. The dependency graph is closed and the integrated candidate can be
assembled. Live exact-candidate staging work remains blocked only by the
missing canonical access route described below.

| Dependency | State at preflight | Consequence |
|---|---|---|
| CP-01 | delivered | eligible for the future integrated candidate |
| CP-02A | delivered | four-month launch scope is frozen |
| CP-02 | delivered | eligible for SEO/crawl proof |
| CP-03 | delivered through PR 79 / RISKY gate 91 / merge `11474697ced75a7a0a50b0b04b26bf574c0a47a8` | proofs A/D/E/F/G are available for integrated repetition |
| CP-04 | delivered through PR 78 / gate 90 / merge `ee786deba8beba864dc12769759c085107f437ab` | eligible for media/performance proof |
| CP-05 | delivered | eligible for UI/accessibility proof |
| CP-06 | delivered at `c8fe1a2077b46f66a933337a8950122f70c7864e` | eligible for edge/header proof |
| CP-07 | delivered through PR 80 / STANDARD gate 92 / merge `01b3af8584bf79b2a3ab4efa507c42b40444a4ce` | documentation/readiness contract is part of the integrated base |

All CP-01…07 delivery tasks are closed and reconciled on the integrated base.

## 2026-09-27 resume evidence

- Local isolated PostgreSQL 18 database `don_city_cp08_test` was created for
  non-production proofs; `verify:integration:required` passed, including the
  CP-03 concurrency/recovery scenarios.
- The remaining full verification segments pass: accessibility, dependency
  architecture, guards, TypeScript, lint (pre-existing warnings only), build,
  release-artifact, production-topology and performance contracts.
- Full verification first exposed a stale release-checklist marker; it was
  corrected without weakening the RISKY production gate.
- `verify:client-readiness` remains deliberately fail-closed only on
  `public-indexing-prerequisites-missing`,
  `required-host-allowlists-missing` and
  `client-storage-deployment-contract-missing`.
- Public read-only smoke of `https://staging.doncity-home.ru` confirms HTTP 200,
  `X-Robots-Tag: noindex, nofollow` and deny-all `robots.txt`.
- The structural crawl against that live URL finds 20 differences because the
  server still runs the pre-Core-5.5 staging image: commercial routes, current
  metadata/pagination and the latest sitemap shard are absent. This old-image
  result is not attributed to the exact candidate.
- The dedicated DON CITY deploy key restored access to the verified existing
  server; no other project credential or server identity was used.
- Exact-candidate rollout, snapshot restore proof, public-mode crawl behind the
  noindex edge, rollback/redeploy and transport cleanup passed. Durable evidence
  is recorded in `CORE55_CP08_IMPLEMENTATION.md`.

## Required isolated identities

Before CP-08 implementation, record all of the following without secret values:

- exact SourceCraft `main` SHA and candidate branch SHA;
- immutable candidate image digest/tag built from that SHA;
- isolated staging host identity and proof that it is not production;
- isolated PostgreSQL database identity and restorable pre-run snapshot identity;
- isolated media/S3 namespace identity and cleanup owner;
- edge configuration identity proving external `X-Robots-Tag: noindex` and
  non-indexable `robots.txt` throughout the run;
- runtime/jobs ownership: one jobs-active runtime at most;
- redacted credential references and approved host/channel allowlists;
- rollback image, configuration and database snapshot identities.

Unknown or ambiguous target identity is a stop condition. Production data may
not be mutated or used as the writable CP-08 test database.

## Exact proof matrix

Every result must be tied to the same exact SHA/image and include timestamps,
redacted inputs, expected/actual state and cleanup result.

| Proof | Required scenario | Pass evidence |
|---|---|---|
| A — heartbeat visibility | long controlled import keeps its ingest transaction open while an independent read observes advancing `heartbeatAt` | at least two advancing observations from an independent connection before import completion |
| D — stale import recovery | controlled crash produces stale heartbeat, transitions the run to terminal `interrupted`, executes System Gateway unstuck and allows the next import | state/event timeline, no resurrection of the old run and one successful next run |
| E — retention execution | expired lead and all linked deliveries are processed by the maintenance schedule | delete/anonymize is atomic for the configured mode and no prohibited PII remains |
| F — lead outbox crash window | lead plus pending deliveries commit, process stops before enqueue, orphan sweep finds and requeues them | one recovered delivery path with no lost lead and redacted diagnostics |
| G — retryable delivery | a controlled retryable channel failure occurs | handler records pending plus `nextAttemptAt`, queues `waitUntil`, then the next attempt executes without exposing PII/secrets |

The project uses `CACHE_INVALIDATION_MODE=http`; the optional in-process proof B1
is not an activation target. Any HTTP self-call/cache proof required by the final
candidate follows the active BASE profile and recorded allowlists.

## SEO and URL acceptance surface

Run the application in public-mode behavior only behind the isolated test
contour; the external edge must remain noindex for the entire exercise.

The crawl/validator matrix must include:

- home, secondary apartments, houses, land, commercial real estate and `/yurist/`;
- representative district, permitted facet, property and approved static pages;
- pagination page 1, page 2+, over-range, nonnumeric and unknown-query cases;
- canonical redirects, 404 and retained/gone property cases;
- `/robots.txt`, root `/sitemap.xml`, every sitemap shard and every sitemap URL;
- title, description, one logical `h1`, canonical, Open Graph, Twitter and safe
  JSON-LD validation;
- confirmation that `/novostroyki/`, ЖК/newbuild entities and unapproved legal
  child routes are absent from indexable navigation, crawl and sitemap output.

The crawl report records status, redirect chain, canonical, robots policy,
metadata/structured-data verdict and source sitemap for every URL. Empty sitemap
fallback, an externally indexable staging response, a redirect chain or a false
indexable route stops the run.

## Full verification and performance

The implementation task must discover commands from the integrated candidate's
`package.json`; this preflight does not invent or freeze absent commands. At
minimum, retain artifacts for:

- the project full verification command and all CP-specific regression guards;
- schema/migration compatibility against the isolated database;
- access, gateway, jobs/import/lead, SEO, sitemap, UI and accessibility guards;
- browser evidence for navigation, forms and required error states;
- Lighthouse/performance results for home, a representative catalog and a
  representative property page, plus server-side p95 evidence where supported;
- an exact-head RISKY SourceCraft gate after the evidence diff is frozen.

Budget thresholds come from the delivered project/runtime contract at execution
time. Missing thresholds are reported as a blocker; they are not guessed.

## Rollback rehearsal

Before the proof run, capture the prior isolated staging image/config/database
snapshot. Rehearse restoring those identities, remove temporary public-mode test
exposure, and re-check external edge noindex, runtime health and single jobs
ownership. Production remains untouched.

## Stop conditions

Stop CP-08 implementation on any of the following:

- any CP-01…07 delivery task is not closed or exact heads do not reconcile;
- source/inventory drift or an unclean candidate;
- unknown or shared production/test identity;
- unavailable rollback image, database snapshot or cleanup owner;
- external staging response becomes indexable;
- production, DNS, real feed, indexing or secret mutation would be required;
- destructive migration lacks explicit owner authority and isolated rollback;
- proof A/D/E/F/G, crawl, performance or rollback rehearsal cannot bind to one
  exact SHA/image;
- logs/artifacts expose secrets, PII or full database URLs.

## Exit contract

CP-08 may pass only when one integrated candidate has complete exact-SHA/image
evidence, all required URLs and proof results are recorded, program reconciliation
is clean, and unresolved owner/production gates remain explicit. Its delivery uses
one RISKY exact-head gate. CP-08 merge does not authorize production, removal of
global noindex or feed activation; those remain separate CP-09/owner decisions.
