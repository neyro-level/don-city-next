# SourceCraft Platform Audit

Status: read-only organization snapshot plus Don City recommendations
Updated: 2026-09-28

## Organization snapshot

The `integrator-p` organization currently has 22 private repositories. A
default-branch file inventory found:

- 19 repositories with `.sourcecraft/ci.yaml`;
- 8 repositories with a root `Dockerfile`;
- 16 repositories with a root `package.json`;
- 0 repositories with `.devcontainer/devcontainer.json` before this Don City
  pilot.

Existing Docker registries are `ams-image` and `ams-impulse`. Don City should
reuse the shared `ams-image` registry rather than create another registry. Its
repository is connected to `ams-image`; its native SourceCraft image path is
`pkg.sourcecraft.tech/cr/integrator-p/cn1h8kfcah4l5sn4enbm/don-city-next`.
Runtime tags are the immutable full Git SHA. A separate
`migration-<full-sha>` tag represents the ephemeral Payload migration image
from the same source revision.

The local Linux/amd64 proof build produced a 365,561,324-byte runtime image
(about 349 MiB), compared with roughly 3.46 GB for the currently retained
production image. This is about a 9.5x reduction. The separate migration image
is 902,199,960 bytes, is never the long-running service, and is removed after its
bounded migration command. These measurements are local proof only; production
was not changed by this task.

## Current quotas and pressure

| Resource | Usage | Limit | Assessment |
|---|---:|---:|---|
| Private repositories | 22 | 5000 | ample |
| Private CI execution | 377,313 s | 420,000 s/month | high: about 89.8% used |
| Spaces execution | 0 s | 180,000 s/month | unused pilot capacity |
| Private object storage | 798,724,336 B | 10 GiB | low |
| Private CI artifacts | 525,054,921 B | 10 GiB | low |
| Private CI logs | 30,477,348 B | 10 GiB | low |

The main constraint is CI time, not Git or artifact storage. Preserve the AMS
manual-only rule: no image build on every push or Pull Request. Don City image
publication belongs only to one manually triggered exact-main workflow.

## Capability decisions

| SourceCraft capability | Don City | Organization-wide decision |
|---|---|---|
| Pull Requests and exact-SHA CI | KEEP | Canonical delivery path. |
| Docker Registry | ENABLE | Reuse `ams-image`; connect only publishing repositories. |
| Native CI registry identity | ENABLE | Connected repositories use SourceCraft's short-lived built-in CI token; no long-lived registry credential or external service connection. |
| Spaces | PILOT | Start with Don City; standardize only after live Docker/persistence evidence. |
| SourceCraft Sites | DO NOT USE | Don City is a dynamic Payload application, not a static site. |
| Schedules | NOT FOR DEVELOPMENT | Use only for independent product/operations jobs that truly require a schedule. |
| Security add-on | SEPARATE DECISION | Potentially useful for critical repositories, but enable only after scope/cost and signal quality are reviewed. |
| AI tasks and repository skills | OPTIONAL | Useful for bounded repository work; they do not replace branch/PR/review gates. |
| API and CLI | KEEP | Suitable for headless PR, run and repository inventory automation. Registry and Spaces lifecycle remain UI-led in the current public API. |

## Registry security contract

- Repository `don-city-next` connects to `ams-image` only.
- SourceCraft supplies the short-lived built-in `SOURCECRAFT_TOKEN` only while
  the manual CI job runs. The workflow logs in to `pkg.sourcecraft.tech` through
  stdin and logs out on exit.
- No external Yandex Cloud service account or SourceCraft service connection is
  used for this SourceCraft-native registry. Publication remains restricted to
  the manual `release-main` workflow, which verifies the exact canonical `main`
  SHA before login, build and push.
- No SourceCraft PAT, SSH key, production `.env` or database URL is stored in
  `.sourcecraft/ci.yaml` or repository secrets.
- Registry publication creates an artifact; it never authorizes production
  rollout by itself.

## Next organization-level steps

1. Reduce duplicate/manual CI runs before the remaining monthly execution
   quota becomes a blocker.
2. Audit the eight Docker repositories one by one for standalone/distroless or
   equivalent runtime targets; do not apply Don City's Payload layout blindly.
3. Connect only publishing repositories to a registry and use the native
   short-lived CI token plus immutable SHA tags.
4. Revisit a shared devcontainer baseline only after the Don City Space pilot
   proves package installation, preview ports, stop/start persistence and the
   real Docker boundary.

Official references:

- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/operations/packages-management>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/operations/connect-registry>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/operations/configure-docker>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/concepts/gh-actions>
- <https://sourcecraft.dev/portal/docs/ru/sourcecraft/concepts/service-connections>
