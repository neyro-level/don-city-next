# DON CITY Timeweb proof index

| Proof | Current evidence |
|---|---|
| Blueprint static contract | `pnpm verify:client-readiness` |
| Managed PostgreSQL connectivity | Authenticated production health and `DC10-R11-00` redacted inventory |
| Payload migrations | Versioned migration registry; release runs migrations only for a proved delta |
| Private S3 media | 92 documented media objects, authenticated media health and sampled checksum restore |
| Database backup and restore | Provider backup plus daily offsite `pg_dump -Fc`; isolated sampled restore passed |
| Exactly one jobs owner | `Invoke-DonCityServerInventory.ps1 -Action OperationalProof` |
| Persistent contour count | One runtime, one logical database and one bucket; staging resources are absent |
| Public release identity | Manual exact-main `release-main` run plus OCI revision label |
| Live smoke | One bounded production smoke inside the final release stage |

Independent continuous monitoring is intentionally not a project stage. The
release performs a bounded availability check and ends; it does not schedule a
second monitoring or reconciliation task.
