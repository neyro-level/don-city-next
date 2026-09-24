# EPIC-03 — Access Preflight

Status: `PASS — dedicated DON CITY access verified`.

- Master plan v6 and current `origin/main` are verified in the task-owned worktree.
- The dedicated `DonCity Server/prod` Secret Master scope contains the required deploy identity and Timeweb API credential names.
- The owner-authorized deploy key was materialized only in the local Windows SSH store. Its SHA-256 fingerprint matches Secret Master; the file ACL permits only the current Windows account and SYSTEM.
- Native OpenSSH authentication passed with `IdentitiesOnly=yes`, strict host-key checking and the dedicated deploy role.
- Read-only host identity passed: `doncity-server`, Ubuntu 26.04.1 LTS.

No key, password, token, private address, database name, database login or full connection URL is recorded in git or this report. No server, database, DNS, Secret Master or production mutation was performed.

The former access blocker is resolved. Runtime, database, inventory and NAP findings are recorded in `EPIC-03_DISCOVERY.md`.
