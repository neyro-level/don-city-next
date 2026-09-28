# ADR-0016: Machine-readable public NAP opening hours 2.1.0

Status: Accepted

Date: 2026-09-29

## Context

The owner-approved constitution remediation plan requires `RealEstateAgent`
structured data to publish machine-readable `openingHoursSpecification` rather
than the Russian display label used by the visible UI. The public NAP DTO must
therefore carry the factual weekly schedule alongside its human-readable label.

## Decision

- Add required `openingHoursSpecification` rows to `PublicNapDTO`.
- Keep the existing `openingHours` display value for visible contact surfaces.
- Build JSON-LD only from the typed weekly schedule.
- Bump the additive frozen base contract from `2.0.0` to `2.1.0` and regenerate
  its normalized lock. Journal contract `0.1.0` is unchanged.

The approval authority is Plan ID
`AMS-DON-CITY-CONSTITUTION-REMEDIATION` v1, TASK-03.4. This decision does not
authorize production release or change business hours beyond the approved
project facts.

## Consequences

- Structured data consumers receive explicit days and opening/closing times.
- Visible UI and machine-readable schema continue to share one factual NAP
  source without parsing localized text.
- Future frozen contract changes still require their own version, ADR and
  approval evidence.
