# CORE55 CP-02A PREFLIGHT

Status: `PASS / FROZEN`  
Plan: `AMS-DON-CITY-CORE55-POSTPROD`, v9 `APPROVED`  
Task: `dc55-task-68-preflight`  
Branch: `codex/dc55-epic-68`  
Base: `3d886d12f4816aace9682252c7872d4254a2fac8`

## Task Contract

- Goal: привести первый четырёхмесячный публичный продуктовый scope к §33D без включения production-индексации.
- Allowed writes: проектные contracts, Site Profile, public gateway/DTO policy, SEO registry, navigation/sitemap/route verification и документация evidence.
- Forbidden: production/public indexing switch, DNS, real feeds, secrets, destructive migrations, новостройки/ЖК и новые юридические дочерние услуги без factual contract.
- Delivery: один EPIC-68 branch/PR, review и один exact-head `RISKY` SourceCraft gate; merge не является production release.

## Frozen owner scope

| Surface | State after CP-02A | Canonical owner |
|---|---|---|
| Вторичные квартиры | active, gated | `/donetsk/kvartiry/` |
| Вторичные дома | active, gated | `/donetsk/doma/` |
| Земельные участки | active, gated | `/donetsk/uchastki/` |
| Коммерческая недвижимость | active, gated | `/donetsk/kommercheskaya/` |
| Юридический отдел | active hub only | `/yurist/` |
| Новостройки / ЖК | disabled | reserved `/novostroyki/*`, `/komplex/*` |

Only `secondary + sale` inventory may pass the public property policy. Empty or
factually incomplete listing owners remain non-indexable through their existing
content/data gates. CP-01 global `noindex` remains the release-level envelope;
this stream prepares correct public-mode contracts but does not expose them to
external indexing.

## Entry evidence and gaps

- PRD, Product Structure, Architecture and §33D agree on the first-four-month scope.
- Typed URL grammar already owns `kommercheskaya`; the canonical route is not reopened.
- Site Profile keeps commercial `PREPARED_OFF`, so navigation and route eligibility do not yet expose it.
- Public property policy and `R1PropertyDetailsDTO` still exclude commercial.
- SEO registry has apartments, houses, land and `/yurist/`, but no commercial root/geo owners.
- `/yurist/` is the only approved service route; no child legal route may be invented.
- Newbuild remains `PREPARED_OFF`; reserved namespace guards already cover `/novostroyki` and `/komplex`.
- No schema migration is required by current evidence: Payload already supports category `commercial` and market `newbuild`.

## Implementation boundary

1. Activate commercial only in Site Profile for the primary Donetsk geo.
2. Extend the secondary-sale public category/DTO contract to commercial without widening market or deal type.
3. Add commercial root and Donetsk geo registry owners. Root stays `noindex,follow`; geo owner may become indexable only after its factual gate passes.
4. Derive commercial navigation, route resolution and sitemap only from the same profile/registry/gate contracts.
5. Prove `/yurist/` exists while invented legal child routes do not.
6. Prove newbuild/ЖК remains absent from menu and sitemap and reserved CMS occupation remains blocked.
7. Record a review due four calendar months after the actual public-indexing date. Because that date does not yet exist, the release checklist must calculate and record `PUBLIC_INDEXING_ENABLED_AT + 4 months`; the review cannot activate newbuild without a new approved plan.

No speculative Wordstat values, inventory, services, claims or structured data
will be added. Existing owner-approved metadata may be minimally expanded to
name commercial real estate; later semantic evidence may refine copy without
changing the route owner.

## Verification and rollback

Required local proof: Source-of-Truth/reconciliation, generated-registry drift,
Site Profile, contracts/DTO, navigation, route resolver, reserved namespaces,
sitemap/content gates, structured data and isolated route HTTP matrix. Relevant
typecheck/lint/tests run once for the completed epic before delivery.

Rollback restores commercial to `PREPARED_OFF`, removes only its CP-02A public
policy/registry/menu projection, and retains the newbuild namespace guards.

Stop on source/inventory drift, an unplanned schema migration, unknown
production/test identity, any production indexing/feed/secret mutation,
destructive data action, or loss of the fail-closed global noindex envelope.
