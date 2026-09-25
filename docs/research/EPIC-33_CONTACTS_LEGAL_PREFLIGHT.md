# EPIC-33 — Company, contacts and legal preflight

Status: PASS — implementation may start
Date: 2026-09-24
Task: `dcv4-task-33-preflight`
Base: `a6b734670dc71b73960b8f1bd069459b8309967e`

## Task Contract

- **Goal:** replace starter/fixture company, contact and legal-route content with
  the approved DON CITY R1 composition for `/o-kompanii/`, `/kontakty/`,
  `/politika-konfidencialnosti/`,
  `/soglasie-na-obrabotku-personalnyh-dannyh/` and `/spasibo/`.
- **Non-goals:** production publication, DNS, Timeweb, Secret Master, Payload
  schema or migration work, bank details, or inventing business claims.
- **Platform contract:** AMS Realty Platform Core 3.0 + Payload. Payload is
  the only schema, auth and migration owner; public pages receive only the
  allow-listed `PublicNapDTO` from the Public Gateway.
- **Delivery profile:** `CRITICAL`; the epic uses its approved
  `MERGE_AFTER_GATE` delivery and requires one exact-head `RISKY` gate before
  merge.
- **Realty profile:** `catalog` / `BUILD`; R1 public modules only.
- **UX scope:** `PUBLIC_COMMERCIAL`; the existing Product Structure page
  matrix is the brief. The legal pages are `noindex`; the thank-you page is
  `noindex,nofollow`.
- **Design intake:** completed in EPIC-16. Reuse semantic tokens, Manrope,
  starter layout primitives and the existing public-route composition. No
  second UI system or dependency is permitted.
- **Ownership:** shared public-page composition and project content; Page
  routes remain thin compositions. Contact data comes from `site-settings`,
  not duplicated literals in views.
- **Data/migration/auth:** no migration, no new access policy and no raw
  Payload document in UI. The existing global read is explicit-select and is
  mapped into `PublicNapDTO` before rendering.
- **Integrations/async:** none. Map embedding is out of scope until a
  safe, approved provider contract exists.
- **Official docs check:** not needed — no version-sensitive framework or
  Payload API change is planned.

## Verified entry conditions

1. V4 master plan `v7` is `APPROVED`; Task Manager reconciliation is `CLEAN`.
2. The canonical static routes and their exact registry metadata already exist:
   `ABOUT`, `CONTACTS`, `PRIVACY`, `CONSENT` and `THANKS` in the generated SEO
   registry; the dedicated route files delegate to the public resolver.
3. `approvedSiteSettings` already holds the owner-provided legal name and
   public NAP: office address, telephone, e-mail, opening hours and canonical
   `https://doncity-home.ru` URL. `toPublicNapDTO` is the only public allow
   list, and the footer/header contact helpers consume that DTO.
4. The owner later approved the operator's registration facts specifically for
   the legal documents: INN `930800235710`, OGRNIP `323930100111747`, assignment
   date `26.01.2023` and the legal address in Donetsk. These facts remain
   outside `PublicNapDTO`, contact views and CMS seed data.
5. The legal operator is Individual Entrepreneur Plakhtienko Natalia
   Gennadievna. Vladimir Sergeevich Plakhtienko may be identified on the ABOUT
   page as manager and founder and, where needed, as a contact person. No power
   of attorney or authority claim is made.

## Scope matrix

| Route | R1 role | Required outcome |
| --- | --- | --- |
| `/o-kompanii/` | company trust | verified company facts, working approach and next action; no invented claims |
| `/kontakty/` | contact/visit | DTO-backed NAP, schedule, phone/e-mail actions and safe address behavior |
| privacy / consent | legal compliance | actual approved legal text, route navigation and the consent-version contract; no fabricated clauses |
| `/spasibo/` | lead result | explicit submission result, next step and safe way back to site navigation |

## Owner decision for legal text

On 2026-09-25 the owner approved the complete legal-document set represented by
the starter routes and legal UI as the canonical scope. The starter contained
the route and presentation structure but only fixture/TODO copy, so the project
text is completed for the actual DON CITY processing scenario and the approved
operator details. The legal documents do not publish the operator's telephone
number. Final publication remains subject to the normal release checklist.

## Proof plan

- `pnpm verify:site-settings` proves the safe NAP DTO and contact links.
- `pnpm verify:route-resolver` proves all five canonical routes and robots
  modes.
- The implementation task adds exact route/content/SEO assertions for this
  epic, then runs targeted typecheck and scoped lint as needed.
- Browser/accessibility proof belongs to the verification task and uses a
  valid local runtime; no production data or server connection is used.

## Stop conditions

- V4 source or Task Manager inventory drift;
- a request to expose private banking details, broaden the approved legal facts
  beyond the owner decision, or make a production/irreversible external change;
- a new legal claim or map-provider integration outside the approved R1 scope.
