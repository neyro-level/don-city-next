# CORE 5.5 CP-04 preflight

Status: `READY_WITH_EXTERNAL_PROOF_LIMIT`

## Execution boundary

- Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`.
- Epic: `EPIC-71 / CP-04 — MEDIA AND REQUEST-PATH PERFORMANCE`.
- Branch/worktree: `codex/dc55-epic-71` / isolated CP-04 worktree.
- Base: `1af2f8e34509e3cd0a76653546f23998d889b7c6` (`origin/main`).
- Delivery profile: `CRITICAL`; schema/media/backfill gate is `RISKY`.
- Production, public indexing, real feed, real S3, DNS, secrets and destructive
  data actions remain outside this stream.

## Acceptance surface

CP-04 must deliver one responsive/format strategy for managed object media,
stable cacheable variant URLs, an idempotent dry-run-first backfill with rollback,
and removal of duplicate expensive property reads. Representative imported media
must survive backfill/rollback. Evidence must record request p95 before/after and
mobile Lighthouse on home, catalog and property with `LCP <= 2.5s` and
`CLS <= 0.1`.

## Exact runtime findings

| Surface | Current evidence | Decision |
|---|---|---|
| Image renderer | Public property/card/gallery components use project-owned `StarterFeedImage`, a native `<img>` with `sizes`, eager/high priority for LCP and no Next Image optimizer. | Do not introduce a second Next loader. |
| Managed storage | Payload `3.90.1`, Sharp and `@payloadcms/storage-s3 3.90.1` are installed; private S3 is proxied through Payload access control. | Keep private S3 and controlled `/api/media/file/*` delivery. |
| Payload media | Collection has no `imageSizes`; public projection selects only `filename` and builds one original URL. | Select Payload-generated variants. |
| Existing media | DON CITY importer creates managed media idempotently by factual `alt`; no variant backfill exists. | Add a separate dry-run-first backfill, never overload real-feed import. |
| Cache identity | New filenames contain a UUID; variant names can deterministically include source UUID, size and dimensions. | Immutable cache only for positively versioned filenames. |
| Request path | Proxy resolves a full property state through `getPublicPropertyByPublicUrlId`; the page resolves it again. The full provider reads lifecycle, property, related catalog and media. | Proxy must use a lifecycle-only gateway read; full DTO stays page-owned. |
| Logo mark | `don-city-mark.png`: 512x512, 159,992 bytes, rendered at 44x44. | Keep original; serve a right-sized 88px derivative. |
| Footer logo | `don-city-logo-approved.jpg`: actual 736x920, 445,582 bytes, rendered at 160px width; DTO incorrectly declares 768x960. | Keep original; serve a 320px-wide derivative with exact intrinsic dimensions. |

Graph inspection confirms the shared owners are `Media`, S3 plugin, public media
projection/DTO, `StarterFeedImage`, proxy and the public route resolver. Imports,
module boundaries and generated Payload types/migrations are therefore treated
as one internally serial RISKY slice.

## Selected media strategy

Use Payload `imageSizes`, not Next Image optimization:

- `thumb`: width `320`, proportional height;
- `card`: width `640`, proportional height;
- `detail`: width `1280`, proportional height;
- WebP output at an explicit quality; never enlarge a smaller source;
- deterministic versioned variant names derived from the UUID source filename;
- original upload remains available for rollback and non-image documents;
- Public Gateway returns only safe variant URL/width/height data needed to build
  `srcset`; external feed URLs remain unmodified and unoptimized;
- Payload access control remains enabled; bucket public-read is forbidden.

Payload's official [upload contract](https://payloadcms.com/docs/upload/overview)
confirms `imageSizes` adds per-size
filename/URL/width/height fields and uses Sharp; the official S3 adapter keeps
Payload file URLs/access control by default and includes generated image sizes in
the [storage adapter path](https://payloadcms.com/docs/upload/storage-adapters).
Installed `3.90.1` types expose `formatOptions`,
`generateImageName`, `withoutEnlargement` and `modifyResponseHeaders`.

## Backfill and rollback contract

1. Default mode is dry-run and prints counts/IDs only.
2. Apply requires an explicit flag, an explicit isolated staging/test DB and the
   matching non-production media prefix.
3. Each document is skipped when every expected variant exists and metadata
   matches; reruns are idempotent.
4. Failure leaves the original upload/document usable. Partial generated objects
   are tracked for exact cleanup.
5. Rollback removes only variants created by the recorded run and restores prior
   size metadata; originals and unrelated objects are never deleted.
6. No production or real-S3 execution occurs in CP-04 implementation.

## Performance proof contract

- Measure cold and warm request samples separately; record p50/p95 and sample
  count for home, catalog and one property.
- For each mobile trace record the LCP element and the four subparts: TTFB,
  resource delay, load duration and render delay.
- Verify the first viewport/LCP image is eager/high-priority and discoverable in
  initial HTML; all noncritical gallery/card images remain lazy.
- Compare transferred image bytes and CLS sources before/after.
- Local fixture evidence may validate markup and budgets, but final numeric
  acceptance requires the isolated DB/staging contour with representative
  imported media.

## Stop conditions

Stop on unknown DB/S3 identity, a non-dry-run backfill without explicit isolated
staging, deletion or overwrite of originals, public bucket/access bypass, mixed
Payload + Next image optimization, unversioned immutable caching, or any
production/indexing/feed/secret/DNS mutation.

Current external limit: the Secret Master credential is expired, so no isolated
DB/S3 runtime or representative-media Lighthouse proof is available yet. Code,
asset derivatives, dry-run tooling and deterministic regression checks can
continue without crossing that boundary.
