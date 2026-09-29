# TASK-05.9 — Final pre-release proof

Date: 2026-09-29

Status: `PASS`

Proof candidate: `e6aaec62ec39d9eb8f501b8ad00c96eb985c2ddf`

## Required proof

- `pnpm payload:migrate` — PASS against disposable native PostgreSQL 18 database `don_city_epic05_release_test` on loopback.
- `pnpm verify:schema` — PASS after the complete Payload migration chain.
- `pnpm verify:ui-core` — PASS.
- `pnpm verify:seo-contracts` — PASS: 42 SEO registry rows and 10 district rows.
- `pnpm verify:seo-crawl` — PASS against the exact locally built candidate: 60 HTTP requests, 42 registry pages, 10 sitemap URLs and zero findings. Empty catalog routes were exercised in their fail-closed state; positive metadata contracts are covered by the focused route and SEO suites.
- `pnpm verify:security-boundaries` — PASS.
- `pnpm verify:operational-recovery` — PASS.
- `pnpm verify:production-topology` — PASS.
- `pnpm verify:transport-security` — PASS.
- `pnpm verify:release-artifact` — PASS.
- `pnpm verify:final-release-contract` — PASS.
- `pnpm verify` — PASS, including integration, architecture, guards, typecheck, lint and the Next.js production build.
- `pnpm verify:integration:required` — PASS with explicit `DATABASE_URI_TEST`; the PostgreSQL suite was not skipped.

The dedicated test database was identity-checked and removed after the proof. The existing project-local non-superuser role was retained. Docker and WSL were not used for local verification.

## Target clarification

An initial crawl of the currently deployed public artifact found the expected pre-release social metadata drift: it is the older production revision, not the candidate. The same command against the exact candidate passed with zero findings. The public origin must be crawled again after rollout; until then this document claims candidate readiness, not final live acceptance.

## Remaining gate

This proof does not authorize production by itself. EPIC-05 still requires its exact-head SourceCraft RISKY gate, merge to canonical `main`, one `release-main` image build and the project production runbook. Final deployed SHA/image identity and live smoke are bound after rollout.
