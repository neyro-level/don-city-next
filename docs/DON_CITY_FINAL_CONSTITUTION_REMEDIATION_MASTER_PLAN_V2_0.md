# DON CITY — FINAL CONSTITUTION REMEDIATION MASTER PLAN V2.0

Plan ID: AMS-DON-CITY-CONSTITUTION-REMEDIATION  
Version: v1  
**Project:** `neyro-level/don-city-next`  
**Baseline audited:** `main@a6cdbfc3a1a1348f65934ca202f39baec5c09bca`  
**Date:** 2026-09-28  
**Normative technical baseline:** `AMS Realty Platform Core Standard 5.5 — Solo + AI`  
**Normative UI baseline:** `AMS UI Core v5.0`  
**Delivery:** SourceCraft primary → PR → exact-head gate → `main`  
**Implementation delivery:** EPIC-01…05 use `MERGE_AFTER_GATE` only after exact owner approval and clean Task Manager import  
**Production:** excluded from autonomous implementation; one release only after a separate explicit owner release command  
Status: APPROVED  
Approved by: owner  
Approved at: 2026-09-28T21:41:18+03:00

**Architect lifecycle:** imported owner basis → `v0 DRAFT` → final audit findings integrated as `v1 REVIEW` → exact owner approval → `v1 APPROVED`  
**Task Manager:** exact `План утверждён` received → Validate/Import/Reconcile `CLEAN` required before Developer execution

---

# 0. PURPOSE

Bring DON CITY to factual conformance with:

```text
AMS Realty Platform Core 5.5
+
AMS UI Core 5.0
+
project Source of Truth
+
actual production behavior
```

without rewriting the project.

The existing architecture is valuable and must be preserved:

```text
Next.js App Router
Payload CMS
PostgreSQL
Payload Jobs
Public / System / Ingest boundaries
packages/ui
packages/contracts
SourceCraft exact-SHA delivery
Timeweb production
```

This plan is a **remediation plan**, not a redesign and not a second architecture.

---

# 1. AUDIT BASIS VERDICT

The imported owner/auditor packet and the Architect code/doc evidence
substantially agree on the main defect classes. This section records the basis;
the authoritative Architect readiness verdict is in section 16.

The project has a strong foundation, but it is **not constitution-clean yet**.

Main problem classes:

```text
1. Import transaction/finalization correctness
2. Access / overrideAccess / raw SQL governance
3. Lead outbox / delivery recovery / PII retention
4. SEO runtime output
5. UI Core systemic drift
6. Production operational evidence / monitoring / staging / docs
```

The correction must be done in **5 large EPICs**.

Target delivery cadence:

```text
EPIC-01 → 1 PR → review/gate → main
EPIC-02 → 1 PR → review/gate → main
EPIC-03 → 1 PR → review/gate → main
EPIC-04 → 1 PR → review/gate → main
EPIC-05 → 1 PR → final main proof → ONE production release
```

Do not create a PR per task.

Do not deploy any intermediate EPIC.

---

# 2. RECONCILED FINDING REGISTER

## 2.1 Confirmed high-priority findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| C-01 | P0 release gate | Import inventory mutation/deactivation commits before `finishRun` + baseline finalization | EPIC-01 |
| C-02 | P0 production HC | `externalMonitoring=false` in active production configuration | EPIC-05 |
| C-03 | P1 | `runImportFeed()` permits a no-transaction mode if transaction hooks are all absent | EPIC-01 |
| C-04 | P1 | Lead transactional outbox silently proceeds if Payload transaction ID cannot be established | EPIC-02 |
| C-05 | P1 | Public lead request immediately scans/enqueues global orphan deliveries, not only deliveries created by that lead commit | EPIC-02 |
| C-06 | P1 HC | `systemOverrideAccess()` is used outside `src/core/data-access/system` | EPIC-01/02 |
| C-07 | P1 governance | Raw SQL surface is larger than the narrow ADR-0011 exception; every retained operation needs an explicit valid trigger/decision | EPIC-01 |
| C-08 | P1 hardening | `AMS_TEST_*` settings are present in production execution graph | EPIC-01 |
| C-09 | P1 PII | `retentionUntil` is nullable; cleanup explicitly skips rows without it | EPIC-02 |
| C-10 | P1 race | stale `sending → pending` recovery reads stale rows, then updates by ID without re-checking stale/status predicate atomically | EPIC-02 |
| C-11 | P1 SEO | District Content Gate treats `contextFacts=[]` as valid because `[].every(...) === true` | EPIC-03 |
| C-12 | P1 SEO/live | Out-of-range catalog pagination can resolve to HTTP 404 after metadata was already generated for the catalog URL; independent live audit observed conflicting robots/canonical | EPIC-03 |
| C-13 | P1 SEO/live | Public home/catalog have Open Graph metadata but no default `og:image`; Twitter falls back to `summary` | EPIC-03 |
| C-14 | P1 structured data | `RealEstateAgent.openingHours` is emitted as Russian display text instead of machine-readable hours/specification | EPIC-03 |
| C-15 | P1 UI | UI typography/token system is far larger than the compact canonical role system | EPIC-04 |
| C-16 | P1 UI | `globals.css` contains many component-specific token families; it acts partly as component CSS storage | EPIC-04 |
| C-17 | P1 UI/a11y | Home composition contains visible `SectionHeader` H2 plus duplicate `sr-only h2`; outer `<section>` wraps `Section`, which itself renders `<section>` | EPIC-04 |
| C-18 | P1 UI architecture | Business analytics dispatch lives inside `packages/ui`; UI Core requires dispatch owner = project layer | EPIC-04 |
| C-19 | P1 UI drift | Disabled journal leaves dead presentation/CSS/tokens and a journal-named token leaks into property gallery | EPIC-04 |
| C-20 | P1 SOT | Runtime/public-indexing/docs/deployed-SHA/readiness language is inconsistent; `AGENTS.md` also contains stale command guidance | EPIC-05 |
| C-21 | ALREADY_COVERED + verify | Persistent staging was retired by owner decision; current Architecture/Operations already require disposable isolated non-production proof for risky migrations/auth/parser/runtime work | EPIC-05 verifies and exercises the existing contract; it does not recreate persistent staging |

## 2.2 Important severity clarification

`C-01` is a **P0 release gate for real feed activation**, not proof that production inventory is currently being damaged.

Current project readiness shows real feed integration is not operationally activated.

Nevertheless:

```text
the engine invariant is wrong
→ real feed must not be activated until C-01 is closed
```

---

# 3. INDEPENDENT AUDIT ITEMS NOT CARRIED AS CONFIRMED DEFECTS

These points were independently reported but were not reproduced against the current audited `main`, so Codex must not treat them as already-proven defects.

## R-01 — sitemap `lastmod = request time`

Not reproduced.

Repeated live fetch on 2026-09-28 returned stable values such as:

```text
2026-09-28T08:34:20.754Z
2026-09-24T00:00:00.000Z
```

Disposition:

```text
do not rewrite sitemap timestamps blindly
add regression proof:
same unchanged resource across repeated requests → same lastmod
lastmod must represent meaningful content/data update
```

## R-02 — public images have no responsive `srcset`

Not reproduced on current code.

Current implementation already contains:

```text
media variants
srcSet
sizes
responsive media verifier
```

Disposition:

```text
do not replace media stack
prove LCP/CLS and actual responsive output
fix only demonstrated gaps
```

## R-03 — `AMS_TEST_*` is an active production bypass

Not reproduced as an exploit.

`parseTestApprovedOrigins()` currently returns `[]` in `NODE_ENV=production`.

But the test configuration still enters production handler types/call graphs.

Disposition:

```text
keep as P1 boundary hardening
production runtime must fail-fast if test-only env exists
production handlers should not forward test-only settings
```

## R-04 — `components.json` aliases necessarily require package exports

Not confirmed.

Current `packages/ui/tsconfig.json` maps:

```text
@ams/realtbase-ui/* → ./src/*
```

and the existing UI guard validates the intended aliases.

Disposition:

```text
verify aliases resolve in shadcn workflow
do not add public package exports only to satisfy a theoretical complaint
```

---

# 4. AUTONOMOUS EXECUTION CONTRACT FOR CODEX

The objective is to let Task Manager Developer complete all safe approved
engineering and plan-authorized delivery work without stopping between EPICs.
Production is not part of the autonomous implementation graph.

## 4.1 No intermediate production

Forbidden until EPIC-05 final release:

```text
production deployment
production migrations
DNS mutation
production feed activation
production lead-channel activation
destructive production data operation
```

Merges to `main` are allowed only after exact owner approval of this version,
clean Task Manager import/reconciliation and the per-EPIC `MERGE_AFTER_GATE`
contract.

`merge != release`.

## 4.2 No mid-plan owner questions

If a task encounters missing external evidence or an owner-only production dependency:

```text
do not stop the engineering program
do not ask in the middle of EPIC-01…04
implement fail-closed behavior
record FINAL_GATE dependency
continue
```

Only the separate production-only gate may stop on an unavailable
owner/external prerequisite. EPIC-05 ends with a release candidate and evidence,
not with a production mutation.

Examples:

```text
external monitoring provider
production owner bootstrap credentials
canonical NAP confirmation
Secret Master mutation
raw-SQL owner exception not already approved
```

## 4.3 Branch / PR rhythm

For every large EPIC:

```text
1. Update from canonical SourceCraft main.
2. Record exact base SHA.
3. Create one EPIC branch/worktree.
4. Perform full EPIC scope.
5. Run focused proof.
6. Run focused local proof required by the EPIC contract.
7. Self-review full diff against Core 5.5 + UI Core 5.0.
8. Create one PR.
9. Run exactly one exact-head SourceCraft STANDARD/RISKY gate.
10. Merge PR to main only after green exact-head proof and only when the
    APPROVED inventory marks the EPIC `MERGE_AFTER_GATE`.
11. Update local baseline from merged main.
12. Start next EPIC.
```

No production rollout after merge.

## 4.4 Do not invent commands

Before running a command:

```text
read current package.json
confirm script exists
```

At audited baseline, these relevant scripts do exist:

```text
verify
verify:schema
verify:daily
verify:merge-standard
verify:merge-risky
verify:ui-core
quality:design-tokens
quality:architecture
quality:guards
verify:drift
verify:performance
verify:responsive-media
verify:seo-contracts
verify:seo-crawl
verify:navigation
verify:final-release-contract
```

If `main` changes, verify again.

## 4.5 Documentation is part of every EPIC

Every merged EPIC must update only the Source-of-Truth affected by the change.

Do not create parallel master plans for individual tasks.

Historical proof files remain historical.

---

# EPIC-01 — DATA INTEGRITY, IMPORT ATOMICITY & ACCESS BOUNDARIES

**Priority:** P0/P1  
**Risk:** `RISKY`  
**Merge:** one PR  
**Production:** forbidden  
**Goal:** make import and privileged application operations conform to the Core Hard Contract.

This EPIC must close:

```text
C-01
C-03
C-06 for ingest/jobs
C-07
C-08
```

---

## TASK-01.1 — Version-sensitive Payload transaction decision

Before implementation, verify against the exact installed Payload version:

```text
payload = 3.90.1
@payloadcms/db-postgres = 3.90.1
```

Determine the supported exact mechanism for executing all import-finalization writes in the **same PostgreSQL transaction/session**.

Required proof must cover:

```text
Payload transaction ID/context
Local API writes in transaction
approved SQL executed in the same transaction/session when SQL is retained
commit
rollback
```

Do not accept a mocked proof.

Pinned-contract requirement:

```text
Payload Local API writes
→ one PayloadRequest carrying the exact transactionID

retained raw SQL
→ must prove use of the same adapter transaction/session
→ payload.db.drizzle.execute without a transaction-bound executor is not proof

no supported same-session mechanism
→ replace the affected SQL with supported Local API/adapter operations
   OR fail the task and record an owner/architecture decision
```

Official Payload documentation supports direct begin/commit/rollback and
threading `req.transactionID` through Local API calls. It does not by itself
prove that the project's default Drizzle executor participates in that session;
the installed `3.90.1` source/types plus real PostgreSQL rollback proof must do so.

Create/update an ADR that records the exact pinned mechanism.

If Payload exposes a transaction session map/API internally:

```text
verify against official/current version behavior
pin the dependency assumption in tests
```

Do not silently depend on an undocumented field without an ADR and guard.

---

## TASK-01.2 — Import transaction is mandatory

Current engine allows:

```ts
beginImportTransaction?.()
```

and permits all transaction hooks to be absent.

Change the invariant:

```text
mutating fetched import
→ transaction capability required
→ valid transaction ID required
→ otherwise fail before inventory write
```

`304/unchanged` may remain outside a mutating transaction if it performs no inventory mutation and its small state update is safely atomic.

Acceptance:

```text
missing hooks → 0 inventory writes
invalid transaction ID → 0 inventory writes
commit/rollback functions missing → fail before writes
```

---

## TASK-01.3 — Atomic full-run finalization

For a full mutating run, one transaction must own:

```text
offer create/update
lastSeen mutation
safe-deactivation
one-time deactivation approval consumption
import-run terminal transition
full-run safety baseline update
```

The following safety baseline values must not diverge from committed inventory:

```text
lastFullRunAt
lastOfferCount
lastFeedHash
lastEtag / lastModified where applicable
last successful/contact state that controls future safety decisions
```

Heartbeat remains outside the ingest transaction so an independent observer can see liveness.

Acceptance:

```text
interrupted run cannot own committed deactivations
failed run cannot own committed full-run deactivations
rollback cannot consume approval
successful full run cannot retain stale safety baseline
```

---

## TASK-01.4 — Post-commit cache errors cannot rewrite data truth

Required sequence:

```text
ATOMIC DATA FINALIZATION
→ COMMIT
→ cache invalidation
→ operational warning/alert if cache invalidation fails
```

After commit:

```text
cache error ≠ import failed
```

A post-commit exception must never execute a false `finishRun("failed")`.

If cache result needs persistence, use the smallest existing operational diagnostic field/record possible.

Do not create a new event platform.

---

## TASK-01.5 — Deterministic import error state

Current catch path can call `finishRun` again.

Build one explicit state machine:

```text
before commit failure
→ rollback
→ one guarded running→failed transition

after commit failure
→ data terminal state is immutable
→ operational error only
```

No double terminal transition.

Janitor remains a recovery path for a genuinely crashed worker, not a normal exception handler.

---

## TASK-01.6 — `overrideAccess` constitutional boundary

Core Hard Contract:

```text
overrideAccess:true
→ ONLY System Gateway
```

Current whitelist in `architecture-guard.mjs` explicitly allows exceptions in:

```text
project/jobs
core/data-access/leads
core/data-access/public
core/ingest/payload-feed-ingest-repository
core/leads/deliver-lead
```

This guard currently encodes the drift instead of rejecting it.

Refactor.

Preferred rule:

```text
Public Gateway
→ overrideAccess:false

Ingest Gateway
→ explicit access mode/access-rule path
→ no overrideAccess:true

Lead public intake
→ explicit intake access mode/access-rule path
→ no overrideAccess:true

system maintenance / jobs / trusted privileged mutation
→ named function under src/core/data-access/system
→ overrideAccess:true only there
```

Do not merely move an import statement.

Privileged operation ownership must physically live under System Gateway or use an explicit normal access rule.

After refactor, remove the architectural whitelist exceptions that normalize the violation.

---

## TASK-01.7 — Raw SQL register and governance

Current private SQL layers contain multiple operations.

ADR-0011 authorizes exactly two **additional** narrow recovery operations:

```text
interruptRecoverableImportRun
claimPendingDeliveryRecoveryLease
```

Do not incorrectly claim ADR-0011 approves every raw SQL operation.

Build a complete SQL register:

```text
operation
file
purpose
atomic/performance trigger
input type
PII?
user input?
can Local API replace it?
decision source / ADR
integration proof
```

For every SQL operation:

```text
IF supported Payload Local API can satisfy invariant
→ revert to Local API

ELSE IF raw SQL is truly required
→ keep named, parameterized, private
→ explicit ADR/owner-decision mapping
→ integration proof
```

No generic `query(string)` API.

Do not expand raw SQL surface during this EPIC unless unavoidable for C-01 and formally justified.

If a new owner exception is required:

```text
record FINAL_GATE_OWNER_DECISION
continue all non-production work
do not block next EPIC
```

---

## TASK-01.8 — Production graph must exclude test-only bypass configuration

Current safety helper blocks test origins in production, but production handlers still receive:

```text
AMS_ALLOW_TEST_DESTINATIONS
AMS_TEST_APPROVED_ORIGINS
```

Change to:

```text
production runtime
→ if any AMS_TEST_* variable is present → fail-fast configuration error
```

and remove test-only values from production handler input wherever possible.

Integration test code keeps the test-only mechanism.

Acceptance:

```text
NODE_ENV=production + AMS_TEST_* → startup/config FAIL
test/integration environment → loopback-only test destination still works
```

---

## TASK-01.9 — Import integration proof on real PostgreSQL

Mandatory isolated PostgreSQL scenarios:

```text
transaction unavailable → no writes
parser truncation → rollback
budget overflow after write → rollback
approval consume + forced rollback → approval unconsumed
safe deactivation + forced rollback → no archived rows
atomic success → inventory + terminal run + baseline visible together
forced crash before commit → next janitor marks interrupted, no deactivation
post-commit cache failure → run remains committed success state
two workers → one claim
heartbeat visible from independent connection
```

Mock tests are not sufficient for C-01.

---

## EPIC-01 required checks

Confirm commands exist, then run applicable:

```bash
pnpm verify:feed-parser
pnpm verify:feed-ingest
pnpm verify:feed-lifecycle
pnpm verify:manual-ownership
pnpm verify:operational-recovery
pnpm verify:security-boundaries
pnpm quality:architecture
pnpm quality:guards
pnpm verify:schema
pnpm verify:merge-risky
```

Then:

```text
full diff review
exact-head SourceCraft RISKY gate
PR
merge to main
NO DEPLOY
```

---

# EPIC-02 — LEADS, OUTBOX, DELIVERY RECOVERY & PII RETENTION

**Priority:** P1  
**Risk:** `RISKY`  
**Merge:** one PR  
**Production:** forbidden  
**Goal:** ensure a lead is atomically saved, never accidentally cross-queues another lead's delivery, and cannot escape retention.

Closes:

```text
C-04
C-05
C-06 lead-side
C-09
C-10
```

---

## TASK-02.1 — Transactional outbox must fail closed

Current repository accepts missing/invalid transaction capability.

Required precondition before first write:

```text
beginTransaction exists
commitTransaction exists
rollbackTransaction exists
valid transaction ID obtained
```

Otherwise:

```text
throw safe internal failure
lead writes = 0
delivery writes = 0
```

Remove optional transaction semantics from the critical outbox path.

Acceptance:

```text
lead + all enabled-channel delivery rows = one commit
one delivery failure = whole local transaction rollback
```

Preserve idempotent race recovery.

---

## TASK-02.2 — Immediate enqueue only owns current commit

Current public submission does:

```text
commit current lead
→ global findPendingDeliveriesWithoutJob(limit 50)
→ enqueue everything found
```

This means one anonymous form submission may accelerate unrelated orphan deliveries.

Change design:

```text
commitLeadOutbox returns the deliveries created/reused for THIS lead
→ immediate best-effort enqueue only those newly-created current deliveries
```

Global orphan recovery remains exclusively in:

```text
recoverLeadDeliveries maintenance job
```

No global sweep from public POST.

Acceptance:

```text
lead A submit cannot enqueue lead B orphan
```

---

## TASK-02.3 — Make PII retention boundary mandatory

Current model:

```text
retentionUntil optional
cleanup:
if !retentionUntil → skip forever
```

Required:

```text
new lead → retentionUntil always present
```

Use project canonical:

```text
leadRetentionDays = 100
```

Implement an expand/backfill migration for existing `NULL` rows.

Backfill rule:

```text
retentionUntil = createdAt + canonical retention days
```

Do not extend old PII by using migration time as the start.

If the calculated retention date is already expired:

```text
normal cleanup should process it
```

After backfill, make the data contract fail closed for future writes.

If database `NOT NULL` is safe after migration, enforce it.

---

## TASK-02.4 — Atomic stale `sending` recovery

Current flow:

```text
read sending + stale heartbeat
→ later update by ID
```

Race:

```text
live worker can deliver/refresh after read
→ recovery update can overwrite newer state
```

Required recovery mutation:

```text
WHERE
  id = ?
  AND status = sending
  AND heartbeatAt < staleThreshold
```

plus affected-row check.

Preferred:

```text
Payload supported conditional Local API
```

If pinned Payload cannot prove it atomically:

```text
named narrow System Gateway operation
+ explicit ADR/owner mapping
+ two-worker integration proof
```

Do not reuse ADR-0011 as blanket authorization.

---

## TASK-02.5 — Fraud fingerprint key domain separation

Current public intake uses:

```text
PAYLOAD_SECRET
```

directly as fraud-HMAC key.

Do not create a new operational secret unless needed.

Preferred solo-safe solution:

```text
derive a deterministic dedicated sub-key from PAYLOAD_SECRET
with a fixed versioned context:
"don-city:lead-fraud:v1"
```

Use a standard cryptographic derivation/HMAC construction.

This produces cryptographic domain separation without increasing Secret Master burden.

If exact threat model requires an independent secret, document why and defer its production value to FINAL_GATE.

---

## TASK-02.6 — Zero delivery channel operational truth

Current project may accept and persist a lead while no outbound delivery channel is active.

That local-save behavior is valid, but it must be operationally visible.

Add health/alert/readiness signal:

```text
public lead intake enabled
+
enabled delivery channels = 0
→ warning: lead_delivery_channel_unconfigured
```

Do not reject a safely persisted lead merely because messenger/CRM is unavailable.

Do not claim lead delivery is operationally ready until at least one approved channel exists.

---

## TASK-02.7 — PII and diagnostic regression proof

Verify:

```text
lead PII absent from ordinary logs
lead PII absent from analytics
delivery lastErrorRedacted contains no PII/token/body
retention purge handles linked delivery diagnostics
idempotency survives retries
form success remains based on confirmed local save
```

---

## EPIC-02 required checks

```bash
pnpm verify:lead-intake
pnpm verify:lead-context
pnpm verify:lead-outbox
pnpm verify:lead-delivery-state
pnpm verify:owner-operations
pnpm verify:health-alerts
pnpm verify:operational-recovery
pnpm verify:security-boundaries
pnpm verify:schema
pnpm verify:integration:required
pnpm verify:merge-risky
```

Then:

```text
full diff review
exact-head SourceCraft RISKY gate
PR
merge to main
NO DEPLOY
```

---

# EPIC-03 — SEO, INDEXABILITY & PUBLIC HTTP OUTPUT

**Priority:** P1  
**Risk:** `STANDARD` unless route/data architecture changes materially  
**Merge:** one PR  
**Production:** forbidden  
**Goal:** make the actual rendered HTTP output match the otherwise-strong SEO architecture.

Closes:

```text
C-11
C-12
C-13
C-14
```

---

## TASK-03.1 — District Content Gate must fail closed

Runtime condition must require:

```text
district
→ contextFacts exists
→ contextFacts.length >= 1
→ every fact has non-empty source
→ every fact has valid checkedAt
```

Empty array is a fail.

Apply the same requirement at Payload owner-approval boundary.

Required negative cases:

```text
undefined
[]
blank source
invalid date
mixed valid + invalid
```

Validate effect on:

```text
robots
canonical
sitemap eligibility
internal link promotion
```

Do not change inventory thresholds or 30-day inventory grace policy.

---

## TASK-03.2 — Out-of-range pagination HTTP/metadata consistency

Current architecture can determine metadata before catalog total is known.

Current live route:

```text
/donetsk/kvartiry/?page=2
```

returns 404 when only one page exists.

Independent live audit observed conflicting robots and a canonical for the missing page.

Required invariant for any out-of-range pagination URL:

```text
HTTP 404
exactly one effective robots policy = noindex
no canonical to the nonexistent URL
no index,follow meta
```

Avoid duplicate DB/catalog work where possible.

Preferred design:

```text
one shared request-scoped resolver/state
used by generateMetadata + page rendering
```

or another Next.js-safe mechanism that makes status and metadata agree.

Do not introduce an unbounded cross-request cache for page totals. Next.js
officially memoizes identical `fetch` calls during rendering and permits
`React.cache` when `fetch` is not suitable; the selected mechanism must preserve
the project's existing invalidation/data-freshness contract.

Do not convert a truly missing page into a fake 200.

---

## TASK-03.3 — Default project Open Graph image

Current live home/catalog expose:

```text
og:title
og:description
og:url
```

but no `og:image`.

Create/choose one project-owned factual default social image.

Requirements:

```text
1200×630 preferred
DON CITY-owned brand asset
no unverified property image
no donor asset
```

Metadata behavior:

```text
property with valid primary media
→ property image

otherwise
→ project default social image
```

Twitter:

```text
summary_large_image when image exists
```

404 may use the project image if desired, but must remain noindex and must not gain a canonical to the missing URL.

---

## TASK-03.4 — Factual RealEstateAgent structured data

Current builder emits:

```ts
openingHours: "Пн–Пт: 09:00–18:00; Сб–Вс: 09:00–18:00"
```

That string is display copy, not the canonical machine-readable schedule format.

Change public NAP contract or builder so structured data uses:

```text
openingHoursSpecification
```

with factual day/time values.

Keep human-readable opening-hours display separately.

Add only facts that are verified:

```text
logo → approved project asset
image → approved project asset if appropriate
geo → only if coordinates are verified
sameAs → only official verified profiles
```

Never fabricate `geo` or `sameAs`.

---

## TASK-03.5 — Robots query hygiene

Current robots `Clean-param` covers tracking params.

Review actual public query grammar.

If `sort` is a real crawlable query parameter and always non-semantic:

```text
add sort to Clean-param
```

If it is not part of the actual public URL surface:

```text
do not add speculative params
```

Preserve:

```text
/admin/ disallow
/api/ disallow
/api/media/file/ allow exception
root sitemap
```

---

## TASK-03.6 — Sitemap lastmod regression, not rewrite

Because the request-time defect was not reproduced:

do not redesign sitemap timestamp ownership.

Add proof:

```text
unchanged content across repeated requests
→ same lastmod

property update
→ meaningful property lastmod advances

registry/content update
→ corresponding logical page lastmod advances
```

No `new Date()` request-time timestamp for every URL.

---

## TASK-03.7 — Complete route-class SEO matrix

Test:

```text
/
static commercial pages
/donetsk/
/donetsk/kvartiry/
/donetsk/doma/
/donetsk/uchastki/
district pages
approved facets
?page=1
?page=2 valid
?page=N out of range
random query parameters
deep filters
active property
archived property
redirect property
410 property
404 unknown route
privacy/consent/legal pages
```

For each relevant URL:

```text
status
redirect chain
title
description
canonical
meta robots
X-Robots-Tag
OG
Twitter
one logical H1
heading hierarchy
structured-data parse
sitemap membership
internal link policy
```

---

## EPIC-03 required checks

```bash
pnpm verify:seo-content-gate
pnpm verify:seo-contracts
pnpm verify:seo-registry
pnpm verify:sitemap-indexnow
pnpm verify:indexing-policy
pnpm verify:route-resolver
pnpm verify:route-http
pnpm verify:property-lifecycle-routes
pnpm verify:navigation
pnpm verify:factual-structured-data
pnpm verify:seo-crawl
pnpm verify:merge-standard
```

Then:

```text
full diff review
exact-head SourceCraft STANDARD gate
PR
merge to main
NO DEPLOY
```

---

# EPIC-04 — UI CORE 5.0 SYSTEM NORMALIZATION

**Priority:** P1 systemic drift  
**Risk:** `RISKY` because token contract affects broad public UI  
**Merge:** one PR  
**Production:** forbidden  
**Goal:** normalize the existing design without redesigning DON CITY.

Closes:

```text
C-15
C-16
C-17
C-18
C-19
```

This is not “clean one dead journal component”.

It is a controlled Design Intake normalization of the current public UI.

---

## TASK-04.1 — Targeted Design Intake normalization from actual UI

Reuse the existing Project Design System and run one targeted normalization
pass for the material Core 5.0 drift. Do not create a second design source or
restart a new-foundation workflow.

Inventory actual current system:

```text
colors
semantic surfaces
typography sizes
line heights
tracking
font weights
section spacing
container widths
radii
shadows
motion durations/easing
media ratios
controls
repeated patterns
```

Generate a report before changing values.

At audited baseline:

```text
globals.css variables ≈ 563
typography/text/leading/tracking-related variables ≈ 200+
```

The exact number is diagnostic, not a target.

Goal:

```text
compact semantic system
not arbitrary numerical minimization
```

---

## TASK-04.2 — Normalize typography roles

UI Core canonical baseline:

```text
text-h1
text-h2
text-h3
text-h4
text-body-lg
text-body
text-body-sm
text-label
text-caption
```

Current project has many roles such as:

```text
text-display-*
text-section-*
text-heading-*
text-card-*
text-body-large
text-body-compact
text-body-dense
text-caption-tight
text-caption-dense
...
```

Normalize.

Rules:

```text
canonical roles first
minimal project-specific roles only where actual visual requirement proves need
every extra role documented in DESIGN.md
font weight remains separate
similar sizes collapse
random responsive font-size ladder removed
```

Micro sizes such as:

```text
8px
8.5px
9px
10px
10.45px
10.5px
```

must be:

```text
removed
OR
retained only as an explicit documented exception with accessibility rationale
```

Do not preserve them merely because they already exist.

Preserve visual intent as closely as possible.

---

## TASK-04.3 — Normalize semantic colors/surfaces/shadows

`globals.css` is the value source but currently includes many component-owned families such as:

```text
--catalog-mortgage-help-card-*
--catalog-new-building-selection-*
--legal-hub-*
--html-sitemap-*
--property-card-*
...
```

UI Core:

```text
globals.css is not a warehouse for component-specific CSS
```

Refactor repeated values to semantic project roles:

```text
surface
surface-raised
surface-subtle
content-strong/default/subtle
border
action
status
shadow-card
shadow-raised
shadow-dialog
etc.
```

A component-specific token may remain only when:

```text
the visual role cannot be represented semantically
AND
the exception is documented
```

Consolidate duplicate gray/neutral systems into one semantic palette plus explicit brand roles.

Do not change brand identity.

---

## TASK-04.4 — Canonical Section ownership

Current home code includes patterns like:

```tsx
<section ...>
  <Section>
    ...
  </Section>
</section>
```

but `Section` itself defaults to:

```html
<section>
```

This produces nested semantic sections.

Also:

```text
SectionHeader renders visible h2
+
page adds sr-only h2 for aria-labelledby
```

Fix ownership.

Preferred API:

```text
Section owns:
id
aria-labelledby
space
surface/className

SectionHeader owns:
titleId
one actual h2
```

No duplicate hidden H2.

Result:

```text
one semantic section per meaningful section
one heading that labels it
logical heading hierarchy
```

Audit Home, Catalog, Marketing, Property, Legal.

---

## TASK-04.5 — Move business analytics dispatch out of reusable UI

UI Core requires:

```text
Dispatch owner = project layer
Reusable UI does not send business analytics events itself
```

Current:

```text
packages/ui/src/analytics*.*
CatalogPageView → AnalyticsViewEvent
```

Refactor.

Allowed pattern:

```text
packages/ui
→ presentation + typed UI intent/data attributes/callback contracts

src/project or app project layer
→ analytics event construction
→ browser dispatch
```

A good low-coupling solution is project-owned event delegation over stable data attributes, but Codex may choose another simple design.

Requirements:

```text
no PII
typed event names
UI package does not own business dispatch
no analytics provider dependency in reusable UI
```

---

## TASK-04.6 — Disabled journal presentation cleanup

Project module state:

```text
journal = disabled
manifest = none
```

Remove unreachable public presentation:

```text
HomeArticlesPreviewView
home-articles.css
```

if still unconsumed.

Remove inactive journal/home-articles visual tokens.

Keep frozen journal DTO/contracts only if they are intentionally allowed future module contracts.

Replace property gallery dependency on:

```text
--home-articles-chip
```

with the real shared semantic surface/control token.

---

## TASK-04.7 — Section rhythm and design literal guard

UI Core requires:

```text
Section rhythm = sm / md / lg / hero
values only in globals.css
```

Extend guard coverage to catch project-authored literal design rhythm in non-token CSS:

```text
section vertical padding
repeated design margins
repeated gaps
font-size
font-weight
radii
colors
motion durations
```

Do not ban legitimate structural geometry:

```text
%
fr
auto
aspect-ratio
grid relationships
intrinsic size calculations
```

Add positive/negative fixtures to prevent false positives.

---

## TASK-04.8 — Motion normalization

UI Core default:

```text
Tailwind built-in duration scale
semantic easing allowed
transform/opacity default
prefers-reduced-motion required
```

Audit custom duration scale.

Remove redundant project duration roles where built-in Tailwind scale is sufficient.

Keep documented project easing only when useful.

---

## TASK-04.9 — Responsive media: prove, do not rewrite

Current code already has:

```text
variants
srcSet
sizes
priority/fetchPriority
responsive media tests
```

Do not replace it with `next/image` merely because another audit assumed plain PNG output.

Instead prove:

```text
critical first image priority
noncritical images lazy
valid srcset where variants exist
sizes match layout
width/height or aspect containment prevents CLS
fallback works
```

Measure representative production-like mobile pages:

```text
Home
Catalog
Property
```

Budget:

```text
LCP <= 2.5 s
CLS <= 0.1
```

If performance proof fails, make the smallest evidence-driven fix.

---

## TASK-04.10 — shadcn foundation and aliases

Keep one primitive system.

Verify current:

```text
packages/ui/components.json
tsconfig aliases
package internal source paths
shadcn update/add workflow
```

Do not add public exports solely to mirror internal aliases unless the actual tool workflow requires it.

Guard:

```text
second Button/Input/Dialog/Card/Table = forbidden
```

---

## TASK-04.11 — Optional client ownership cleanup

Only after UI tests are green, clean low-risk starter naming if it materially improves ownership:

```text
StarterHomePageView
StarterCatalogPageView
StarterPropertyPageView
StarterMarketingPageView
```

Public package export names are already client-neutral.

Do not churn imports solely for aesthetics if it increases risk.

---

## TASK-04.12 — DESIGN.md final normalization

Fill/repair actual UI Core sections:

```text
4.1 Visual Character
4.2 Status
4.3 Typography
4.4 Containers
4.5 Section Rhythm
4.6 Surfaces/Shadows
4.7 Radii
4.8 Buttons
4.9 Forms
4.10 Media
4.11 Icons
4.12 Motion
4.13 Dark Mode
4.14 Journal = NOT_APPLICABLE while disabled
4.15 Shared Patterns
4.16 Approved Exceptions
```

Policy only in docs.

Numbers remain in `globals.css`.

---

## EPIC-04 required checks

```bash
pnpm verify:ui-core
pnpm quality:design-tokens
pnpm quality:architecture
pnpm quality:guards
pnpm verify:canonical-shell
pnpm verify:marketing-headings
pnpm verify:dead-ui-cleanup
pnpm verify:ui-accessibility
pnpm verify:a11y-starter
pnpm verify:responsive-media
pnpm verify:performance
pnpm verify:drift
pnpm verify:seo-contracts
pnpm typecheck
pnpm lint
pnpm build
pnpm verify:merge-risky
```

Then:

```text
full UI diff review against UI Core 5.0
representative visual comparison
exact-head SourceCraft RISKY gate
PR
merge to main
NO DEPLOY
```

---

# EPIC-05 — OPERATIONS, SOURCE OF TRUTH & RELEASE CANDIDATE

**Priority:** P0/P1 operational  
**Risk:** `RISKY`  
**Merge:** one final remediation PR if docs/release code changes remain  
**Delivery mode:** `MERGE_AFTER_GATE` after exact plan approval  
**Production:** forbidden inside this EPIC  
**Goal:** turn merged remediation code into an exact, evidence-backed release candidate and stop before production mutation.

Closes:

```text
C-02
C-20
C-21
all FINAL_GATE dependencies from EPIC-01…04
```

---

## TASK-05.1 — Fix project execution/router documentation

Reconcile:

```text
AGENTS.md
docs/PROJECT.md
docs/OPERATIONS.md
docs/DESIGN.md
docs/03_ARCHITECTURE.md
docs/04_BACKLOG.md
docs/05_RELEASE_CHECKLIST.md
docs/DELIVERY_STATE.yaml
docs/README.md
current master plan pointer
ADR index
```

`AGENTS.md` currently contains stale guidance:

```text
runtime commands appear after EPIC-01
do not invent before starter clone
```

but the project is already live and `package.json` has the command set.

Update router to current reality.

Do not rewrite historical evidence files.

---

## TASK-05.2 — Separate production state concepts

Docs must distinguish:

```text
OBSERVED PUBLIC STATE
DEPLOYED ARTIFACT IDENTITY
CODE MAIN STATE
OPERATIONAL READINESS
REAL FEED READINESS
LEAD DELIVERY READINESS
```

Remove contradictory heading such as:

```text
Current Blockers Before Indexing
```

when public indexing is already intentionally active.

Replace with:

```text
Open production-readiness / operational evidence
```

unless indexing is actually reverted by explicit owner decision.

---

## TASK-05.3 — Ephemeral on-demand staging contract

Persistent staging remains retired.

Project staging model becomes explicit:

```text
stagingMode = EPHEMERAL_ON_DEMAND
persistentStaging = false
```

Staging is mandatory before production when change contains:

```text
migration/schema
auth/access
parser/source identity
major framework/Payload/DB upgrade
critical jobs/recovery behavior
other Core-defined RISKY release requiring staging
```

Staging requirements:

```text
separate disposable DB
non-production secrets
test/sanitized data
noindex
restricted access
no production PII dump
separate/non-production storage identity where media behavior is tested
JOBS_AUTORUN explicitly controlled
exact candidate SHA/image
cleanup proof
```

SourceCraft Space is development, not automatically staging.

---

## TASK-05.4 — Run exact candidate staging proof

Because this remediation includes risky engine/access and likely retention migration work:

create a disposable isolated staging proof for the final `main` candidate.

Run:

```text
migration from clean/representative pre-change state
migration rollback/restore plan validation where applicable
import atomic crash tests
lead outbox transaction proof
retention backfill proof
access matrix
jobs ownership
SEO HTTP matrix
UI production-like build
```

Destroy disposable staging resources after evidence capture.

---

## TASK-05.5 — External uptime monitoring Hard Contract

Current config:

```ts
externalMonitoring: false
```

This violates Core HC#28.

Before production release:

configure/prove an independent monitor outside the application VPS.

Provider is not hardcoded by this plan.

Requirements:

```text
public availability probe
external execution origin
independent alert destination
documented check interval / failure threshold
test alert proof
no app secret in probe
```

Only after durable proof:

```ts
externalMonitoring: true
```

Update guards so active production cannot regress to `false`.

If no external provider/account is available:

```text
finish every other EPIC and final verification
STOP ONLY AT FINAL PRODUCTION GATE
report exact missing prerequisite
```

Do not block EPIC-01…04.

---

## TASK-05.6 — Production owner / admin access proof

Read-only verify:

```text
first production owner exists
Payload login works
owner role exists
login lockout/rate control exists
Admin noindex
Nginx admin policy is actually applied
```

Tracked template may retain:

```text
__ADMIN_ACCESS_POLICY__
```

but deployed Nginx must not contain an unresolved placeholder.

If owner bootstrap is still absent:

```text
use existing controlled bootstrap operation
with owner-supplied secure credentials
no credential in Git/evidence
```

This is FINAL_GATE only.

---

## TASK-05.7 — Canonical NAP verification

Verify factual production NAP:

```text
brand/legal name
phone
email
address
opening hours
canonical URL
```

Do not guess.

Only verified facts may enter:

```text
public pages
RealEstateAgent JSON-LD
legal docs
```

If `geo` / `sameAs` are unavailable, omit them.

---

## TASK-05.8 — Exact deployed identity contract

Before rollout, final `main` must be clean and exact.

SourceCraft builds immutable:

```text
runtime:<full SHA>
migration:<full SHA>
```

Production runbook:

```text
pull exact tag
resolve digest
pin compose by digest
migration image = same SHA
JOBS_AUTORUN=false for migration
single persistent application/jobs runtime
```

After deploy capture:

```text
running image digest
org.opencontainers.image.revision
exact SourceCraft main SHA
jobs owner count
timestamp
rollback image
```

Bind it to `DELIVERY_STATE.yaml` / approved release evidence.

---

## TASK-05.9 — Final main proof before release

From clean canonical `main`:

confirm all scripts exist and run the full applicable suite.

Minimum:

```bash
pnpm verify:schema
pnpm verify:ui-core
pnpm verify:seo-contracts
pnpm verify:seo-crawl
pnpm verify:security-boundaries
pnpm verify:operational-recovery
pnpm verify:production-topology
pnpm verify:transport-security
pnpm verify:release-artifact
pnpm verify:final-release-contract
pnpm verify
```

For required DB integration:

```text
SKIPPED ≠ PASS
```

Use the required isolated DB proof path.

Any failed check:

```text
fix on branch
PR
exact-head gate
merge
repeat final proof
```

Still no production until all final code gates are green.

---

# 9A. PRODUCTION-ONLY RELEASE GATE — EXCLUDED FROM AUTONOMOUS GRAPH

This gate is not an implementation task and is not claimable by Task Manager
Developer. It begins only after EPIC-05 is complete, the exact candidate remains
unchanged and the owner gives a separate explicit production release command.
Unavailable production credentials, monitoring, NAP or owner access block only
this gate. They do not reopen completed engineering work.

## PROD-01 — One production release

Only now.

Sequence:

```text
1. owner release command
2. verify exact clean main
3. confirm final immutable images/digests
4. fresh validated DB backup
5. verify media backup/freshness
6. run versioned migrations using ephemeral migration image
7. remove migration runtime
8. replace single production application service in place
9. prove exactly one JOBS_AUTORUN owner
10. authenticated health
11. bounded public smoke
12. SEO/lifecycle live crawl
13. monitor/alert proof
14. bind deployed SHA/digest
```

No second production runtime.

No build/install/git pull on host.

---

## PROD-02 — Live post-release acceptance

Immediately in the same release operation, not as a later “monitoring phase”:

Verify:

```text
homepage 200
robots
sitemap index
all non-empty shards
catalog
property
404
410 fixture/path if available
Admin boundary
lead local save smoke with approved safe test path
health
jobs owner
backup freshness
```

SEO live matrix:

```text
canonical
robots
OG
Twitter
H1
JSON-LD
pagination 404 behavior
sitemap membership
```

If bounded smoke fails:

```text
automatic known-good application rollback
follow migration-specific rollback/restore plan
record failure
```

---

# 10. DEPENDENCY / AUTONOMY POLICY

The program is a DAG, not a claim that every EPIC is independent and not an
unnecessary whole-EPIC serial chain.

## 10.1 Dependency matrix

| Work | Depends on | Type / minimum blocking scope | Parallel-safe work | Fallback / stop |
|---|---|---|---|---|
| TASK-01.1 transaction contract | exact Payload 3.90.1 docs/types + real PostgreSQL proof | `EXTERNAL/CONTRACT`; contract task only | SEO/UI inventories | no supported same-session mechanism → no import mutation implementation |
| EPIC-01 remaining implementation | TASK-01.1; TASK-01.7 for retained SQL | `HARD` only for writes sharing transaction/SQL ownership | EPIC-03 and EPIC-04 inventories | fail closed; real feed remains disabled |
| EPIC-02 transaction/outbox | TASK-01.1 transaction carrier contract | `CONTRACT`; lead transaction tasks only | EPIC-03/04 | no valid transaction → zero lead/delivery writes |
| TASK-02.4 stale recovery | TASK-01.7 SQL governance only if Local API cannot prove atomic predicate | `CONTRACT/OWNER`; affected task only | every other EPIC-02 task | defer only this mutation; continue safe work |
| EPIC-03 | current route/SEO registry baseline | no whole-EPIC dependency on EPIC-01/02 | EPIC-01/02 and most EPIC-04 work | preserve current page-level fail-closed policy |
| TASK-04.4 Section/headings | TASK-03.7 frozen route/heading matrix | `CONTRACT`; shared page/heading files only | token inventory, analytics ownership, journal cleanup | preserve current UI until contract is frozen |
| EPIC-04 remaining work | current Project Design System + targeted intake inventory | `CONTRACT`; no redesign | EPIC-01/02/03 where files do not overlap | revert token/component slice as one unit |
| EPIC-05 | merged exact heads of EPIC-01…04 | `HARD` for integrated candidate/staging proof; docs inventory may begin earlier | early evidence inventory only | no production fallback; keep current production untouched |
| PROD-01/02 | EPIC-05 PASS + exact unchanged main + explicit owner release command + production prerequisites | `PRODUCTION`; excluded from Developer graph | none | no command/prerequisite → stop before mutation |

Cycles: `0` by design. Whole-EPIC dependencies are forbidden when only one task
or frozen contract is required.

## 10.2 Shared-owner serialization

```text
src/project/jobs/tasks.ts
  owner order: EPIC-01 import slice → EPIC-02 recovery slice

src/core/data-access/system/sql + ingest/sql
  owner order: TASK-01.7 SQL register/freeze → affected EPIC-01/02 operations

Payload migrations / generated types
  one migration owner at a time; expand/backfill/enforce is ordered

route metadata / heading composition
  TASK-03.7 contract freeze → TASK-04.4 semantic implementation

globals.css / docs/DESIGN.md
  EPIC-04 owns normalization; EPIC-05 only reconciles final factual state
```

## 10.3 Independent waves

```text
W1 contracts/inventory:
  TASK-01.1, TASK-01.7, EPIC-03 route evidence, EPIC-04 UI inventory

W2 implementation:
  EPIC-01 transaction/import branch
  EPIC-03 SEO branch where shared route contracts are frozen

W3:
  EPIC-02 after the transaction carrier contract
  EPIC-04 after TASK-03.7 for shared headings only

W4:
  EPIC-05 exact integrated candidate, disposable proof and factual docs

W5 production-only:
  PROD-01/02 after separate owner release command
```

If one task blocks, record the exact blocker and release its claim. Continue
another ready task from these waves. External monitoring, production owner
credential, NAP confirmation and raw-SQL exception approval block only their
minimum affected task/gate.

## 10.4 Successor Task Manager graph

- Existing approved/delivered graphs and ledgers remain immutable history in the
  single stealth `.beads` store.
- This plan uses a new stable identity
  `AMS-DON-CITY-CONSTITUTION-REMEDIATION`; it is not an Upgrade of v9/v13.
- Inventory schema v2 must use a collision-free prefix selected and validated
  before import, one `repository_key=don-city-next`, and explicit
  `MERGE_AFTER_GATE` delivery tasks for EPIC-01…05.
- `PROD-01/02` are production-only nodes with `needs-owner`; no autonomous
  implementation task may target them.
- Historical `in_progress` claims from older plan identities must be reconciled
  or explicitly released/frozen before starting the new Developer goal. No
  second writer or second Task Manager store is allowed.
- Required handoff: `Validate → Init/no-op → Import → Reconcile CLEAN`; any ID,
  coverage, cycle or unexpected managed-node drift stops handoff.

---

# 11. MERGE / REVIEW POLICY

Target:

```text
normally 5 remediation PRs: one for each implementation EPIC
```

Normal rule:

```text
one EPIC = one PR
```

Do not split tasks into micro-PRs.

Split an EPIC only if one of these occurs:

```text
independent migration must safely land before a separate incompatible change
review becomes materially unsafe because two unrelated architecture domains are mixed
SourceCraft exact-head proof cannot isolate the risk otherwise
```

Speed must not be achieved by skipping exact-head proof.

Approved delivery policy:

```text
EPIC-01  MERGE_AFTER_GATE / RISKY
EPIC-02  MERGE_AFTER_GATE / RISKY
EPIC-03  MERGE_AFTER_GATE / STANDARD unless architecture/data risk promotes it
EPIC-04  MERGE_AFTER_GATE / RISKY
EPIC-05  MERGE_AFTER_GATE / RISKY
PROD-01/02  needs-owner + production-only; never MERGE_AFTER_GATE
```

This policy becomes authorization only after exact owner approval of the
READY snapshot and clean Task Manager reconciliation. Until then it is planned
policy, not permission to merge.

---

# 12. CODEX STOP CONDITIONS

Codex must stop the current mutation and fail closed if it detects:

```text
production DB identity where test DB expected
production PII entering staging
secret about to be written to Git/log/docs
cross-feed inventory mutation
import without a transaction
new overrideAccess outside System Gateway
generic raw SQL interface
new unapproved external host
second UI primitive library
schema push in production
multiple jobs owners
production rollout before EPIC-05
```

A stop condition inside code does not mean stop the overall remediation program.

Codex should:

```text
record issue
choose safe non-production fallback if possible
continue unrelated tasks
```

---

# 13. REQUIRED AI REPORT FORMAT PER EPIC

## Engine / SEO / Operations EPIC

```text
DONE:
- ...

ACTUALLY CHECKED:
- exact commands and results

MIGRATION / SECURITY:
- ...

NOT CHECKED:
- ...

RISKS / FINAL_GATE_DEPENDENCIES:
- ...

PR:
- branch
- commit
- PR
- exact-head gate
- merge SHA
```

## UI EPIC

```text
REUSED:
CREATED + OWNERSHIP:
VARIANTS ADDED:
TOKENS REMOVED / NORMALIZED:
NEW TOKENS + WHY:
ARBITRARY VALUES + JUSTIFICATION:
RESPONSIVE / STATES / ACCESSIBILITY:
SEO / PAGE CONTRACT:
PERFORMANCE:
ACTUALLY CHECKED:
NOT CHECKED:
RISKS:
PR / GATE / MERGE:
```

Forbidden words without proof:

```text
GREEN
CHECKED
DONE
PASS
```

when the proof was not actually run.

---

# 14. FINAL DEFINITION OF CONSTITUTIONAL COMPLETE

DON CITY may be called aligned with Core 5.5 + UI Core 5.0 only if all conditions below are true.

## Engine

```text
mutating import cannot run without transaction
interrupted import cannot deactivate inventory
baseline cannot advance independently from committed full import
approval consumption is atomic with approved mutation
post-commit cache error cannot falsify run state
```

## Access

```text
overrideAccess:true only inside System Gateway
all Local API calls have explicit access mode
raw SQL has complete named whitelist + valid rationale/decision
test-only bypass config cannot enter production
```

## Leads / PII

```text
lead + deliveries atomic
public POST queues only its own new deliveries
global recovery exists only in maintenance
stale delivery recovery is conditional/atomic
retentionUntil cannot be missing
legacy NULL retention backfilled safely
PII does not survive configured retention
```

## SEO

```text
district gate requires real verified fact
out-of-range pagination = clean 404 + no canonical + one noindex
default OG image exists
structured data is factual/machine-valid
sitemap lastmod is stable/meaningful
full route matrix passes
```

## UI

```text
compact documented typography roles
no uncontrolled component-specific token warehouse
one semantic palette
Section owns section rhythm/semantics
no nested section>section composition
no duplicate visible + sr-only H2 pattern
business analytics dispatch owned by project layer
journal presentation absent while module disabled
responsive media proved
LCP <= 2.5 s
CLS <= 0.1
one shadcn primitive foundation
```

## Operations

```text
automatic backup proved
external uptime monitor proved
ephemeral staging contract proved for risky release
one jobs owner
Admin access policy proved
NAP verified
exact production SHA/image digest bound
```

## Documentation

```text
PROJECT
OPERATIONS
DESIGN
ARCHITECTURE
AGENTS
BACKLOG
DELIVERY_STATE
release checklist
ADR index
```

all describe the same current reality.

---

# 15. FINAL STRATEGY

Do not rebuild DON CITY.

Execute:

```text
repair data invariants
→ repair privileged boundaries
→ repair lead/PII correctness
→ repair live SEO output
→ normalize UI Core systematically
→ prove operations/staging/monitoring
→ converge documentation
→ ONE final production release
```

This is the shortest safe route from the current project to a constitution-clean solo + AI production system.

---

# 16. TASK MANAGER ARCHITECT FINAL AUDIT — v1

## 16.1 Master Plan Map

```text
Primary goal:
  close evidence-backed Core 5.5/UI 5.0 defects on exact main@a6cdbfc,
  produce an exact release candidate and keep production behind a separate gate

Non-goals:
  redesign, second backend/ORM/auth/UI system, persistent staging,
  speculative module activation, real-feed activation, automatic production

Implementation outcomes:
  EPIC-01 atomic import/access/SQL boundary
  EPIC-02 atomic lead/outbox/PII lifecycle
  EPIC-03 deterministic public SEO/HTTP output
  EPIC-04 normalized existing Project Design System/UI ownership
  EPIC-05 exact integrated candidate, disposable proof and factual docs

Production-only outcome:
  PROD-01/02 one explicitly authorized rollout plus immediate bounded live proof
```

## 16.2 Epic Contract Matrix

| Epic | Entry | Exit / observable outcome | Acceptance / verification | Rollback / stop |
|---|---|---|---|---|
| EPIC-01 | exact baseline; TASK-01.1 transaction contract; test PostgreSQL identity proved non-production | mutating import cannot write without one transaction; inventory/run/baseline/approval commit atomically; privileged/SQL surface is registered | TASK-01.2–01.9 negative cases + EPIC-01 commands + real PostgreSQL rollback/concurrency proof + exact-head RISKY gate | rollback migration/data fixture and branch; stop on unsupported same-session API, production DB, generic SQL or secret exposure |
| EPIC-02 | transaction carrier contract frozen; SQL register available for task-local decision | lead and enabled deliveries commit atomically; submit queues only its deliveries; retention mandatory; stale recovery conditional | TASK-02.1–02.7 cases + EPIC-02 commands + previous non-empty DB migration/backfill proof + exact-head RISKY gate | rollback migration/app slice; stop on production PII, invalid transaction, unapproved SQL or unredacted diagnostics |
| EPIC-03 | exact route/registry/content-gate baseline | HTTP status, robots, canonical, OG/Twitter, JSON-LD and sitemap agree for the full route matrix | TASK-03.1–03.7 matrix + EPIC-03 commands + route/browser/API evidence; promote to RISKY if gateway/data architecture changes | revert route/metadata slice; stop on fake facts, false 200, false indexability or stale cross-request totals |
| EPIC-04 | existing `docs/DESIGN.md`, `globals.css`, shadcn foundation and UI inventory | one project-owned semantic UI system; correct section/headings; project-owned analytics dispatch; disabled journal presentation removed | TASK-04.1–04.12 inventory/delta + EPIC-04 commands + representative mobile/desktop/keyboard/reduced-motion/performance evidence + exact-head RISKY gate | revert token/component slice as one unit; stop on second primitive system, unbounded visual redesign, inaccessible regression or unsupported alias change |
| EPIC-05 | exact merged heads of EPIC-01…04; disposable environment contract; production untouched | exact candidate passes required integration/staging proof; active docs and release evidence agree; all production prerequisites are explicit | TASK-05.1–05.9 + final proof commands; `SKIPPED != PASS` for required DB proof + exact-head RISKY gate | destroy disposable resources, preserve production and previous evidence; stop on production identity, PII/secrets, missing isolation or changed candidate SHA |
| PROD-01/02 | EPIC-05 PASS; clean unchanged main; explicit owner release command; all production prerequisites proved | one immutable rollout and immediate live acceptance bound to exact SHA/digest with rollback point | section 9A sequence and live matrix | automatic known-good app rollback plus migration-specific recovery; stop on any failed preflight/smoke/identity/backup/jobs-owner proof |

Every inventory task card must carry its exact task section as scope and expand
the applicable acceptance, verification, evidence, rollback and stop rows above.
Generic `works`, `done` or an omitted required DB/browser surface cannot close a
task.

## 16.3 Finding Register

| ID | Severity | Evidence / impact | Resolution | Status |
|---|---|---|---|---|
| FA-01 | BLOCKER | imported status claimed autonomous approval without owner gate; no separate Version field | stable Plan ID, `Version: v1`, canonical lifecycle and approval boundary added | RESOLVED v1 |
| FA-02 | BLOCKER | production tasks were inside the autonomous EPIC-05 chain | EPIC-05 now ends at release candidate; PROD-01/02 are production-only `needs-owner` nodes | RESOLVED v1 |
| FA-03 | BLOCKER | section 10 claimed “no blockers” while defining a full serial chain and no minimum blocking scope | task-level taxonomy, shared owners, waves and bypass policy added | RESOLVED v1 |
| FA-04 | BLOCKER | existing Beads store contains approved historical graphs and stale older `in_progress` claims; a second uncontrolled graph/worker would conflict | successor graph contract preserves history, requires unique prefix and clean reconciliation before one new Developer goal | RESOLVED AS HANDOFF PRECONDITION |
| FA-05 | MAJOR | raw SQL same-session participation was assumed but not proven by the documented direct transaction API | TASK-01.1 now requires `req.transactionID` for Local API and exact adapter/session proof for retained SQL | RESOLVED v1 |
| FA-06 | MAJOR | “shared cached resolver” could imply stale cross-request page totals | TASK-03.2 now requires request-scoped memoization compatible with current invalidation | RESOLVED v1 |
| FA-07 | MAJOR | C-21 treated retirement of persistent staging as a defect, while exact main already requires disposable isolated proof | reclassified `ALREADY_COVERED + verify`; EPIC-05 exercises rather than recreates staging | RESOLVED v1 |
| FA-08 | MAJOR | UI task wording could create a second Design System/intake lifecycle | changed to targeted normalization that reuses `docs/DESIGN.md` and `globals.css` | RESOLVED v1 |
| FA-09 | MAJOR | epic contracts did not explicitly state entry/exit/dependencies/rollback/stop | Epic Contract Matrix and dependency matrix added | RESOLVED v1 |
| FA-10 | FALSE POSITIVE | stale checkout suggested five missing package scripts and missing PROJECT/DESIGN docs | exact `main@a6cdbfc` contains all 47 referenced scripts plus `docs/PROJECT.md` and `docs/DESIGN.md` | RESOLVED BY EXACT-BASELINE CHECK |

## 16.4 Four-Pass Scorecard

```text
Logic / Completeness
  blockers: 0 after FA-01/02
  major open: 0
  result: PASS

Architecture / Data / Security
  blockers: 0
  Payload remains sole schema/auth/migration owner
  public/system/ingest boundaries remain explicit
  version-sensitive transaction uncertainty is fail-closed in TASK-01.1
  result: PASS WITH TASK-LOCAL CONTRACT LIMIT

Dependencies / Autonomy
  cycles: 0
  whole-EPIC hard dependencies: EPIC-05 integrated candidate only
  task-level contract dependencies: transaction carrier, SQL register,
    route/heading freeze
  independent ready waves: transaction/SQL contracts, SEO evidence, UI inventory
  production node: isolated from implementation
  result: PASS WITH HANDOFF PRECONDITION

Executability / Evidence / Delivery
  epics with outcome/entry/exit: 5/5
  epics with deterministic acceptance/verification: 5/5
  epics with rollback/stop: 5/5
  referenced package scripts present on exact baseline: 47/47
  delivery policy: EPIC-01…05 MERGE_AFTER_GATE; production needs-owner
  result: PASS
```

## 16.5 Official Stack Documentation Check

```text
Payload 3.90.1:
  official transaction contract supports begin/commit/rollback and threading
  req.transactionID through Local API calls
  remaining uncertainty: same-session retained raw SQL must be proved from
  installed adapter source/runtime and real PostgreSQL rollback evidence

Next.js 16.3.5:
  generateMetadata participates in rendering; identical fetch is memoized and
  React.cache is the documented alternative when fetch is unsuitable
  decision: TASK-03.2 uses request-scoped shared resolution, not an unbounded
  cross-request total-pages cache
```

Official sources checked 2026-09-28:

- `https://payloadcms.com/docs/database/transactions`
- `https://payloadcms.com/docs/local-api/overview`
- `https://nextjs.org/docs/app/api-reference/functions/generate-metadata`
- `https://nextjs.org/docs/app/getting-started/fetching-data`

## 16.6 Owner Decision Register

| ID | Decision | Recommendation | Blocks | Deadline | Status |
|---|---|---|---|---|---|
| OD-R1 | retained SQL operation lacks supported transaction/session proof | prefer supported Local API; otherwise approve only a named ADR-backed operation with atomicity/concurrency proof | affected EPIC-01/02 task only | before affected implementation | OPEN LATER |
| OD-R2 | external uptime provider/account | use an independent external probe and separate alert destination; do not set readiness true without test alert evidence | PROD-01 | before production | OPEN LATER |
| OD-R3 | production owner/admin bootstrap credentials | use controlled bootstrap with owner-supplied credentials; never store them in plan/evidence | PROD-01 | before production | OPEN LATER |
| OD-R4 | canonical NAP facts | verify against owner/business truth; omit unverifiable geo/sameAs | EPIC-03 final facts and PROD-01 | before production | OPEN LATER |
| OD-R5 | exact production release | issue a separate explicit release command only for the unchanged EPIC-05 candidate | PROD-01/02 | before production | OPEN LATER |

Owner decisions before plan approval: `0`.

## 16.7 Night Run Readiness

```text
Independent ready waves:
  transaction/SQL contract work; SEO evidence; UI inventory

Critical path:
  transaction carrier → affected EPIC-01/02 work
  route matrix → shared heading work
  EPIC-01…04 exact heads → EPIC-05 integrated candidate
  [explicit production gate] → PROD-01/02

Single blocking points:
  EPIC-05 integrated candidate is intentionally serial
  production authorization is intentionally outside the autonomous graph

Owner decisions before approval: 0
Unknown critical prerequisites before safe implementation: 0
Cycles: 0
Safe work if one task blocks: yes, through W1–W3 alternatives

Result: READY_WITH_LIMITS
Limits:
  retained raw SQL may block only its affected task until transaction/session
  proof or owner decision; historical Beads claims must be reconciled before
  the new Developer goal; production always waits for a separate command.
```

## 16.8 Revision History

### v0 DRAFT — 2026-09-28

- Source: owner-provided `DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md`.
- Imported status `APPROVED FOR AUTONOMOUS REMEDIATION` was treated as DRAFT,
  not as owner approval.
- Exact basis: SourceCraft `main@a6cdbfc3a1a1348f65934ca202f39baec5c09bca`.

### v1 FINAL AUDIT — 2026-09-28

- Source: explicit owner command `Запускай финальную проверку`.
- Passes: logic/completeness; architecture/data/security;
  dependencies/autonomy; executability/evidence/delivery.
- Accepted: confirmed import/outbox/PII/SEO/UI/operations remediation scope.
- Reclassified: persistent staging finding is already covered and requires
  verification, not recreation.
- Corrected: lifecycle/status, stable Plan ID, production separation,
  transaction/session proof, request-scoped metadata resolver, dependency
  matrix, shared ownership, delivery modes, successor Beads contract and Epic
  Contract Matrix.
- Rejected: automatic production inside the Developer graph; whole-program
  serial dependency presented as “no blockers”; using stale checkout evidence
  to declare scripts/docs missing.
- Result: `READY_WITH_LIMITS`; blockers `0`, cycles `0`, owner decisions before
  approval `0`. Exact v1 is `READY_FOR_OWNER_APPROVAL`; Task Manager import and
  Developer handoff remain forbidden until the owner says `План утверждён` or
  `План утвержден`.

### v1 APPROVED — 2026-09-28

- Owner approval received with the exact phrase `План утверждён`.
- Approved implementation authority: EPIC-01…05 through their declared
  `MERGE_AFTER_GATE` SourceCraft lifecycle.
- Production remains planned as the final `PROD-01/02` owner gate and is not
  authorized by plan approval; it requires a separate explicit command
  `Выпускаем production` for the unchanged final candidate.
