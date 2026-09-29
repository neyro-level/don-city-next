# TASK-05.6 — Production owner / admin access preflight

Date: 2026-09-29

Mode: owner-authorized production access remediation and verification

Status: `PASS` — the existing production owner authenticated successfully and the credential is held in the dedicated Secret Master scope.

## Verified evidence

- Native SSH smoke reached the existing `doncity-server` as the dedicated deploy user.
- Host Nginx and Docker are active; `doncity-production-app` is healthy and exposed only through loopback port `3000`.
- The production database contains exactly one Payload user and exactly one `owner` role assignment. No email, hash, token or other PII was captured.
- The user authentication schema contains `login_attempts` and `lock_until`; the collection contract limits login attempts to five.
- `https://doncity-home.ru/admin` returns `200` with `X-Robots-Tag: noindex, nofollow` and matching noindex markup.
- The Payload login endpoint is reachable and returns structured validation for an intentionally empty request.
- Effective Nginx configuration rate-limits login/recovery routes to `5r/m` with burst `3` and contains no unresolved `__ADMIN_ACCESS_POLICY__` placeholder.
- Effective production `/admin` policy delegates authentication to Payload; the separate retired staging virtual host denies `/admin`.
- At `2026-09-29T08:33:49+03:00`, the owner-authorized credential rotation updated only the existing owner account; no second owner was created.
- A real HTTPS login at `https://doncity-home.ru/api/users/login` returned `200`, and the authenticated `/api/users/me` response confirmed the `owner` role.
- `PAYLOAD_OWNER_EMAIL` and `PAYLOAD_OWNER_PASSWORD` are present in `DonCity Server/prod/production`; values were not printed or committed.

## Closed acceptance item

The production owner login gate is closed. The rotation used the installed Payload password hashing implementation, invalidated previous sessions and verified the resulting account through the public TLS origin. The operation retained exactly one owner identity and one owner role assignment.

## Safety

- Secret Master values were consumed only process-locally; none were printed or persisted.
- The previous hash and salt were held only in process memory for rollback and were not logged or persisted.
- The database mutation was limited to the existing owner's authentication fields and session invalidation.
- No Nginx, container, DNS, schema or infrastructure state was changed.
