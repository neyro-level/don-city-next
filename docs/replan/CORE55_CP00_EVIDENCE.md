# CORE 5.5 CP-00 — factual evidence matrix

Status: ASSEMBLY EVIDENCE COMPLETE
Date: 2026-09-27
Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v8 REVIEW`
Repository snapshot: `9087e43c1effd1a11216cf09fd1153b1248252e8`

## Purpose

This report classifies the owner packet against the current repository and
read-only production HTTP surface. It is evidence for Architect assembly, not
Task Manager import, implementation approval or production authorization.

Classification:

- `CONFIRMED_DEFECT` — current code/live behavior proves the claim;
- `PARTIAL` — foundation exists but acceptance is incomplete;
- `ALREADY_COVERED` — current code and targeted proof cover the claim;
- `EXTERNAL_PROOF_REQUIRED` — requires staging/DB/browser/provider evidence;
- `OWNER_DECISION` — irreversible or policy decision remains outside code.

## Exact stack and official contract

- Next.js `16.3.5`, React `19.2.8`, Payload `3.90.1`, Node `24.20.x`, pnpm
  `11.5.1`, PostgreSQL `18`, Tailwind CSS `4.x`.
- Next 16 passes `generateSitemaps()` IDs as `Promise<string>` and generates
  shard URLs under `/sitemap/[id].xml`; it does not create a root sitemap index:
  [Next.js generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps).
- Next supports static response headers through `next.config` and documents
  Proxy/nonce CSP as a dynamic-rendering trade-off:
  [headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers),
  [CSP](https://nextjs.org/docs/app/guides/content-security-policy).
- `MetadataRoute.Robots` has no `Clean-param` field. A Yandex `Clean-param`
  directive therefore requires a custom `robots.txt` Route Handler or static
  response instead of the typed metadata object:
  [Next.js robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).
- Payload supports bulk `update({ where, data })`, but the returned per-document
  result alone does not prove that read/claim/update is one atomic database
  statement. Exact claim semantics must be tested before replacing SQL:
  [Payload Local API](https://payloadcms.com/docs/local-api/overview).
- Payload `imageSizes` and `formatOptions` are supported and backed by `sharp`:
  [Payload uploads](https://payloadcms.com/docs/upload/overview).
- Canonical AMS Realty Core 5.5 exists in the checkout. A canonical AMS UI Core
  5.0 source was not found in the repository or `$CODEX_HOME`; 5.0 conformance
  remains `NOT VERIFIED`.

Docs status: `PARTIAL`. The concrete Next/Payload APIs above are officially
supported, but atomic claim replacement and nonce-CSP compatibility require
project tests/runtime proof.

## Live read-only production evidence

Checked through public HTTPS only; no server, database, secret or production
mutation was used.

- `/` returns `200`, edge `X-Robots-Tag: noindex, nofollow`, but HTML contains
  `<meta name="robots" content="index, follow">`.
- `robots.txt` returns `Disallow: /`.
- `/sitemap.xml` returns `404`.
- `/sitemap/0.xml` returns `200 application/xml`.
- Public responses contain duplicate HSTS headers with different max-age values:
  application `63072000; includeSubDomains; preload` and Nginx
  `31536000; includeSubDomains`.
- Public CSP contains `script-src 'self' 'unsafe-inline'`.

## Evidence matrix

| ID | Status | Evidence / decision | Target |
|---|---|---|---|
| 1.1 indexing override | `CONFIRMED_DEFECT` | `toMetadata()` uses only page SEO; production HTML says `index, follow` while edge policy says noindex. `notFound`/`gone` also bypass the project policy composer. | CP-01 RISKY |
| 1.1 response header | `PARTIAL` | Production Nginx already emits `X-Robots-Tag: noindex, nofollow`; application config does not own the policy. One composed source and tests are missing. | CP-01 RISKY |
| 1.2 robots public media | `CONFIRMED_DEFECT` | Public mode disallows `/api` without an explicit `/api/media/file/` allow. `Clean-param` cannot be emitted by `MetadataRoute.Robots`. | CP-02 STANDARD/RISKY by implementation |
| 1.3 root sitemap index | `CONFIRMED_DEFECT` | Live `/sitemap.xml` is 404; Next 16 `generateSitemaps` creates only shard routes. | CP-02 STANDARD |
| 1.4 sitemap fail-closed | `CONFIRMED_DEFECT` | Non-static shard catches all provider errors and returns `[]`; special sitemap handlers are cached by default. | CP-02 RISKY |
| 1.5 OG/Twitter | `CONFIRMED_DEFECT` | Metadata maps only optional OG title/description; no URL/type/locale/site/image/Twitter contract. Live home has no complete OG surface. | CP-02 STANDARD |
| 1.6 structured data | `PARTIAL` | Safe builders and serializer exist; only home renders Website + Organization. Catalog/property/contact routes do not wire the builders. | CP-02 STANDARD |
| 1.7 title/description | `PARTIAL` | Registry and current checks exist, but brand/template and cross-sitemap uniqueness/length coverage are incomplete. | CP-02 STANDARD |
| 1.8 heading outline | `CONFIRMED_DEFECT` | Property price is an `h2`; UI uses legacy heading roles. Legal-support section already has an `h2`. | CP-02/CP-05 STANDARD |
| 1.9 pagination/filter | `PARTIAL` | Current policy implements page 2+ `noindex,follow`; exact page=1 redirect, page>total, nonnumeric and unknown-query HTTP matrix is incomplete. | CP-02 STANDARD |
| 1.10 archived→gone | `ALREADY_COVERED + BOUNDARY_PROOF` | `verify:property-lifecycle-routes` passes archived/gone basics. Exact retention boundary and proxy race remain in scope. | CP-02 STANDARD/RISKY |
| 1.11 full crawl | `EXTERNAL_PROOF_REQUIRED` | Existing crawl script exists; public-mode isolated staging crawl was not run in this session. Edge staging must remain noindex. | CP-08 RISKY |
| 2.1 media sizes/cache | `CONFIRMED_DEFECT` | Media collection has no `imageSizes`/format strategy; imported-media backfill and immutable versioned URL proof are absent. | CP-04 RISKY |
| 2.2 logos | `CONFIRMED_DEFECT` | Compact mark is 159,992 bytes and declared 512×512 for 44px display; footer original is 445,582 bytes and declared 768×960 at `w-40`. | CP-04 STANDARD |
| 2.3 duplicate property lookup | `CONFIRMED_DEFECT` | `proxy.ts` loads property status/redirect and page resolver loads the property again. | CP-04 RISKY |
| 2.4 performance budget | `EXTERNAL_PROOF_REQUIRED` | No current three-page Lighthouse/p95 evidence was run. | CP-04/CP-08 |
| 3.1 raw SQL | `OWNER_DECISION` | Eight ingest/system operations use narrow parameterized SQL with written invariants. Core 5.5 prefers application operations for dispatcher claims. Replace only when atomic semantics are proven; otherwise retain a narrow ADR-backed exception. | CP-03 RISKY |
| 3.2 jobsJanitor race | `CONFIRMED_DEFECT` | Find then update by ID does not repeat `status/heartbeat` condition; queued orphan detection only includes missing `jobId`, not dead referenced jobs. | CP-03 RISKY |
| 3.3 lead retention | `CONFIRMED_DEFECT` | Delivery query is limited to 50; delete mode purges delivery diagnostics but deletes only the lead, without proven same-transaction delivery deletion. | CP-03 RISKY |
| 3.4 pending recovery threshold | `CONFIRMED_DEFECT` | Every due pending delivery without a live job is immediately requeued; Core 5.5 minimum age is absent. | CP-03 RISKY |
| 3.5 heartbeat visibility | `PARTIAL` | Heartbeat uses a standalone payload/SQL operation, but targeted external visibility proof A has not been run for this candidate. | CP-03/CP-08 RISKY |
| 3.6 runtime clock | `CONFIRMED_DEFECT` | `catalogLifecycle` directly uses `Date.now()` instead of the injected runtime clock. | CP-03 RISKY |
| 3.6 build-only env fallback | `CONFIRMED_DEFECT` | `payload.config.ts` always supplies fallback DB/secret strings when runtime env is absent; it is not explicitly limited to the build phase. | CP-03 RISKY |
| 3.6 in-process rate limit | `CONFIRMED_DEFECT` | Pruning deletes insertion-order entries while size is at the limit, not expired then oldest `resetAt`. | CP-03 STANDARD/RISKY |
| 3.6 lead request boundary | `CONFIRMED_DEFECT` | Public lead route checks size/rate/body only; Origin, Sec-Fetch-Site and JSON Content-Type checks are absent; public response exposes `reused`. | CP-03 RISKY |
| 3.7 collection access | `ALREADY_COVERED` | Regions/Cities/Districts/ListingContents declare explicit create/read/update/delete access and anonymous read uses narrow public predicates. Direct access-matrix regression proof remains required. | CP-03 |
| 4 CSP | `OWNER_DECISION + SPIKE` | Public CSP uses `unsafe-inline`; official nonce flow implies dynamic rendering and Proxy/request-header work. Run a pinned-version spike before changing runtime policy. | CP-06 RISKY |
| 4 HSTS | `CONFIRMED_DRIFT + OWNER_DECISION` | App and Nginx emit conflicting HSTS; app includes `preload`. Subdomain HTTPS inventory and owner commitment are required before preload. | CP-06 RISKY |
| 5.1 typography | `CONFIRMED_DRIFT` | One token file exists, but large parallel `--site-type-*` and semantic aliases plus legacy `text-display*` usage remain. `verify:ui-core` passes because current rules accept/baseline this shape. | CP-05 STANDARD |
| 5.2 literals/components | `CONFIRMED_DRIFT` | Repeated nav/chip class bundles and literal variants exist; current drift scan does not report them. | CP-05 STANDARD |
| 5.3 navigation semantics | `CONFIRMED_DEFECT` | Mobile strip uses `Container aria-label` rather than `nav`; desktop summary overwrites visible label through `aria-label`; explicit Esc/outside behavior is unproven. | CP-05 STANDARD |
| 5.3 lead-form errors | `ALREADY_COVERED + MANUAL_PROOF` | Inputs and consent use `aria-describedby`; consent has textual error; automated a11y passes. Manual submitting/server/success proof remains. | CP-05 STANDARD |
| 5.4 starter names | `CONFIRMED_DRIFT` | `StarterPropertyMediaGallery`, starter view names and `@ams/realtbase-ui/starter/*` exports remain. | CP-05 STANDARD/RISKY if package API changes |
| 5.5 drift audit | `PARTIAL` | `verify:drift` and `verify:ui-core` pass, but manual interaction and the owner packet's uncovered patterns remain outside current scanners. | CP-05 |
| 6.1 Core 5.5 docs | `CONFIRMED_DEFECT` | `docs/PROJECT.md` and `docs/DESIGN.md` are absent; current information is split across Architecture/Operations/Design System. | CP-07 STANDARD |
| 6.1 AMS_PROFILE | `ALREADY_COVERED` | `.env.example` contains `REALTY_BASE`; Zod uses an exact literal and runtime readiness validates it. | CP-07 regression only |
| 6.2 readiness config | `PARTIAL / FAIL-CLOSED` | Nginx and jobs topology exist, but config intentionally remains false/null until durable evidence. Backup/media monitoring and allowlists are still incomplete. Do not flip mechanically. | CP-07 + readiness work |
| 6.3 reserved namespaces | `ALREADY_COVERED + DOCS` | `novostroyki`, `komplex`, `journal` are reserved and CMS Pages guard rejects collisions. Add Core 5.5 project documentation and regression matrix. | CP-02A/CP-07 |
| initial commercial scope | `PARTIAL` | Contracts, Payload category, filters, URL slug `kommercheskaya` and navigation label exist; Site Profile is `PREPARED_OFF`. Activation needs real content/inventory gate and SEO registry. | CP-02A RISKY |
| legal department | `PARTIAL` | `/yurist/`, legal lead kind and legal-support CTA exist; exact approved service-page registry beyond the hub is not frozen. | CP-02A STANDARD |
| newbuild first four months | `ALREADY_COVERED + VERIFY` | Market/category are `PREPARED_OFF`, reserved namespace exists. Crawl/sitemap/navigation proof must guarantee no exposure after public indexing. | CP-02A/CP-08 |

## Commands actually run

- `pnpm verify:seo-contracts` — PASS.
- `pnpm verify:property-lifecycle-routes` — PASS.
- `pnpm verify:lead-delivery-state` — PASS.
- `pnpm verify:a11y-starter` — PASS.
- `pnpm verify:drift` — PASS.
- `pnpm verify:ui-core` — PASS.
- `pnpm verify:jobs-config` — FAIL: Architecture marker
  `queue polling/execution` is missing.
- `pnpm verify:operational-recovery` — FAIL: `OPERATIONS.md` is missing the
  required `Manual import` procedure.
- `pnpm quality:docs-sot` — PASS before this report.

These are local results only, not SourceCraft CI or staging proof.

## CP-00 conclusions

1. The owner packet is materially evidence-backed; it is not a cosmetic audit.
2. Indexing cannot be opened safely until CP-01/CP-02/CP-02A and operational
   readiness pass, because live HTML currently contradicts the edge robots
   policy and `/sitemap.xml` is absent.
3. Commercial real estate is a prepared project capability, not a greenfield
   module. Recommended canonical category slug: preserve existing
   `kommercheskaya` unless semantic research proves a redirect-worthy change.
4. Launch registry is frozen conservatively: commercial uses the existing
   `/donetsk/kommercheskaya/` owner and legal uses `/yurist/`. Child legal URLs
   stay absent/non-indexable until a factual service and content contract exists.
5. Newbuild/ЖК remains `PREPARED_OFF`, non-indexable and outside sitemap for the
   first four months after launch.
6. CP-01 and CP-03 can start independently only after v8 final audit, owner
   approval and Task Manager reconciliation. CP-03 remains internally serial.
7. SourceCraft push/gate remains unavailable until Git-service machine
   authentication is restored. No evidence in this report changes that blocker.
