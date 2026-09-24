# RP-09 preflight — navigation, breadcrumbs and internal linking

- Task: `dcv4-task-62-preflight`
- Base: `origin/main@14100e6cf8901cfe22486f115ec78bb759b240f6`
- Branch: `codex/rp-09-navigation-linking`
- Scope: public R1 navigation, breadcrumbs and contextual links generated from the Site Profile, canonical URL grammar and SEO registry.
- Risk: `STANDARD`; no schema, migration, auth, infrastructure or production mutation.

## Confirmed inputs

- RP-08 is merged and the city-first resolver is the only public route owner.
- `siteProfile` owns active categories and `geoMode`; `buildProjectUrl` owns every internal path.
- The SEO registry owns published page states. District/facet links may be emitted only for registry entries that are active and have passed their content gate.
- Public catalog DTOs already expose canonical property links and actual city/district values.
- The shell contract supports nested navigation, but the current UI does not render children yet.

## Implementation contract

1. Add one project-owned navigation/linking module that derives menu, breadcrumbs and contextual links from Profile + grammar + registry.
2. Render the R1 desktop/mobile menu, including active category children; hide the geo switcher for `SINGLE_GEO`.
3. Add canonical breadcrumbs and contextual links to catalog/property views.
4. Never emit query-string equivalents when a path owner exists.
5. Add a fixture crawl that resolves every generated internal link and rejects `404`, redirects and owned query equivalents.

## Stop conditions

- Any need to change the route grammar, schema, production data, DNS or secrets.
- Any attempt to publish a candidate district/facet before its content gate passes.
- Source/inventory drift or a generated link whose target is not canonical `200`.
