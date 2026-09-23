# EPIC-01 — targeted verification

| Acceptance surface | Result | Evidence |
| --- | --- | --- |
| Exact donor baseline | PASS | Detached `ca1b884d43e808d17e1eb18b05bad70ea358dd1c`; current donor `main` was not imported. |
| Imported tree integrity | PASS | 1,226 selected paths, zero missing and zero differing staged blobs; manifest at `EPIC-01_BASELINE_MANIFEST.md`. |
| Dependency contract | PASS | `pnpm install --frozen-lockfile` passed without lockfile change; Node `24.20.0`, pnpm `11.5.1`. |
| Runtime surface | PASS | `pnpm typecheck`, `pnpm contracts:test` and `pnpm build` passed; build manifest includes `/obekty/[slug]`. |
| CI policy | PASS | Project manual-gate self-check passed. The two workflows are `merge-standard` and `merge-risky`; `on.push.branches` is empty, so branch pushes and PR creation do not start validation. |
| Production/data safety | PASS | Docker, WSL, server/DB connection, migrations, storage activation, DNS and Secret Master mutations were not run. |

Inherited baseline note: `pnpm lint` exits successfully with 19 warnings. `git diff --cached --check` separately reports pre-existing whitespace in donor files. Both are recorded baseline drift, not altered in EPIC-01.
