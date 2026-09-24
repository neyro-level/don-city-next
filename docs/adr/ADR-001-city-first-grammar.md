# ADR-001 — City-first grammar

Status: Accepted
Date: 2026-09-24
Source: master plan §§6–8, 16, 22–26, 28, 35

## Context

Category-first listing paths make geographic ownership ambiguous and do not
scale cleanly from one city to multiple published geographies.

## Decision

Public listing grammar is city-first: `/{geo}/`, then optional category, then
an approved district/microdistrict or facet segment. The typed grammar is the
only owner for generation and parsing. Unsupported combinations return 404;
query filters never become independent SEO landings.

## Consequences

- `/donetsk/` owns all-property intent for Donetsk.
- Category roots remain useful bridges but are `noindex` in `SINGLE_GEO`.
- Every URL consumer uses the same typed grammar and trailing-slash policy.
- Historical category-first paths have no ownership in active documentation.
