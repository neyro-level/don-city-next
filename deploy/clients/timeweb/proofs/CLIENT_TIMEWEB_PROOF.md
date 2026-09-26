# Client Timeweb proof

| Proof | Starter blueprint status | Required client-staging evidence |
|---|---|---|
| Blueprint static contract | PROVEN | `pnpm verify:client-readiness --mode=fixture-client` |
| Real Managed PostgreSQL connection | PASS (STAGING) | Dedicated resource identity and authenticated health/database smoke |
| Clean Payload migrations | PASS (STAGING) | Full migration log from the immutable candidate image |
| Real Payload Admin S3 upload | NOT PROVEN | upload/read/delete plus expected access behavior |
| No client `MEDIA_DIR` dependency | PASS (STAGING) | S3 runtime health is `ok`; no local media volume is mounted |
| Physical backup schedule | NOT PROVEN | provider schedule and retention evidence |
| Restore drill | NOT PROVEN | staging restore, integrity check and smoke result |
| Exactly one jobs owner | PASS (STAGING BOUNDARY) | Staging health proves `JOBS_AUTORUN=false`; production ownership remains release scope |
| External monitoring and alerts | NOT PROVEN | uptime and critical-alert delivery evidence |
| Live smoke | PASS (STAGING) | HTTPS/noindex, 15 active routes, health and synthetic lead idempotency/cleanup |

Production approval is outside this file and requires the project release
procedure after every mandatory row is proven.
