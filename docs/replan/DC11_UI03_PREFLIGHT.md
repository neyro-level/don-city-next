# DC10-UI-03 — lightbox primitive conformance preflight

Status: READY FOR IMPLEMENTATION

Date: 2026-09-27

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE v13 APPROVED`

Epic: `EPIC-116 / DC10-UI-03 — Lightbox primitive conformance`

Base: `origin/main@e642eee5ef15295447b94ac73767c1d34b2f5ecb`

Branch: `codex/dc11-116-lightbox-conformance`

## 1. Observable outcome

The active property gallery uses the project-owned approved Dialog and Button
primitives. Keyboard navigation, focus restoration and reduced-motion behavior
have deterministic proof. The second modal/lightbox library is removed rather
than retained by exception.

Production, data, secrets, DNS and Payload schema are outside this epic.

## 2. Exact baseline

### Active route chain

Graphify traces `MediaGallery` through
`StarterPropertyMediaGallery.tsx` → `StarterPropertyPageView.tsx` →
`src/app/(site)/public-route.tsx`. The gallery is active production code.

`MediaLightbox.tsx` is loaded lazily by `MediaGallery.tsx`; the static graph does
not resolve that dynamic edge, so source/import inventory is the proof for this
boundary.

### Current second library

`yet-another-react-lightbox@3.32.2` currently owns the overlay, focus trap,
Escape handling, previous/next, thumbnails, zoom and fullscreen behavior.
Repository-owned references exist in exactly five places:

- `packages/ui/package.json`;
- `pnpm-lock.yaml`;
- `packages/ui/src/styles.css`;
- `packages/ui/src/views/property/media-gallery.types.ts`;
- `packages/ui/src/views/property/MediaLightbox.tsx`.

This is a second dialog/overlay implementation beside the approved
`packages/ui/src/components/ui/dialog.tsx`, which is backed by Radix Dialog and
already used by legal and property UI.

### Existing partial behavior

- Gallery opener uses the project-owned `Button` primitive.
- `onExited` restores focus to the opening gallery button.
- Global `src/app/globals.css` reduces all animation and transition durations
  under `prefers-reduced-motion: reduce`.
- No dedicated gallery/lightbox interaction verifier exists.

## 3. Convergence decision

No owner exception is needed. Replace the second lightbox library with a
project-owned `MediaLightbox` composition using existing Dialog and Button
primitives, then remove the dependency, external styles and external slide
type.

The replacement must preserve:

- controlled open/close and Escape;
- focus trap while open and focus restoration on close;
- ArrowLeft/ArrowRight navigation with finite or wrapping behavior matching the
  current gallery mode;
- labelled previous, next, close, zoom and fullscreen controls;
- image counter and thumbnails when multiple images exist;
- zoom toggle/reset and browser fullscreen when supported;
- reduced-motion compliance through semantic duration/easing tokens and the
  global reduce rule.

## 4. Fail-first proof

The durable verifier must fail when:

- any source/package/lock/style reference to `yet-another-react-lightbox`
  remains;
- `MediaLightbox` does not compose the project Dialog and Button primitives;
- Escape/focus trap ownership is bypassed instead of delegated to Radix;
- ArrowLeft/ArrowRight, focus restoration, labelled controls, counter or
  thumbnails are missing;
- reduced-motion source and semantic motion tokens are absent;
- active property gallery composition no longer reaches `MediaGallery`.

## 5. Verification matrix

| Criterion | Planned proof |
|---|---|
| Approved primitives own gallery overlay | Import/source guard for project Dialog and Button. |
| Second library removed | Package/lock/source/style negative inventory. |
| Keyboard and focus | Deterministic interaction verifier plus typecheck and existing Radix contract. |
| Reduced motion | Global reduce-rule and semantic duration/easing assertions. |
| Active property routes unaffected | Property-card/detail route checks and one active-route build. |
| Dependency boundary remains valid | Dependency Cruiser and full diff review. |

## 6. Unknowns and blockers

- Browser Fullscreen API is optional at runtime; the control must be hidden or
  disabled when unsupported and must not block the core gallery.
- Browser-level focus-trap behavior belongs to Radix Dialog. Deterministic proof
  verifies correct primitive composition and explicit focus restoration; final
  build/gate verify integration without claiming live browser evidence.
- No owner decision or external service is required.

## 7. DOC IMPACT

- Owner: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-116`.
- Reviewed: `docs/03_ARCHITECTURE.md`, `docs/DESIGN.md`, package/runtime owners
  and approved Dialog/Button primitives.
- Changed in PREFLIGHT: this evidence artifact and current delivery pointer.
- Planned implementation update: Design policy records the approved gallery
  primitive owner; no PRD, Product Structure, Backlog or release-policy change.
