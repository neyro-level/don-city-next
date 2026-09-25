# EPIC-42 Performance Preflight

Status: `READY FOR IMPLEMENTATION`

## Task Contract

- Goal: close the executable performance contract for public R1 pages without
  changing production, DNS, databases, migrations, or secrets.
- Scope: RSC/client boundaries, server-rendered catalog pagination, public media
  loading, existing database/cache path, and verifiable LCP/CLS/INP readiness.
- Base: `origin/main@edbff4582e6c6614fc78e482f6d3a38d57bbaca6`.
- Branch/worktree: `codex/epic-42-performance` in the task-owned EPIC-42
  worktree.
- Source of truth: approved V4 master plan section `EPIC-42`, pagination
  contract section 17, architecture public cache contract, and release
  checklist.

## Entry and dependency evidence

- EPIC-40 cache delivery is merged into the exact base and provides tagged
  Public Gateway reads with a bounded safety TTL.
- Representative Home, catalog, geo/facet, and property routes already render
  through public DTOs.
- The catalog page and `StarterPropertyCard` are React Server Components. The
  lead form is an explicit interactive leaf.
- Public media currently reserves intrinsic/aspect-ratio space, uses async
  decoding, and defaults non-priority images to lazy loading.

## Confirmed gaps

1. `ResolvedPublicRoutePage` hardcodes `page: 1`, so query pagination cannot
   fetch subsequent pages even though the gateway DTO already exposes page,
   page size, and total pages.
2. Catalog output has no server-rendered pagination links. This violates the
   approved requirement that every listing remains discoverable without
   JavaScript.
3. Page 2+ has no self-canonical metadata path. The approved contract requires
   `noindex,follow` plus a canonical URL containing the current page.
4. The complete footer is a Client Component only because phone reveal uses
   local state. Static footer navigation and legal content therefore receive
   avoidable hydration JavaScript.
5. There is no focused executable performance guard covering pagination,
   RSC/client boundaries, media dimensions/loading, and the established cache
   path.

## Implementation decision

- Parse only a single positive integer `page` value. Page 2+ updates the
  catalog query, is `noindex,follow`, and receives a self-canonical URL. Page 1
  keeps the clean canonical URL.
- Render bounded, crawlable pagination links on the server and preserve any
  canonical approved facet parameters.
- Move footer phone reveal to a small Client Component and return the footer
  shell to the server boundary.
- Keep current media semantics: explicit dimensions/aspect ratios, lazy loading
  below the fold, and priority only for known above-the-fold media. Do not add a
  framework image dependency to the portable UI package in this epic.
- Add a focused verifier and package script that fail if these invariants drift.

## Acceptance and proof

- Page 2+ fetches the requested gateway page and exposes crawlable links.
- Metadata is self-canonical and `noindex,follow` for page 2+.
- Invalid or repeated page inputs never become indexable pagination URLs.
- Catalog cards remain server-rendered; footer hydration is isolated to the
  phone control; media dimensions/loading invariants remain explicit.
- Focused verifier, affected route/SEO/cache checks, typecheck, lint, and build
  pass.
- LCP/CLS/INP field values are not fabricated locally. Exact runtime metrics
  remain a staging/browser proof in EPIC-45/46; EPIC-42 proves the code-level
  prerequisites and records that measurement boundary explicitly.

## Stops and fallback

- No production/staging mutation, DNS, destructive migration, or secret write.
- If representative runtime data cannot be obtained without an environment
  mutation, use fixture/static build evidence and defer only measured Web
  Vitals values to the already planned staging proof.
