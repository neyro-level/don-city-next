# EPIC-01 — imported baseline manifest

- Donor repository: `integrator-p/ams-realty-baza-starter`.
- Immutable source commit: `ca1b884d43e808d17e1eb18b05bad70ea358dd1c`.
- DON CITY import commit: `d8df2264ffb1938e2ec1f702cdb12a5ff0bd5ee2`.
- Application-tree selection: all tracked donor paths except `docs/**`, `AGENTS.md` and `.sourcecraft/ci.yaml`.
- Preservation set: DON CITY source-of-truth docs, project router, existing README and exact-head SourceCraft gate scripts.
- Verification after staging: 1,226 selected donor paths; 0 missing; 0 differing blobs.
- Excluded from the import: donor Git metadata, `.beads`, dependency/cache/build output, secret-named files and production access state.
- Baseline proof: frozen pnpm install, typecheck and production build passed; lint completed with 19 inherited warnings recorded in the preflight report.

This manifest records a reusable application foundation only. Donor product identity, routes, copy, UI tokens, metadata and infrastructure settings are transformed only by their dedicated approved DON CITY epics.
