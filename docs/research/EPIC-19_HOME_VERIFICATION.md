# EPIC-19 — HOME: verification

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

| Acceptance condition | Evidence | Verdict |
| --- | --- | --- |
| HOME metadata is exact. | `verify:home-page` injects conflicting CMS SEO and asserts exact `HOME` registry title, description, canonical and `index,follow`. | PASS |
| The page has agency/brand intent in its single H1. | The same verifier asserts `HomePageDTO.title === HOME.h1`, whose approved value names the DON CITY real-estate agency in Donetsk. | PASS |
| Home remains separate from ALL-property intent. | `verify:seo-contracts` and the registry retain distinct `HOME /` and `ALL /donetsk/` entries. | PASS |
| Public data boundary and import direction remain valid. | `pnpm typecheck` and `pnpm quality:architecture` pass. | PASS |

No CMS data, Payload schema, production/DNS, server or secret state was changed.
