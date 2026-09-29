# TASK-05.5 — External uptime monitor

Date: 2026-09-29

Status: `PASS`

## Durable contract

- execution origin: SourceCraft cloud worker, outside the DON CITY VPS;
- public probe: `https://doncity-home.ru/`, HTTP 200, no application secret;
- interval: 15 minutes;
- failure threshold: one failed scheduled run after two bounded curl retries;
- independent destination: private critical issue in the canonical SourceCraft repository;
- destination authentication: SourceCraft's short-lived built-in CI token;
- test path: manual `production-uptime-monitor` run with `force_alert=true`.

## Test alert proof

- exact workflow candidate: `fd30b384a61bb5d94a25597e6da2c27e7dc4d33a`;
- SourceCraft workflow: `production-uptime-monitor`;
- run: `145`, status `success`;
- private critical test issue: `#1`, created by the CI token and then closed as
  synthetic evidence;
- public probe during the run: HTTP 200;
- secret values and API response bodies were not recorded.

The exact candidate proved both the public probe and the independent alert
destination. `externalMonitoring: true` is therefore durable rather than
declarative. The schedule becomes active from canonical `main` after the
required merge gate.
