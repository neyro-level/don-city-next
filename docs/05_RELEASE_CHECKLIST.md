# Release Checklist

Status: Draft
Version: 0.1
Updated: 2026-09-24

## Preconditions

- [ ] Exact master plan approved and Task Manager reconciliation CLEAN.
- [ ] EPIC-47 release candidate complete.
- [ ] Production command explicitly given by owner.
- [ ] Clean canonical `main`, exact SHA and green RISKY SourceCraft evidence.

## Product / Data

- [ ] R1 critical flows and actual inventory verified.
- [ ] Leads/outbox/delivery smoke passes without PII in logs.
- [ ] Feed safe-deactivation and source-isolation proven.
- [ ] NAP verified by owner against Yandex Business.

## Security / Recovery

- [ ] Secrets live only in dedicated Secret Master scope.
- [ ] Backup and restore path verified.
- [ ] Pending migrations reviewed and rehearsed on staging.
- [ ] Rollback point and operator stop conditions recorded.

## SEO / Runtime

- [ ] Titles/H1/descriptions/canonicals/robots/sitemaps pass full crawl.
- [ ] City-first V4 owner matrix passes; no category-first V3 listing URL is public.
- [ ] Global property URLs resolve by `publicUrlId` and contain no geo segment.
- [ ] SINGLE_GEO and MULTI_GEO profile matrices pass without product-code drift.
- [ ] 301/308/404/410 and property lifecycle pass real HTTP proof.
- [ ] Staging remains noindex and isolated from production PII.
- [ ] Immutable artifact built once and identified by exact SHA.

## Post Deploy

- [ ] Health/live smoke, leads, jobs, NAP/JSON-LD and changed flows verified.
- [ ] Sitemap/robots/IndexNow/Webmaster checks completed.
- [ ] External uptime and operational alerts active.
- [ ] EPIC-49 monitoring schedule activated.
