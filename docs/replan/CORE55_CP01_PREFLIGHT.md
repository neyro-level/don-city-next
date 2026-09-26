# CORE 5.5 CP-01 — preflight

Date: `2026-09-27`
Task: `dc55-task-67-preflight`
Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`
Mode: `WORK`, read/plan only
Repository: `don-city-next`
Branch: `codex/master-plan-core-5-5`
Base SHA: `5b9271fa8a185998daf269e5e65fc3e5f6ce9494`
Entry head SHA: `fd50062249850a4bef5195a0a67d6b64049f50e2`
Risk: `RISKY` — a global indexing-policy defect can expose or suppress the whole site.

## Task Contract

Goal: freeze the exact implementation and verification surface for the
release-level indexing override before code changes.

In scope:

- deterministic composition of release-level and page-level robots policy;
- HTML robots metadata and `X-Robots-Tag` agreement;
- `robots.txt`, ordinary pages, static/legal pages, 404 and 410/gone responses;
- a two-mode route matrix for `noindex` and `public`;
- preservation of staging edge-level `noindex`.

Out of scope:

- changing production from `noindex` to `public`;
- enabling feeds, DNS, secrets or production infrastructure;
- enabling newbuild/ЖК or changing the first-four-month product scope;
- sitemap/content activation owned by CP-02A and CP-02.

Stop conditions: source/inventory drift, unknown test-versus-production
identity, any production/indexing/secret/feed mutation, or destructive data
work without separate owner authority.

## Source-of-truth decisions

- The future public launch is a full production site, not a partial technical
  opening. Its first four months may index only gated secondary apartments,
  houses, land, commercial real estate and the legal department.
- `/donetsk/kommercheskaya/` and `/yurist/` are the approved commercial/legal
  launch owners.
- `/novostroyki/*` and `/komplex/*` stay disabled, absent from indexable
  navigation and sitemap, and non-indexable until a later owner-approved plan.
- CP-01 supplies the global safety mechanism. CP-02A/CP-02 supply the permitted
  public surface and its content/data gates.

## Current-state evidence

Graph navigation and direct source inspection identify one current policy
owner, `src/project/indexing-policy.ts`, consumed by `src/app/layout.tsx`,
`src/app/robots.ts` and `scripts/verify-seo-contracts.mjs`.

Confirmed behavior:

- `productionIndexing=null` falls back to `noindex`;
- `starter-demo` cannot become public;
- root metadata emits `noindex,nofollow` in the noindex mode;
- `robots.txt` disallows the entire site in the noindex mode;
- public `robots.txt` excludes `/admin` and `/api` and announces sitemap URLs.

Confirmed gaps against EPIC-67 acceptance:

1. Next.js metadata is shallowly merged from root to leaf. A page-level
   `robots` field replaces the root field, so root metadata alone is not a
   deterministic release-level override.
2. There is no global `X-Robots-Tag: noindex, nofollow` response policy.
   The only explicit `X-Robots-Tag` found is the property-lifecycle 410 route.
3. Existing tests cover policy helpers and selected source wiring, but not the
   required route/status matrix in both application modes.
4. Current full-crawl logic treats the noindex environment as a staging mode;
   it does not independently prove the application-level override across all
   response classes.

## Version-sensitive framework decision

Installed stack: Next.js `16.3.5`, React `19.2.8`, Payload `3.90.1`.

Official Next.js documentation checked on `2026-09-27`:

- metadata merge and robots fields:
  `https://nextjs.org/docs/app/api-reference/functions/generate-metadata`;
- response headers in `next.config`:
  `https://nextjs.org/docs/app/api-reference/config/next-config-js/headers`;
- Next.js 16 `proxy.ts` and response-header behavior:
  `https://nextjs.org/docs/app/api-reference/file-conventions/proxy`.

Decision for IMPLEMENT: keep one pure project-owned policy/composition module
and apply the release override at both metadata composition and HTTP response
layers. Prefer the smallest deterministic header mechanism that covers normal,
404 and 410 responses without importing request-time business/data logic into
Proxy. Validate the chosen mechanism against installed Next.js types and an
isolated HTTP smoke before acceptance. Do not rely on root metadata inheritance.

## Frozen route matrix

| Family/state | `noindex` HTML/header | `public` page policy | Required proof |
|---|---|---|---|
| home | `noindex,nofollow` | effective page policy | metadata + HTTP |
| geo hub | `noindex,nofollow` | gated index policy | metadata + HTTP |
| category | `noindex,nofollow` | gated index policy | metadata + HTTP |
| district | `noindex,nofollow` | gated index policy | metadata + HTTP |
| facet/query | `noindex,nofollow` | registry/query policy | metadata + HTTP |
| property active/archive | `noindex,nofollow` | lifecycle policy | metadata + HTTP |
| static/marketing/legal | `noindex,nofollow` | page policy | metadata + HTTP |
| 404 | header `noindex,nofollow` | header `noindex,nofollow` | HTTP |
| 410/gone | header `noindex,nofollow` | lifecycle noindex header | HTTP |

For every `noindex` row, HTML and `X-Robots-Tag` must agree. Public mode must
not weaken page-level `noindex`; it only removes the global override.

## Checks and handoff

- Canonical Task Manager reconciliation: `CLEAN`, 10/10 epics, 55 managed
  nodes, zero drift and zero cycles.
- Graphify: policy owner and direct consumers identified; no second global
  response-policy owner was found.
- Static source inspection: PASS for current-state claims above.
- Official Next.js contract: PASS for metadata replacement and supported
  response-header mechanisms.
- Runtime/HTTP verification: not run in PREFLIGHT; mandatory in VERIFY after
  implementation.

Next task may implement only this frozen surface. Production remains `noindex`;
opening public indexing remains a separate CP-09 release authorization.
