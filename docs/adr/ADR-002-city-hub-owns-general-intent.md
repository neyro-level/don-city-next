# ADR-002 — City hub owns general intent

Status: Accepted
Date: 2026-09-24
Source: master plan §§7, 16, 22–25, 28

## Context

Home, category roots and city pages can compete for broad “недвижимость в
городе” intent if ownership is not explicit.

## Decision

The city hub `/{geo}/` is the canonical owner of general all-property intent.
Home owns agency/realtor/brand intent. City-category pages own category intent;
district and facet pages own only their materialized narrow intent.

## Consequences

- Metadata, H1, internal links and sitemap entries follow one owner matrix.
- `/donetsk/` is the menu target “Вся недвижимость”.
- Content Gate may suppress narrow pages but cannot move general intent to a
  category root or query URL.
