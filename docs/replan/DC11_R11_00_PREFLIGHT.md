# DC10-R11-00 — exact production inventory preflight

Status: `BASELINE_CAPTURED`

Observed at: 2026-09-28 (Europe/Moscow)

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`

Mode: read-only production diagnostic. The PostgreSQL session explicitly used
`BEGIN READ ONLY` and returned `transaction_read_only=on`. No production,
database, DNS, Secret Master or filesystem mutation was performed.

## Task contract

- Outcome: one redacted factual category/geo/URL/indexability row for every
  published property, with reconciled counts.
- Data boundary: record titles, addresses, coordinates, descriptions, media,
  owner/contact fields, PII, credentials and full database URLs are excluded.
- Runtime boundary: the current production image is observed evidence only;
  this preflight does not claim it equals current canonical `main`.
- Delivery: `CRITICAL`, read-only data scope, `RISKY`, `MERGE_AFTER_GATE`.

## Reconciled counts

| Measure | Count |
|---|---:|
| Published property rows | 12 |
| Active secondary-sale rows with public URL identity | 12 |
| Live HTTP `200`, sitemap-present, indexable, self-canonical URLs | 12 |
| Apartment | 9 |
| House | 3 |
| Land | 0 |
| Commercial | 0 |
| Missing `city` relationship | 12 |
| With `needsReview=true` | 4 |

The database total, redacted matrix total, property-sitemap total and live HTTP
matrix all reconcile to 12.

## Redacted factual matrix

`Indexable=yes` means the current live URL returned `200`, was present in the
property sitemap, had no `noindex` directive and exposed a self-canonical URL.
The data predicate also passed `active + published + secondary + sale +
publicUrlId + not purged + launch category`.

| # | Public URL ID | Category | City relation | District relation | Review | Indexable | Canonical public path |
|---:|---:|---|---|---|---|---|---|
| 1 | 1 | apartment | missing | missing | no | yes | `/kvartiry/3-komnatnaya-kvartira-shchetinina-1/` |
| 2 | 2 | apartment | missing | missing | no | yes | `/kvartiry/2-komnatnaya-kvartira-krasnooktyabrskaya-2/` |
| 3 | 3 | house | missing | missing | no | yes | `/doma/kvartira-na-zemle-luchinskogo-3/` |
| 4 | 4 | apartment | missing | missing | no | yes | `/kvartiry/3-komnatnaya-kvartira-nizhneudinskaya-4/` |
| 5 | 5 | apartment | missing | missing | no | yes | `/kvartiry/2-komnatnaya-kvartira-kharitonova-5/` |
| 6 | 6 | apartment | missing | missing | no | yes | `/kvartiry/3-komnatnaya-kvartira-razdolnaya-6/` |
| 7 | 7 | apartment | missing | missing | yes | yes | `/kvartiry/2-komnatnaya-kvartira-prospekt-mira-7/` |
| 8 | 8 | house | missing | missing | no | yes | `/doma/dom-shlakovaya-10-sotok-8/` |
| 9 | 9 | apartment | missing | missing | yes | yes | `/kvartiry/2-komnatnaya-kvartira-budennogo-9/` |
| 10 | 10 | apartment | missing | missing | yes | yes | `/kvartiry/2-komnatnaya-kvartira-mikrorayon-zvezdnyy-10/` |
| 11 | 11 | apartment | missing | missing | no | yes | `/kvartiry/3-komnatnaya-kvartira-tsvetochnyy-11/` |
| 12 | 12 | house | missing | missing | yes | yes | `/doma/dom-druzhby-narodov-4-sotki-12/` |

## Convergence contract

The matrix proves a uniform production data gap: all 12 public/indexable
records lack the new `city` relationship. District relationships are also
empty. Four rows already carry a general review marker, but missing geo
relations are not represented by a dedicated safe mapping outcome.

`DC10-R11-01` owns the correction. It must use an idempotent Payload
migration/backfill, assign only evidence-backed city/district relations, route
unknown districts to review, prove rollback on a non-empty isolated fixture and
never infer a district solely from an address fragment. This diagnostic does
not authorize a production write.

## DOC IMPACT

- Owner artifact added: `docs/replan/DC11_R11_00_PREFLIGHT.md`.
- Reviewed without change: `01_PRD.md`, `02_PRODUCT_STRUCTURE.md`,
  `03_ARCHITECTURE.md`, `04_BACKLOG.md`, `05_RELEASE_CHECKLIST.md`,
  `PROJECT.md`, `OPERATIONS.md` and `DESIGN.md`.
- Current → target: unknown/stale aggregate inventory → exact redacted
  12-record production matrix; the geo correction remains pending in
  `DC10-R11-01`.

Production remains unchanged. No release or post-production monitoring task is
authorized or created by this evidence.
