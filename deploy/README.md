# DON CITY deployment boundary

This directory contains no active DON CITY deployment configuration. The starter
demo's host-specific Compose and Nginx files were removed during client
activation so they cannot be mistaken for the DON CITY production contour.

The non-secret future-client reference is
[`clients/timeweb/README.md`](clients/timeweb/README.md). It is a static
blueprint only: it does not authorize provisioning, server access, database
changes, DNS changes, migrations or deployment.

The existing DON CITY Timeweb server and its actual database/storage topology
will be discovered read-only in the approved later epics. A deployment requires
an explicit owner release command, an exact `main` SHA and the applicable
CRITICAL delivery evidence.
