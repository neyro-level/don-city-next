# DC10-R11-03 — Public surface cleanup preflight

Status: factual baseline for `AMS-DON-CITY-LIVE-CONFORMANCE` v13, EPIC-105.

## Baseline

- Branch: `codex/dc11-105-public-surface-cleanup`.
- Base: `b650b36726adea08b9ee1c57196dd97d09b95961` (`origin/main`).
- Delivery profile: `CRITICAL`; planned merge gate: `STANDARD` unless the final diff changes runtime risk.
- Production, DNS, secrets, schema and persistent data are outside this epic.

## Confirmed defects

| Public owner | Reachable source | Defect | Planned convergence |
| --- | --- | --- | --- |
| Homepage hero and empty state | `src/app/(site)/page.tsx` → `@ams/realtbase-ui/public/home-page` | Two anchors expose the non-canonical `/nedvizhimost` route. | Supply a grammar-owned active catalog URL through `HomePageDTO`; render the DTO value in both anchors. |
| Gone-property page | `src/app/(site)/public-route.tsx` → `@ams/realtbase-ui/public/gone-property-page` | The recovery CTA exposes `/nedvizhimost`. | Supply `projectUrls.primaryCatalog` from the app boundary and render it in the UI view. |
| Literal-href guard | `scripts/quality/no-literal-hrefs.mjs` | It scans only `src`, so reachable package UI literals are not rejected. | Extend coverage to `packages/ui/src` and retain explicit grammar exceptions only. |

Graph traversal confirms both UI modules are imported by active App Router entry points. The `/nedvizhimost` literals in `packages/contracts/src/fixtures.ts` are contract fixtures, not public runtime owners; they remain outside implementation unless a widened guard proves they affect production HTML.

## Surfaces already conforming

- Primary navigation and homepage service links are derived from `siteProfile`, `buildProjectUrl` and `projectUrls`.
- `PREPARED_OFF` categories are filtered out before navigation DTO creation.
- Sitemap entries are registry/profile gated and use canonical parsing/building.
- IndexNow validates the current canonical URL against the project grammar.

## Acceptance evidence plan

| Final criterion | Evidence |
| --- | --- |
| Public HTML exposes only allowlisted active routes through DTO/buildUrl. | Targeted UI/DTO tests plus the strengthened literal-href guard. |
| No `/nedvizhimost` or inactive CTA/link/sitemap/IndexNow. | Repository scan over runtime sources and navigation/sitemap/IndexNow verification scripts. |
| Href guard passes. | `pnpm guard:no-literal-hrefs` and its fail-first self-test fixture. |
| No boundary regression. | Typecheck, focused tests, architecture check only if imports or module boundaries materially change. |

## Unknowns and stop conditions

- Final changed-file set and risk remain to be confirmed after implementation.
- Any need to mutate production, DNS, secrets, schema or data stops this epic and requires a separate owner-authorized task.
