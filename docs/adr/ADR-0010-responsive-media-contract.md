# ADR-0010: Responsive managed media contract 1.5.0

Status: Accepted

## Context

The public catalog currently projects one original URL for both external and
Payload-managed media. That prevents the browser from selecting a right-sized
managed image and makes the original upload the default transfer for cards and
the property gallery.

## Decision

Publish the additive contract version `1.5.0`. `MediaDTO` gains an optional
`variants` array containing controlled URL, intrinsic width and optional height.
External media may omit variants. Managed media keeps the original `src` as a
rollback-safe fallback and exposes only Payload-generated variants through the
Public Gateway.

The UI converts variants into a native `srcset`; it does not add Next Image as a
second optimization layer. Existing consumers remain compatible because the
field is optional.

## Consequences

- Payload owns media resizing and metadata.
- Private object storage and Payload access control remain unchanged.
- Variant URLs may receive immutable caching only when their filename contains
  the UUID content identity.
- Rollback removes the optional projection and returns consumers to `src`.
