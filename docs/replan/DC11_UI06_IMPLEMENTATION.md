# DC10-UI-06 — Token and dead UI cleanup implementation

Status: VERIFIED

Implementation SHA: `dd0596a7c830b54f7bd720db09546380f0c69d64`

## Outcome

- Removed fourteen unreachable historical corporate UI files.
- Removed twenty-four tokens referenced only by that unreachable tree.
- Removed two corporate-only view-model aliases.
- Connected the required `--container-copy-measure` role to the active marketing
  lead instead of deleting or leaving it dead.
- Replaced the public-surface assertion that preserved one dead file with an
  executable guard requiring the entire dead surface to remain absent.

The cleanup does not touch active routes, package exports, public DTOs, Payload,
lead behavior or production configuration.

## Evidence

- Dead-UI guard, token report, design-token guard, drift and UI Core — PASS.
- Token inventory: 563 definitions, 89 UI source files, one token source and
  zero dead tokens.
- Typecheck and Dependency Cruiser — PASS; 491 modules and 1,532 dependencies,
  no violations.
- Production build — PASS: 16/16 static pages.
- Lint — PASS with zero errors; 24 pre-existing warnings and two infos remain.

No production or live-browser claim is made.
