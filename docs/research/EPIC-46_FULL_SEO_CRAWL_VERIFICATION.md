# EPIC-46 — full SEO crawl verification

Date: 2026-09-26
Exact staging candidate: `d8b7d63dd7d594524bfcb0626a4fb1348d9e1765`
Mode: `VERIFY + FULL + CATALOG`
Verdict: `PASS (STAGING CANDIDATE)`

The owner authorized an exact-head rollout to the existing isolated staging
contour and a temporary synthetic non-PII lifecycle fixture with cleanup.
Production, DNS, production data, permanent secrets and indexing state were not
changed.

## Traceability

- Runtime candidate and fix commit:
  `d8b7d63dd7d594524bfcb0626a4fb1348d9e1765`.
- Evidence-complete branch head before this traceability update:
  `7556c6f09eca172df86d5816aab9cb5d2628da08`.
- Task Manager verification: `dcv4-task-46-verify` — closed with PASS evidence.
- Discovered lifecycle defect: `dcn-task-46-fix-public-410` — resolved and
  closed.
- Owner staging decision: `dcn-task-46-staging-verification-gate` — closed
  after explicit authorization.
- Canonical requirements remain in the V4 master plan; this file records only
  exact runtime and check evidence for EPIC-46.

## Immutable candidate

- Image tag: `don-city-next:staging-d8b7d63`.
- Local build image ID:
  `sha256:e56d88e7285dfde6ef265b67cc6e6db946383e42e30f9388a4371827821890c0`.
- Loaded server image ID:
  `sha256:29bac2b2bc8af5e7c1cc37674dcd8a37874c9d1a4a85ace9d51597523dbd6dcb`.
- Compressed transport checksum:
  `754a0e5a587a558bd3b9ecfd60cfbb5a063198c342ee7ed26b6ac24f08414d57`.
- OCI revision label equals the exact candidate SHA.
- The image was built once for this SHA outside the server. The checksum
  matched after transfer; local and server transport tar files were removed.
- The container is `running`, restart count is `0`, loopback and public HTTPS
  smokes pass. Previous images `staging-b0078c3` and `staging-9ad95e2` and
  versioned Compose backups remain available for rollback.
- No migration or schema operation was required or run.

## Coverage

| Layer | Found / checked | Result | Evidence |
| --- | ---: | --- | --- |
| V4 registry pages | 40 / 40 | PASS | Exact Title, Description, one H1, canonical and page robots match the generated registry. |
| Query and pagination | 3 / 3 | PASS | Room query, page 1 and page 2 canonical/robots rules match the V4 contract. |
| Invalid / V3 routes | 6 / 6 | PASS | Unknown, prepared-off, four-segment, `/obekty/` and historical routes return real `404`. |
| Trailing slash | 1 / 1 | PASS | One-hop `308` and final relative `Location` are correct. |
| Sitemap owners | 6 / 6 | PASS | All children return XML; 9 unique canonical URLs have parseable meaningful `lastmod`; no query/global-root/candidate leak. |
| Staging indexing boundary | 40 / 40 | PASS | `X-Robots-Tag: noindex, nofollow`; deny-all staging robots remains active. |
| JSON-LD / NAP | 2 schema blocks + visible contacts | PASS | `RealEstateAgent` and `WebSite` parse; brand, URL, phone and address agree with site-settings and visible contacts. |
| Property lifecycle | active / mismatch / archived / gone / cleanup | PASS | Live fixture proved `200`, `301`, archived `200 + noindex`, canonical `410`, plus final `404` after deletion. |
| Rendered browser sample | 3 / 3 | PASS | Gone property, privacy and apartment catalog rendered expected H1/robots/canonical state with no console warning or error. |
| Webmaster evidence | not applicable | N/A | Staging is intentionally noindex; Webmaster belongs to production cutover/post-launch. |

Structural crawler: project-owned `scripts/verify-full-seo-crawl.ts`, Node
24.20.0, explicit manifest, sequential 500 ms delay (maximum 2 RPS), manual
redirect handling and 20-second request timeout. It stores no response bodies,
cookies, authorization headers, secrets or PII. The mutable lifecycle sequence
was verified separately by `verify:route-http` and rendered-browser evidence.

## Resolved findings

### SEO-46-01 — P2 — privacy H1 differed from the V4 owner mapping

- Root cause: the legal-document title independently owned the rendered H1.
- Fix: `src/project/legal-documents.ts` now uses the registry H1;
  `verify:company-contacts-legal` asserts both legal document titles.
- Final live proof: `/politika-konfidencialnosti/` renders exactly one H1,
  `Политика конфиденциальности`, with the expected title, canonical and
  `noindex, follow` page robots.
- Result: `RESOLVED`.

### SEO-46-02 — P0 acceptance blocker — public gone URL returned HTTP 200

- Live fixture on candidate `b0078c3` proved that the public property URL
  rendered gone content but returned HTTP `200`; only the dedicated lifecycle
  endpoint returned `410`.
- Root cause: the catch-all Server Component rendered the gone view but could
  not set a custom response status.
- Fix: `src/proxy.ts` now returns the existing accessible
  `createPropertyGoneResponse` from the request boundary when the canonical
  public property resolution is `gone`. Architecture and lifecycle regression
  guards require this boundary.
- Final live proof on `d8b7d63`: canonical public URL returns HTTP `410`,
  `X-Robots-Tag: noindex, follow`, accessible 410 markup and recovery link.
- Result: `RESOLVED`.

## Synthetic fixture proof and cleanup

The fixture slug was `epic46-synthetic-lifecycle-b0078c3`, with generated
`publicUrlId=1`. It contained only synthetic title/description and no contact,
lead, media, owner or other PII.

| State | Live result |
| --- | --- |
| active canonical | HTTP `200`, canonical property page |
| semantic mismatch | HTTP `301` to the canonical property path |
| archived | HTTP `200`; rendered page robots `noindex, follow` |
| gone | HTTP `410`; rendered H1 `Объект снят с публикации`; robots `noindex, follow` |
| trailing slash / unknown | HTTP `308` / `404` in the composed route matrix |
| cleanup | Payload delete succeeded; remaining fixture count `0`; former URL returns `404` on three consecutive checks |

The isolated one-off maintenance container has a loopback revalidation origin,
so its write hook cannot invalidate the long-running app container directly.
For each mutable fixture transition, the existing authenticated internal
revalidation route was invoked inside the app container for only the
`properties` and `property:1` tags. No secret value was logged or changed.

## Final rendered sample

| Route | Rendered H1 | Canonical | Page robots | Console |
| --- | --- | --- | --- | --- |
| synthetic gone property | `Объект снят с публикации` | none by gone contract | `noindex, follow` | no warnings or errors |
| `/politika-konfidencialnosti/` | `Политика конфиденциальности` | `https://doncity-home.ru/politika-konfidencialnosti/` | `noindex, follow` | no warnings or errors |
| `/donetsk/kvartiry/` | `Квартиры на продажу в Донецке` | `https://doncity-home.ru/donetsk/kvartiry/` | `index, follow` | no warnings or errors |

## Checks completed

- Live FULL crawler: PASS, 59 requests, 40 registry pages, 9 sitemap URLs,
  zero findings.
- Live `verify:route-http` with the gone fixture: PASS.
- Rendered browser sample: PASS; no console warnings or errors.
- `verify:property-lifecycle-routes`, `quality:architecture`, targeted Biome
  check and `typecheck`: PASS.
- Candidate Docker build: PASS, 23 static pages plus dynamic application/API
  routes.
- Earlier exact-branch checks reused because their scope is unchanged:
  `verify:company-contacts-legal`, `verify:seo-contracts`,
  `verify:route-resolver`, `verify:performance`, `verify:sitemap-indexnow`,
  `quality:guards` and lint (pre-existing warnings only).

SourceCraft Merge Gate has not run for this candidate. This document is staging
verification evidence, not a production release or CI attestation. The next
delivery step is exact-diff review, RISKY gate, merge and only then EPIC-47;
production still requires a separate owner command.
