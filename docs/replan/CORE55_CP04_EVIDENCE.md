# CORE55 CP-04 EVIDENCE

Status: `READY FOR DELIVERY`
Date: `2026-09-27`
Task: `dc55-task-71-evidence`
Branch: `codex/dc55-epic-71`
Epic base: `1af2f8e34509e3cd0a76653546f23998d889b7c6`
Implementation proof: `be052be7a307e6812cd5494878e70cb70813fb81`
Verification proof: `44442a6088255ae6d8dbef927d9cf7fdc6ba84cb`

## Outcome

CP-04 implements and proves responsive managed media, bounded immutable cache
identity, a dry-run-first existing-media backfill with rollback, right-sized
brand assets and removal of the duplicate full property read from the request
proxy. The proof uses an isolated local PostgreSQL 18 database and an ephemeral
loopback S3-compatible contour; no production storage or data was touched.

## Traceability

| §33D acceptance owner | Implementation | Proof |
|---|---|---|
| responsive media | Payload 320/640/1280 WebP sizes, no enlargement | generated three-variant integration fixture and public `srcset` checks |
| safe public contract | explicit media selection and DTO contract `1.5.0` | public gateway, DTO, card and detail verifiers |
| cache identity | UUID-versioned original and variant filenames only | cache-target verifier and source assertions |
| existing media | direct Node backfill runner with dry-run/apply/idempotency | isolated DB plus loopback object-storage integration suite |
| rollback | manifest-scoped delete and prior metadata restoration | rollback fixture preserves original object and removes only generated variants |
| request path | lifecycle/canonical-only proxy lookup | lifecycle and detail route verification |
| brand assets | project-owned WebP header/footer derivatives | responsive-media verifier and production build |
| request latency | same fixture and exact base comparison | 25-sample p50/p95 matrix; property p95 `41.39 → 28.49 ms` |
| mobile rendering | explicit 390×844, DPR 3, CPU×4, Slow 4G | max LCP `1,401 ms`, max CLS `0.00` |

Detailed commands, measurements and limitations are recorded in
`docs/replan/CORE55_CP04_VERIFICATION.md`; the implementation contract and
discovered storage-key correction are recorded in
`docs/replan/CORE55_CP04_IMPLEMENTATION.md`.

## Residual risk

- SourceCraft full-diff review and one exact-head `RISKY` gate remain required
  before merge because the change includes migration, object-storage behavior
  and public request-path logic.
- The loopback storage proof covers the version-pinned PUT/GET/HEAD/DELETE
  surface used by the backfill. Real Timeweb S3 compatibility remains a release
  contour and was not exercised without verified access.
- The local database is synthetic and isolated. Production data volume and
  object inventory were not sampled.
- Global `noindex` remains active. Public indexing, DNS, real feeds and
  newbuild/ЖК were not enabled.
- Secret Master discovery still returns `403`; no secret value was printed,
  committed or persisted by this stream.

## Rollback boundary

Code and DTO changes can be reverted as one epic. Media rollback must use the
generated manifest so that only CP-04 variants are removed and prior document
metadata is restored; originals must remain untouched. Database migration
rollback and production object deletion are not authorized by this task.

Delivery is ready only after the evidence commit is pushed, the complete
base-to-head diff has no blocking review finding, and one SourceCraft
`merge-risky` run attests the exact branch head before merge.
