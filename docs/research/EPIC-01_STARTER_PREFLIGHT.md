# EPIC-01 — starter preflight

Status: PASS WITH RECORDED UPSTREAM DRIFT  
Date: 2026-09-24  
Task: `dcn-task-01-preflight`

## Source and provenance

- DON CITY source of truth: `AMS-DON-CITY-FINAL-V3-GEO-DISTRICT-SEO` v6, `APPROVED`.
- Donor: `integrator-p/ams-realty-baza-starter`, read-only local reference only.
- Approved immutable baseline: `ca1b884d43e808d17e1eb18b05bad70ea358dd1c`.
- The donor `main` advanced to `48978f53dd02de6f148e9934140749ac1afa55dc` after plan approval. The approved commit remains reachable and was checked out detached; it, not current `main`, is the import source.
- Donor checkout is clean. It is never edited, pushed, or used for runtime.

## Inventory

- 1,337 tracked files; `pnpm-lock.yaml` exists; no tracked credential-, key- or non-example `.env` file was found.
- `.node-version`: `24.20.0`; `packageManager`: `pnpm@11.5.1`.
- Runtime matrix: Next.js `16.3.5`, React `19.2.8`, Payload / `@payloadcms/next` / `@payloadcms/db-postgres` `3.90.1`.
- Payload migrations are tracked under `migrations/`; the representative route is `src/app/(site)/obekty/[slug]/page.tsx` and imports public data access plus server metadata/JSON-LD helpers.
- `.env.example` exists. Its keys were inventoried without recording values. Database, Payload and outbound credentials remain absent from this repository until their dedicated Secret Master/server tasks.
- SourceCraft configuration contains manual `merge-standard` and `merge-risky` workflows only; no push or pull-request trigger was found.

## Safety and legal boundary

- `package.json` is private and no separate OSS license file or SPDX package license is present. This is an internal private-template reuse authorized by the owner and performed inside the same SourceCraft organization. External redistribution is not authorized by this evidence.
- Documented donor scripts include clone preparation, media-storage activation, migrations, owner bootstrap and demo import. None will run during preflight or baseline installation unless their dedicated approved task explicitly requires it.
- Production, DNS, server/DB connection, migrations, storage activation and secret mutation are outside this task.

## Version-sensitive check

- Payload's official installation documentation supports Next.js `16.2.6+`, Node.js `20.9+`, a PostgreSQL adapter and pnpm; the verified starter versions meet that compatibility envelope.
- Next.js 16 documentation confirms Node.js `20.9+` and React 19.2 support. The local Windows toolchain is Node `24.20.0` and pnpm `11.5.1`, matching the donor contract.
- Sources checked 2026-09-24: https://payloadcms.com/docs/getting-started/installation and https://nextjs.org/docs/app/guides/upgrading/version-16.

## Implementation handoff

The next task may materialize the detached approved tree into the isolated DON CITY worktree. It must preserve DON CITY `AGENTS.md`, all `docs/` source-of-truth files and the existing manual SourceCraft merge gate; it must not copy `.git`, `.beads`, caches, build output, secrets or donor production identity.

## Materialization result

- The verified application tree was imported from the detached approved commit. DON CITY `AGENTS.md`, `docs/` and `.sourcecraft/ci.yaml` were preserved; the only retained non-donor files are the existing project README and exact-head gate scripts.
- Content manifest: 1,226 eligible donor paths, 0 missing paths and 0 blob mismatches after staging. No tracked build/cache output or secret-named file was introduced.
- A Windows archive extraction initially corrupted 228 Cyrillic demo-media path names. The uncommitted, newly imported directory was replaced from the clean read-only reference and the exact blob comparison then passed. The donor checkout remains clean.
- `pnpm install --frozen-lockfile` passed for all three workspace projects without changing the lockfile.
- `pnpm typecheck` passed. `pnpm lint` completed with 19 pre-existing donor warnings (migrations, generated Payload types and intentional accessibility/layout `!important` rules). `pnpm build` passed and collected the dynamic `/obekty/[slug]` route among 17 application routes.
- `git diff --cached --check` reports pre-existing whitespace warnings in imported donor migrations; they are recorded as baseline drift and are not rewritten in this import task.
