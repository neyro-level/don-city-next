# Architecture Decision Records

ADR фиксирует решение, которое должно пережить отдельную задачу или реализацию.
Master plan остаётся источником полного contract; ADR кратко объясняет, почему
выбран конкретный вариант и какие ограничения из него следуют.

| ADR | Статус | Решение |
|---|---|---|
| [ADR-001](ADR-001-city-first-grammar.md) | Accepted | City-first grammar |
| [ADR-002](ADR-002-city-hub-owns-general-intent.md) | Accepted | City hub owns general intent |
| [ADR-003](ADR-003-platform-project-split.md) | Accepted | Platform / Project split |
| [ADR-004](ADR-004-entities-global-no-geo-in-path.md) | Accepted | Global entity URLs contain no geo segment |
| [ADR-0005](ADR-0005-public-page-identity-contract.md) | Accepted | Public page identity and metadata ownership |
| [ADR-0006](ADR-0006-public-nap-contract.md) | Accepted | Public NAP DTO and one runtime source |
| [ADR-0007](ADR-0007-public-geo-property-contracts.md) | Accepted | Public geo and category-specific property DTOs |
| [ADR-0008](ADR-0008-lead-marketing-contract-reconciliation.md) | Accepted | Reconcile approved lead and marketing contract additions as 1.3.2 |
| [ADR-0009](ADR-0009-commercial-public-contract.md) | Accepted | Activate commercial in the secondary-sale public contract as 1.4.0 |
| [ADR-0010](ADR-0010-responsive-media-contract.md) | Accepted | Add optional responsive variants to managed media contract 1.5.0 |
| [ADR-0011](ADR-0011-narrow-atomic-sql-recovery.md) | Accepted | Permit exactly two parameterized atomic recovery operations under OD-03 |
| [ADR-0012](ADR-0012-home-primary-action-contract.md) | Accepted | Require the homepage primary action in base contract 2.0.0 |
| [ADR-0013](ADR-0013-payload-transaction-session.md) | Accepted | Pin Payload 3.90.1 transactionID to the exact PostgreSQL session executor |
| [ADR-0014](ADR-0014-raw-sql-register.md) | Accepted | Freeze the complete named raw SQL register and revert supported Local API operations |
| [ADR-0015](ADR-0015-stale-sending-recovery.md) | Accepted | Add one atomic stale-sending recovery operation with exact heartbeat arbitration |
