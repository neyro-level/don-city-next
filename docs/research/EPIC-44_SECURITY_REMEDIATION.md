# EPIC-44 security remediation

Date: 2026-09-25
Baseline scan: `f6105b3b-e75c-45c7-b709-c54d871dc5a2`
Baseline revision: `274fc7602a35006319ab760cb26a03d0960da23c`

The baseline scan reported two high and eight medium findings. The two high
findings were removed in commit `809fab2cbb414cc47d3c1d6ca3fe64f336bb3d69`.
This stream closes the remaining eight medium findings.

The exact-head diff scan `8312bf1a-5fde-4fb0-b664-4dcbce8e86ab` then found
one medium and three low follow-up paths. All four were remediated before the
EPIC delivery gate: one regex Nginx location now applies the same policy to the
canonical and slash-suffixed login/password routes, and duplicate-generated
feed issues now consume the independent issue budget before persistence.

| Finding | Remediation | Regression evidence |
| --- | --- | --- |
| IPv4-mapped IPv6 SSRF bypass | Hexadecimal mapped IPv4 is converted and classified before dispatch. | `verify-safe-outbound` covers loopback and link-local hexadecimal forms. |
| Mutable consent evidence | Normal owner updates are denied for the consent group; System Gateway retention remains available. | Payload integration proves an owner cannot alter accepted/version/time while operational fields remain editable. |
| Unbounded public bodies/rate state | Lead and revalidation JSON bodies are stream-bounded; decisive controls run first; rate maps use capped TTL eviction; Nginx applies matching limits. | Security-boundary, topology and type checks. |
| Partial mutations from failed feeds | Production import starts one Payload Postgres transaction and threads its `transactionID` through repository writes; unsafe parser completion and any budget failure roll back. Disabled sources fail before fetch. | Unit rollback proof plus real PostgreSQL rollback/commit visibility proof. |
| Unbounded feed work | One run has total offer, issue, conservative database-work and absolute duration budgets. | Focused budget test proves a post-write overflow rolls back and closes the source stream. |
| Wrong login throttle path | Nginx limits the actual Payload login, forgot-password and reset-password endpoints, including slash-suffixed equivalents. | Security-boundary and production-topology checks reject exact-only auth locations. |
| Undisposed outbound streams | Stream results expose deterministic cancel; rejected responses and parser early exits cancel upstream readers and release dispatchers. | Feed-parser and outbound-client regressions. |
| Taxonomy substring acceptance | Category, deal type and house type use exact normalized synonym maps; unknown and negated values require review. | Feed-ingest negative probes in English and Russian. |
| Duplicate issue-budget bypass | Duplicate external IDs increment and check the same total issue budget as parser issues before they enter a batch. | Focused duplicate-budget test proves overflow aborts and rolls back. |

## Version-sensitive decision

Payload `3.90.1` is installed. Its bundled types and the official Payload
transactions contract both support direct `payload.db.beginTransaction`,
`commitTransaction`, `rollbackTransaction`, and passing a common
`req.transactionID` through Local API calls. The project uses that contract
without changing package versions.

Official source checked 2026-09-25:
<https://payloadcms.com/docs/database/transactions>

## Deferred external proof

Live S3 controls, provider backup/restore, rendered production Nginx and the
production database identity remain staging/release evidence. They are not
represented as source-code PASS and no production, DNS or secret mutation was
performed in EPIC-44.
