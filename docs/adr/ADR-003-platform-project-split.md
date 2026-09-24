# ADR-003 — Platform / Project split

Status: Accepted
Date: 2026-09-24
Source: master plan §§32B, 35 and RP-02…RP-03

## Context

Reusable realty behavior becomes unsafe and non-portable when brand, city or
client values are embedded in platform modules.

## Decision

`src/platform/**` owns portable grammar, resolver, geo, SEO, catalog, Content
Gate, sitemap and IndexNow behavior. `src/project/**` owns typed Site Profile,
brand/content and registry inputs. Platform never imports Project; the
composition root injects validated project inputs.

## Consequences

- DON CITY, Donetsk and DNR literals are forbidden in platform modules.
- Site Profile is the single owner of activation modes and thresholds.
- Project-specific changes do not fork the portable behavior layer.
