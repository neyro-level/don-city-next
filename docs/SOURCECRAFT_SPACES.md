# Don City in SourceCraft Spaces

Status: experimental pilot, no production impact
Updated: 2026-09-28

## Purpose

SourceCraft Space is an optional disposable cloud development workspace for
reviewing and editing Don City. It is not production, staging, a jobs owner or a
place for production data. The canonical workstation remains Windows 11.

## Repository contract

- Configuration: `.devcontainer/devcontainer.json`.
- Runtime: Node.js 24.20.0 and pnpm 11.5.1.
- First setup: `pnpm install --frozen-lockfile` via `postCreateCommand`.
- Development command: `pnpm dev:space`.
- Preview port: `8000`, bound to `0.0.0.0`; SourceCraft exposes forwarded ports
  through authenticated HTTPS/WSS to the Space owner.
- No secret is embedded in the devcontainer. Development variables must be
  supplied explicitly and must never reuse `DonCity Server/prod`.

## Capability evidence

| Capability | Status | Evidence / consequence |
|---|---|---|
| Dev Container Spec | VERIFIED (docs) | SourceCraft supports `.devcontainer/devcontainer.json`, images, Features, environment, extensions, forwarded ports and lifecycle commands. |
| Port forwarding | VERIFIED (docs) | Only ports `8000–65535`; HTTPS/WSS; owner-only access. Don City uses `8000`. |
| Resource presets | VERIFIED (docs) | Available presets include 2 vCPU / 8 GB and 4 vCPU / 16 GB. |
| Lifecycle | VERIFIED (docs) | Space can be stopped and restarted; idle stop is configurable; inactive Spaces are deleted after two weeks. |
| Organization limit | VERIFIED (docs) | At most three Spaces per user in one organization, including stopped Spaces. |
| Docker CLI | NOT VERIFIED LIVE | Documentation does not promise it. Run `docker version` inside an actual Don City Space. |
| Docker daemon/socket | NOT VERIFIED LIVE | Check `docker info` and whether a daemon or mounted socket exists. |
| Docker Compose | NOT VERIFIED LIVE | Check `docker compose version`; do not assume DinD support. |
| Privileged containers / nested Docker | NOT VERIFIED | No official guarantee found. Do not design the workflow around DinD. |
| Volume persistence after stop/start | NOT VERIFIED LIVE | Create a harmless marker in the workspace, stop/start once and verify it. |

## Safe pilot checklist

1. Create the Space from a non-production branch.
2. Confirm `node --version`, `pnpm --version` and `pnpm dev:space`.
3. Open forwarded port `8000` and check the public shell without production
   credentials or data.
4. Run the Docker and persistence probes above and record only capability
   results, never tokens or environment values.
5. Keep local development as the fallback. A failed Space must not affect
   SourceCraft `main`, Timeweb, PostgreSQL or S3.

Official references:

- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/concepts/spaces>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/concepts/spaces-env-config>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/operations/spaces>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/operations/spaces-env-config>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/concepts/limits>
