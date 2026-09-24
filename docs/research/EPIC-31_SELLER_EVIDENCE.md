# EPIC-31 evidence — seller page

Status: ready for delivery review  
Date: 2026-09-24  
Base: `2843821094cfbb202aea877559f88bb72d78316d`

The approved requirement remains the master plan `EPIC-31`; this record only
connects its implementation and proof. No second product or SEO contract is
created here.

- **Canonical route and SEO:** `/prodat-nedvizhimost/` continues to consume the
  approved `SELL` registry row. The public composition keeps the exact SEO
  title, description, canonical URL and `index,follow` policy from that
  registry, while receiving the approved H1 separately from the route result.
- **Seller content:** `buildStaticMarketingPage` supplies a single reusable
  page composition with three factual blocks: assessment and sale plan,
  preparation and showings, and negotiation with legal accompaniment. It does
  not introduce claims about prices, NAP, guarantees or team members.
- **Lead boundary:** the route has UI `formKind="sell"` and
  `sourcePage="/prodat-nedvizhimost/"`. The established client adapter maps
  that UI context to the existing persisted intake type, so Payload schema,
  PII contract and external delivery behaviour are unchanged.
- **Regression boundary:** generic static pages still use their general form
  context and receive no seller process blocks.

Changed paths are limited to public static-page composition, its focused
verification script, the package command and EPIC-31 evidence records. No
database, migration, secret, DNS, server or production action is included.

The exact checks and the unavailable non-production runtime proof are recorded
in `EPIC-31_SELLER_VERIFICATION.md`.
