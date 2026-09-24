# RP-02 preflight — Platform / Project split and hardcode guards

Status: `PASS`
Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` `v7 APPROVED`
Task: `dcv4-task-55-preflight`
Base: `main@ff2c7498887d3560cd72cfa4a7437e7a9bd5d53c`

## Verified current state

- `src/platform/**` does not exist. Reusable behavior currently lives under
  `src/core/**`; `src/project/**` owns DON CITY configuration and Payload
  collections.
- Existing `src/core/seo/catalog.ts` and `src/core/seo/site.ts` import Project
  configuration directly. They cannot be moved unchanged because RP-02
  requires Platform to receive typed inputs and never import Project.
- Dependency Cruiser `18.2.0`, `.dependency-cruiser.mjs` and
  `quality:architecture` already exist. No new linter is needed.
- The existing architecture guard has a self-test harness suitable for a
  project-literal guard.
- Merged `main` has no geo collections, taxonomy implementation or
  `publicUrlId`. Those surfaces exist only in the preserved dirty EPIC-08
  worktree and are explicitly owned by RP-05/RP-06 for compatible reapply.
  RP-02 must not copy, merge, reset or modify that WIP.
- Existing public routes are V3 behavior. RP-02 may relocate/invert portable
  helpers but must not introduce V4 route semantics; RP-04…RP-07 own them.

## Implementation boundary

1. Create Platform-owned portable SEO/config functions by dependency
   inversion: Project values are supplied by callers/adapters.
2. Move only behavior already merged in `main`; create no substitute geo,
   taxonomy or `publicUrlId` implementation ahead of their owning epics.
3. Add `guard:platform-no-project-literals` using the existing Node quality
   harness and cover `donetsk`, `Донецк`, `ДНР`, `ДОН СИТИ`, `doncity`.
4. Add a Dependency Cruiser rule forbidding `src/platform/**` imports from
   `src/project/**`, plus self-test evidence.
5. Record reusable upstream candidates in `docs/UPSTREAM_CANDIDATES.md`.
6. Prove unchanged public behavior with targeted SEO/contracts checks,
   architecture checks, typecheck and `verify:schema`.

## Risk and stop conditions

Risk is `RISKY`: imports and module boundaries change. Stop on schema output
drift, public metadata/URL behavior change, need to consume dirty EPIC-08 WIP,
or any production/DNS/server/database/secret action.
