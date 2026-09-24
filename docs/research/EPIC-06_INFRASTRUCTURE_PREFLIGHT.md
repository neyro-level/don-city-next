# EPIC-06 — Infrastructure / Secret Master Preflight

Status: `PASS — actual single-server topology observed read-only`.

## Entry evidence

- Master plan v6 remains `APPROVED`; the worktree is synchronized with current `origin/main`.
- Dedicated `DonCity Server/prod` Secret Master scope exists and its deploy-key fingerprint was verified without recording values.
- Native SSH with the dedicated deploy identity passes against `doncity-server`.
- Timeweb read-only API confirms the server and one managed PostgreSQL 18 cluster in the same project.

## Safety boundary

No server package, service, network, database, DNS, Secret Master value or production state was changed. Exact addresses, logins, passwords, tokens, database aliases and full URLs remain outside Git.

The actual and desired topology contract is recorded in `EPIC-06_INFRASTRUCTURE_CONTRACT.md` and `docs/OPERATIONS.md`.
