# RP-10 verification

- Task: `dcv4-task-63-verify`
- Implementation head: `30d88b1a70ff00a7e2f3ec49a11678d04f4ec412`
- Risk: `STANDARD` (additive typed contracts; no schema or migration)
- Production / DNS / secrets: not touched

## Acceptance evidence

| Requirement | Result | Evidence |
| --- | --- | --- |
| Gateway has no implicit Donetsk default | PASS | `PublicCatalogRequest` requires `PublicPageIdentityDTO`; resolver supplies identity from `PageKey` or actual property city. |
| Downstream contracts carry geo identity | PASS | Frozen contracts 1.1.0 require `geoSlug` and `pageKey`; catalog and property views expose both analytics dimensions. |
| Exact cache dimensions | PASS | Builders produce `geo:{slug}`, `geo:{slug}:cat:{category}`, `district:{city}:{slug}`, `property:{publicUrlId}`. |
| Publication/archive target contract | PASS | `buildPropertyInvalidationTargets` returns exact city, category, optional district and property targets; internal revalidation accepts all four. |
| Analytics dimensions and PII guard | PASS | Typed event envelope requires `geo_slug` and `page_key`; fixture rejects a `phone` dimension. |
| DTO contract updated/frozen | PASS | ADR-0005, semantic version 1.1.0 and deterministic base contract lock; journal contract unchanged. |

## Checks

- `pnpm contracts:check` — PASS (`base frozen 1.1.0`, `journal draft 0.1.0`).
- `pnpm contracts:test` — PASS.
- `pnpm verify:gateway-context` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:navigation` and `pnpm verify:route-resolver` — PASS.
- URL/platform guards — PASS.
- `pnpm quality:architecture` — PASS, 419 modules / 1249 dependencies.
- `pnpm typecheck` — PASS.
- `pnpm lint` — exit 0 with the same 20 pre-existing warnings.
- `pnpm build` — PASS on Next.js 16.3.5.
- `pnpm verify:merge-risky` — PARTIAL: contract, URL, geo, jobs, gateway,
  feed, lead and SEO suites passed; the aggregate then stopped in the known
  legacy `verify:owner-operations` prerequisite because removed
  `docs/PROJECT.md` is still referenced. This pre-existing verifier debt is
  already recorded by RP-05/RP-06 and is unrelated to the RP-10 diff.

## Limitations

- Wiring cache-tag emission into every later publication/archive hook remains owned by the corresponding lifecycle/feed epics; RP-10 freezes and proves the canonical builder and accepted transport contract.
- The legacy aggregate verification scripts still need normalization to the
  current five-document project standard; focused security-boundary and RP-10
  checks remain the acceptance evidence for this epic.
- The security verifier's production DB-push assertion was normalized from a
  whitespace-sensitive substring to a semantic regular expression; the
  production configuration itself already hard-disabled push.

## Traceability

- Plan owner: `EPIC-63 / RP-10`.
- Base main: `35276f8efc210789abc9a21251d6a01d4edae66e`.
- Preflight: `684cdac2fe043af3025085f546bd95462708300d`.
- Implementation: `30d88b1a70ff00a7e2f3ec49a11678d04f4ec412`.
- Contract freeze / verification: `67796fabddc7e8b202e367598b2014d80ae9e91a`.
- Deviation: frozen contract required an additive 1.1.0 version bump and ADR; both were completed under the approved RP-10 contract-change scope.
- Discovered work: lifecycle/feed hook integration remains assigned to its existing later epics; no new task required.
