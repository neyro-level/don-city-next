# ADR-0006: Public NAP contract 1.2.0

- Status: Accepted
- Decision owner: approved Master Plan V4, EPIC-07
- Date: 2026-09-24

## Context

The public shell, contact page and `RealEstateAgent` JSON-LD require the same
allow-listed identity and contact data. Separate header, footer or structured
data values would create publication drift and retain starter placeholder
contacts.

## Decision

Add the additive `PublicNapDTO` to the public contract. A single
`site-settings` Payload Global is the runtime source, Public Gateway maps it to
the DTO with an explicit allow-list, and the approved initial values provide a
safe build-only fallback until the Global record is available. The public DTO
contains only brand, legal name, phone, email, office address, hours and
canonical site URL; banking and tax details are excluded.

## Consequences

- Header, footer, contacts page and `RealEstateAgent` consume the same DTO.
- Public callers never receive a raw Payload Global document.
- This is an additive minor contract release, version `1.2.0`.
