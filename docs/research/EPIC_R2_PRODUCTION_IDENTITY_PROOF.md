# EPIC-R2 production identity proof

Observed read-only: 2026-09-29

## Existing production

- server identity: `doncity-server`, deploy role;
- container: exactly one `doncity-production-app`;
- health: `healthy`;
- jobs owner: exactly one, production;
- backup timer: enabled and active; last service result `success` / status `0`;
- running revision: `fbc2dab7bf2fc408f2257bc280df0fb45970354e`;
- configured immutable image and RepoDigest:
  `pkg.sourcecraft.tech/cr/integrator-p/cn1h8kfcah4l5sn4enbm/don-city-next@sha256:423fc6671805bd92b958d9aa549e4049eb37264f59b5b862ae7ca862175b59f6`;
- image ID:
  `sha256:423fc6671805bd92b958d9aa549e4049eb37264f59b5b862ae7ca862175b59f6`;
- persistent staging runtime/directory: absent.

The proof was collected through the project Secret Master scope and existing
SSH deploy identity. No credential, private key, environment dump, database URL
or PII was printed or stored.

## Comparison and decision

Canonical SourceCraft `origin/main` at comparison time was
`1993a4efe0164ea9ab480cbf3b974fbffbbbe4a9`. Production was therefore behind
main.

Decision: `DEPLOY REQUIRED AFTER FINAL R2 MERGE` under the conditional owner
release authorization in the approved R1/R2 plan. Do not deploy the intermediate
R1 main. After R2 is gated and merged, run exactly one `release-main` build and
one project rollout for the final exact `main`, then bind live SHA/digest proof.

No production mutation occurred during this task.
