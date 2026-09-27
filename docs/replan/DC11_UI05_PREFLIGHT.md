# DC10-UI-05 — Distinct marketing pages preflight

Status: PREFLIGHT COMPLETE

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13

Base: `4295a6388ab76e4ca6ed4ffd7fa074d35a7acc0c`

Branch: `codex/dc11-118-distinct-marketing-pages`

## Factual baseline

- Sell, Lawyer, About and Contacts resolve through one DTO builder and one
  `MarketingPageView` card grid.
- Their copy and lead contexts are already page-specific and factual: seller
  process, legal services, company/NAP and office/NAP respectively.
- All four currently render the same visual and semantic section composition,
  so page intent is expressed only by copy.
- Every page has one lead form and no competing primary action. Sell uses
  `formKind=sell`, Lawyer uses `legal`, About and Contacts use `general`.
- Historical corporate components are not public package exports and are not
  reachable from these routes. They include broader inactive concepts and are
  not promoted by this epic.
- Graph reachability confirms one shared view feeds the four target routes and
  the DTO builder is the only static composition owner.

## Page briefs and target compositions

| Page | Factual content owner | Target semantic pattern | Primary conversion |
| --- | --- | --- | --- |
| Sell | seller process sections | ordered process steps | one seller lead form |
| Lawyer | legal service sections | service articles | one legal lead form |
| About | company, manager and legal owner | trust/fact narrative | one general lead form |
| Contacts | public NAP and opening hours | contact/access facts | one general lead form |

All patterns remain DTO-driven. They do not introduce testimonials, metrics,
licenses, guarantees or other unverified claims.

## Convergence contract

1. Add a pure slug-to-composition contract with four unique kinds and a generic
   fallback for other static pages.
2. Compose four semantic, responsive section patterns from the existing DTO.
3. Keep one shared hero, one H1, H2 section titles and one lead form.
4. Add a deterministic page-composition guard covering kind, content, lead
   context, heading semantics and mobile-to-desktop layout classes.
5. Preserve Payload, Public Gateway, SEO registry, route grammar and lead
   intake contracts unchanged.

## Risk and document impact

Risk is STANDARD. The change is public UI composition only and reuses the
existing Card, layout and lead-form owners. `docs/DESIGN.md` will record the
four composition patterns. Production, DNS, database, schema and secrets stay
unchanged.
