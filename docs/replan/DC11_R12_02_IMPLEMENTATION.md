# DC10-R12-02 — Agglomeration data model

Status: IMPLEMENTED

## Result

- The existing `cities` collection remains the single geography source of truth.
- A city is explicitly classified as `primary_city` or `nearby_locality`.
- Nearby candidates store coordinates, coordinate verification, their primary city,
  calculated Haversine distance, and separate owner approval evidence.
- Donetsk is migrated to `primary_city`; all other existing rows default to an
  unapproved nearby candidate.
- The public nearby gateway fails closed unless the row is published, approved,
  linked to a primary city, has verified coordinates and is within 50 km.
- This task does not create or activate nearby routes, sitemap entries, menus or
  indexing. Activation remains behind the later research and owner-decision gate.

## Safety proof

- A reversible PostgreSQL migration adds constraints and safe defaults without a
  second database or duplicate geography collection.
- Migration integration proof covers safe defaults, radius overflow rejection,
  eligible approval and rollback with row preservation.
- Pure model proof covers both sides of the 50 km boundary and missing approval or
  coordinate evidence.
- Existing route, nearby fixture and public geo gateway checks remain green.

## Deferred owner decision

No nearby locality is approved by this implementation. Candidate selection and
public activation require the dedicated owner gate in the approved master plan.
