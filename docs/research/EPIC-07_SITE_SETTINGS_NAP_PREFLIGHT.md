# EPIC-07 preflight — Site Settings / NAP

## Task contract

- Goal: add one Payload `site-settings` Global, one public NAP DTO and one
  `RealEstateAgent` JSON-LD input; remove the starter's dummy identity from
  public composition.
- Platform: AMS Realty Platform Core 3.0 + Payload 3.90.1.
- Delivery profile: `CRITICAL`; schema, public contact data and structured data
  make the eventual implementation `RISKY`.
- Boundaries: Payload Global → Public Gateway explicit select → NAP DTO →
  header/footer/contact page and `RealEstateAgent` JSON-LD.
- Non-goals: production NAP publication, secret changes, DNS, database writes,
  migration application or inventing business identity data.

## Evidence reviewed

- `docs/03_ARCHITECTURE.md` defines `site-settings Global → NAP DTO → public
  pages / JSON-LD` as the required ownership chain.
- `docs/research/EPIC-03_DISCOVERY.md` confirms only a candidate baseline:
  brand `Дон Сити`, city Donetsk and the address on Shakhtostroiteley Boulevard.
- The owner has now confirmed the canonical publication set for DON CITY:
  IP Plakhtienko Natalya Gennadyevna; office at 16 Bulvar
  Shakhtostroiteley, Donetsk, Donetsk People's Republic; public phone
  `+7 (949) 110-10-10`; public email `doncity-info@yandex.com`; working hours
  daily 09:00–18:00; and the canonical corporate site
  `https://doncity-home.ru`.
- This confirmation authorizes replacement of all starter/demo identity and
  contact fallbacks in the EPIC-07 ownership chain.
- The owner also supplied registration and banking details. They are outside
  the public NAP and `RealEstateAgent` scope, so they are intentionally not
  copied into public site settings, JSON-LD, source control, or this preflight.

## Owner decision — confirmed

The exact public NAP publication set is approved. The implementation may
derive a normalized E.164 phone from the approved display phone, while keeping
the display form for visible page content. No second contact source is allowed.

## Safe implementation boundary

The implementation creates the complete ownership chain in one RISKY stream:
Payload Global, public DTO and `RealEstateAgent` input. It must not publish
placeholders, private banking details, or a second contact source.

## Blocker resolution acceptance

EPIC-07 can implement the complete chain in one RISKY stream, verify allowed
public DTO fields and confirm that header, footer, contacts and
`RealEstateAgent` all derive from the same approved NAP record.
