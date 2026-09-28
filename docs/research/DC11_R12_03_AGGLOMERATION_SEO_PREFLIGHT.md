# DC10-R12-03 — agglomeration SEO research preflight

## Exact baseline

- Canonical site: `https://doncity-home.ru`.
- Canonical product/URL decisions: `docs/02_PRODUCT_STRUCTURE.md`.
- The merged R12-02 model can represent approved nearby localities, but it
  approves none and activates no nearby route.
- `makeevka` exists only as a code-level candidate alias and test fixture. It is
  not an owner-approved whitelist entry and is not evidence of search demand.
- The existing SEO registry contains no measured Makeevka/agglomeration demand.
  Donetsk district Wordstat rows cannot be reused as locality evidence.
- Owner decision `OD10-04` (public slug and locality whitelist) remains open
  until this research is complete.

## Available evidence channels

| Channel | Preflight status | Permitted use |
| --- | --- | --- |
| Live site and public search | READY | Confirm current indexable surface and dated SERP composition. |
| Yandex Wordstat SearchAPI | READY THROUGH CANONICAL SECRET MASTER FALLBACK | The MCP namespace is not exposed in this task, but `YANDEX_API_KEY` and `YANDEX_FOLDER_ID` exist in `ams-server/prod`; values stay process-local. |
| AMS SEO / Topvisor | READ-ONLY CREDENTIAL AVAILABLE; LOCAL LAUNCHER ABSENT | Existing evidence or a price-check only. No paid task may start without a separate price confirmation. |
| Yandex Webmaster | OPTIONAL / ACCESS REQUIRES CHECK | May provide site queries, but never substitutes for regional demand or SERP competitors. |

The globally configured Wordstat MCP still advertises a legacy Doppler launch
path. This task will not use that fallback: all credentials must come from
Secret Master, as required by the approved owner contract.

## Research contract

1. Treat `Макеевка` as a hypothesis, not an approved locality.
2. Record the observation date, exact phrase, region/filter behavior and source
   for every demand claim.
3. Query at least the general locality cluster and the active product clusters:
   apartments, houses, land and commercial property. Candidate phrases are
   hypotheses until the API returns data.
4. Preserve Wordstat counts, Webmaster impressions and SERP observations as
   different metrics; never combine them into one volume.
5. Inspect current search results for commercial intent, dominant domains and
   locality spelling/slug signals. Search snippets are evidence, not proof of
   traffic.
6. Recommend one public slug, an explicit locality whitelist decision and a
   ranked route list. A weak or ambiguous result must recommend `DO NOT
   ACTIVATE`, not a thin page.
7. Keep nearby routes unreachable, absent from sitemap/navigation and outside
   indexability throughout this epic. Activation belongs only to R12-04 after
   an explicit owner decision.
8. Store detailed measurements in
   `docs/research/DC11_R12_03_AGGLOMERATION_SEO_RESEARCH.md`. Update the Product
   Structure only with the resulting recommendation and its pending-owner-gate
   status; do not create a second SEO Source of Truth.

## Acceptance matrix

| Required outcome | Planned evidence |
| --- | --- |
| Dated search evidence | Query/source/date table with links or tool provenance. |
| Wordstat evidence without invented numbers | Raw returned phrase/count/region rows; unavailable calls are marked unavailable, never estimated. |
| SERP evidence | Dated result-domain and intent sample for the priority phrases. |
| Recommended slug | Spelling evidence plus collision check against current URL grammar. |
| Locality whitelist recommendation | Explicit `RECOMMEND APPROVE` or `DO NOT ACTIVATE`, with limitations. |
| Route priorities | Ranked hub/category candidates; unsupported routes explicitly excluded. |
| No accidental activation | Git diff proves no route, sitemap, navigation, seed approval or production mutation. |

## Stop conditions

- Wordstat or SERP data cannot be attributed to a date/source/region behavior.
- A paid Topvisor action is required but has no price-check and explicit
  confirmation.
- Evidence conflicts on locality spelling or commercial intent and cannot be
  resolved without owner input.
- Any step would approve the locality, expose a route, mutate production/DNS,
  or write secrets.

## Document impact

- Changed: this project-owned preflight evidence.
- Reviewed without change: PRD, Product Structure, Architecture, Backlog,
  Release Checklist, Project and Operations.
- CURRENT→TARGET: current public surface remains Donetsk-only; target is a dated
  recommendation for the later owner gate, not route activation.
