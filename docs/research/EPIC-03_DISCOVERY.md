# EPIC-03 — Actual Inventory / Geo / NAP Discovery

Date: 2026-09-24
Mode: read-only discovery followed by an owner-authorized server-network repair
Status: `PASS — access, private transport and read-only inventory verified; publication NAP remains an explicit EPIC-07/production owner gate`.

## Scope and safety

The discovery used the dedicated DON CITY Secret Master scope, native SSH, read-only Timeweb Cloud API calls, the authenticated Timeweb control panel, DNS/HTTP probes and public-source inspection. After owner authorization, it repaired only the missing Ubuntu configuration for the already attached private NIC, installed the matching PostgreSQL client and stored the temporary database credential in Secret Master. It did not copy credentials into git/logs, change provider VPC membership/firewalls, run migrations/imports, restart services, alter DNS or deploy production.

## Confirmed server baseline

- One existing Timeweb server is verified as the DON CITY target: provider panel name `doncity-home`, operating-system hostname `doncity-server`.
- OS: Ubuntu 26.04.1 LTS; dedicated deploy-role SSH is healthy.
- Capacity at discovery: 2 vCPU class from the Timeweb record, 2 GB RAM and a 38 GB ext4 system disk; approximately 8% of the disk was used.
- No Nginx, Docker, Node.js, pnpm or npm is installed. PostgreSQL client 18 was installed only for the authorized read-only database smoke.
- No DON CITY, Payload, Node, Nginx, Docker or PostgreSQL service/container is running.
- No application tree exists in `/opt`, `/srv`, `/var/www` or the deploy home.
- The server is currently a clean deployment target, not an old DON CITY application host.

## Confirmed database baseline

- The same Timeweb project contains exactly one managed database cluster.
- Engine/status: PostgreSQL 18, started; one database instance and one managed administrator record.
- Capacity: 1 vCPU and 1 GB RAM.
- Exposure: private/local network only; public network is disabled.
- Backups: automatic backups are enabled, a backup artifact exists, but an explicit backup schedule is not enabled.
- Secure-connection enforcement is currently disabled in the provider record and must be reviewed before release.
- The service/database aliases were verified through the provider API but are intentionally not copied into git.

## Network and consumer smoke

- The provider panel confirms that the app server and managed PostgreSQL cluster are already attached to the same private VPC.
- The server's second NIC existed, but Ubuntu Netplan configured only the public NIC. The provider-assigned private address therefore appeared in the panel while the operating system routed database traffic through the public gateway.
- An owner-authorized repair added a dedicated Netplan definition for the existing private NIC and address. The public NIC, public IP, SSH path, provider VPC, firewall and database exposure were not changed.
- Route inspection now selects the private NIC, and a PostgreSQL TCP probe to port 5432 passes.
- Provider/API inventory confirms PostgreSQL 18 is started, private-only and public networking is disabled. It contains one instance (`default_db`) and one managed administrator.

The temporary connection fields and canonical `DATABASE_URL` now live in `DonCity Server/prod` Secret Master. Authentication passed through the private NIC. Because the temporary password appeared in the owner conversation, it must be rotated and the corresponding Secret Master values replaced before any application deployment. Public database access is neither required nor approved.

## Authenticated database inventory

- PostgreSQL server version: 18.6.
- Consumer smoke: PASS as the managed administrator against `default_db` using a `READ ONLY` transaction.
- Non-system schemas: `public` only.
- User tables: `0`.
- Views: `0`.
- Materialized views: `0`.
- Feed/source, category, locality, `districtRaw`, subtype and unit values in the database: none; the database is a clean target, not a legacy inventory source.
- No SQL mutation, migration, import, sequence operation or business-row read was performed.

## Domain and existing-site state

- `doncity-home.ru` resolves to a different host than the verified DON CITY Timeweb server.
- TCP 80/443 accept connections, but the observed HTTPS handshake fails and HTTP returns an empty response.
- The verified Timeweb server has no web runtime, so the domain is not currently serving from it.
- No existing-site page/assets package could be fetched from the domain during this discovery.

## Inventory and geo evidence

Canonical database/feed counts are zero because the authenticated metadata inventory found no user relations. No legacy feed/source, category, locality, district, subtype, unit or property rows exist to migrate from this database.

Public, non-canonical evidence useful for later reconciliation:

- A current DNR.RED company profile attributes three visible offers to DON CITY: commercial rental, dacha/house sale and apartment sale.
- The visible sample confirms Donetsk and the Kalininsky, Leninsky and Proletarsky districts.
- Additional current third-party listings mention Budyonnovsky, Kyivsky and Kuibyshevsky districts; these are candidates, not canonical `districtRaw` values.
- Visible property shapes include apartments, houses/dachas and commercial premises. Observed attributes include room count, area, floor/floor count and plot area. No canonical subtype/unit dictionary is inferred from these pages.
- Public profiles link to Telegram and DNR.RED, but no authoritative YRL/feed URL or feed ownership contract was found.

Public evidence:

- <https://dnr.red/donetsk/company/don-siti-123>
- <https://reestr.rgr.ru/agentstvo-plahtienko-n-g-an-don-siti-22147/>

## NAP candidate, not canonical publication data

Two independent current public profiles agree on the brand `Дон Сити`, city `Донецк` and address `бульвар Шахтостроителей, 16`. The RGR registry also provides public contact details and organization evidence.

These values are a verified candidate baseline, not yet the publishable canonical NAP. EPIC-07 must not copy phone, email, schedule or legal identity until the owner compares them with the actual Yandex Business card and explicitly confirms the one canonical set.

## Exit evidence

- SSH access: PASS.
- Server identity/runtime inventory: PASS.
- Managed database identity/backups: PASS.
- Provider API read path: PASS.
- PostgreSQL protocol reachability from server: PASS over the private NIC.
- Authenticated SQL/table inventory: PASS in a `READ ONLY` transaction; zero user relations.
- Public domain content fetch: FAIL (TLS/empty-response state).
- Public NAP/offer candidate discovery: PASS, non-canonical.
- Secret Master: PASS; database connection fields stored without values in git/logs. Rotation required before deployment because the temporary password appeared in the owner conversation.
- External writes: owner-authorized Netplan file, PostgreSQL client package and Secret Master entries; no provider, database, DNS or production mutation.
