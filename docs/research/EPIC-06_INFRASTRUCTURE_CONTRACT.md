# EPIC-06 — Infrastructure Contract

Date: 2026-09-24

Mode: read-only discovery and documentation

Status: `PASS — target is suitable with explicit pre-deploy gaps`.

Historical note: the network row below captures the state before the
owner-authorized EPIC-03 private-NIC repair. The current Source of Truth is
`03_ARCHITECTURE.md`: the existing private route and authenticated read-only
PostgreSQL connectivity are proven. They must not be reintroduced as staging
blockers.

## Actual topology

| Layer | Verified state |
|---|---|
| Hosting | One existing DON CITY Timeweb server; no second server |
| OS | Ubuntu 26.04.1 LTS |
| Capacity | 2 GB RAM, 38 GB ext4 system disk, about 8% used at discovery |
| Runtime | No Nginx, Docker, Node.js, pnpm, npm, PostgreSQL client or DON CITY service |
| Application | No deployed application tree, process or container |
| Database | One Timeweb managed PostgreSQL 18 cluster, started, one instance |
| DB capacity | 1 vCPU, 1 GB RAM |
| DB exposure | Private/local only; public network disabled |
| DB backups | Automatic backup enabled and one artifact visible; explicit schedule not enabled; restore not proven |
| Network | Server public-only; database private-only; no shared private route |
| Domain | `doncity-home.ru` resolves elsewhere and does not return a usable application response |
| Object storage | No DON CITY S3 bucket was proven; do not provision one inside EPIC-06 |
| Jobs owner | None active because no application is deployed |

## Approved target shape, not a deployment

The existing server is suitable as the presumed production target after the following separately authorized gaps are closed:

1. attach the existing server to the existing managed-PostgreSQL private network;
2. install the host runtime required by the release design and host Nginx;
3. deploy an immutable image built outside the server;
4. render secrets from the dedicated DON CITY Secret Master scope into an approved runtime-only env file;
5. keep the application on loopback behind Nginx;
6. prove staging/noindex, migrations, backup restore, monitoring, rollback and live smoke before public production.

No public database exposure, second server, database move or replacement cluster is approved by this contract.

## Jobs ownership

The current repository has one proven runtime switch: `JOBS_AUTORUN`. Until a dedicated worker entrypoint is implemented and verified, exactly one deployed Next.js + Payload runtime is the jobs owner with `JOBS_AUTORUN=true`; every other runtime uses `JOBS_AUTORUN=false`.

The owner executes the Payload queues for system scheduling, imports, maintenance and lead delivery. A handover must start the candidate with jobs disabled, stop the old owner, verify zero active owner, then enable the candidate and prove backlog movement. Two simultaneous owners and a public jobs endpoint are forbidden.

## Capacity conclusion

The existing server is sufficient as an initial single-app staging/production candidate, but its 2 GB RAM leaves limited headroom. Capacity must be measured during staging build/runtime, import and representative catalog load. Production readiness cannot be claimed from inventory alone.

## Required future proof

- private PostgreSQL route and authenticated read-only SQL smoke;
- automatic-backup schedule/retention plus restore drill;
- immutable image and rollback identity;
- host Nginx/TLS/rate limits;
- exactly one jobs owner and queue movement;
- external `/healthz` monitor and independent alerts;
- S3/media decision based on actual media ownership;
- separate noindex staging database/secrets/host.

No infrastructure or production write was performed by EPIC-06.
