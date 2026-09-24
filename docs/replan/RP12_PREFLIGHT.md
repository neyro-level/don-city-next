# RP-12 preflight — two-profile proof and replan closure

## Entry

- Base: SourceCraft `main@33120a58f964e591bd633fceab88cb6fedc70222` after RP-11 delivery.
- Branch: `codex/rp-12-two-profile-proof`.
- RP-00…RP-11 epics are closed with execution ledgers.
- Scope is proof/closure only. Production, DNS, server, database and secret mutations remain forbidden.

## Exact scope

1. Add immutable `donetsk-single` and `multi-geo` fixture inputs outside `src/**`.
2. Exercise the portable Profile → grammar → registry → sitemap pipeline for both fixtures.
3. Prove Donetsk ACTIVE in both profiles and Makeevka apartments ACTIVE only in `multi-geo`.
4. Prove switcher/menu/route/indexability/sitemap matrices and source-tree non-mutation.
5. Archive the RP-00 inventory, refresh portable upstream candidates and write `RP12_DONE.md`.
6. Preserve the exact APPROVED master-plan bytes and record the §35 replan checklist delta in closure evidence; editing the source plan would invalidate the imported graph hash.

## Verification

- Dedicated two-profile matrix.
- Existing Site Profile, URL grammar, resolver, registry, sitemap, navigation and gateway guards.
- Typecheck, lint, architecture and production build.
- One manual exact-head SourceCraft RISKY Gate before merge.

## Stop conditions

- V4 source/inventory drift.
- A fixture requires a product-source edit merely to switch profiles.
- Live infrastructure, indexing or destructive mutation becomes necessary.
