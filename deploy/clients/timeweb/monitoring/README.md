# DON CITY monitoring contract

The production public availability monitor runs from SourceCraft cloud every
15 minutes. It probes only `https://doncity-home.ru/`, expects HTTP 200 and
uses no application secret. One failed scheduled run is the alert threshold.

The independent alert destination is a private critical SourceCraft issue in
`integrator-p/don-city-next`. The short-lived built-in `SOURCECRAFT_TOKEN`
authenticates only the issue API call. A manual workflow run with
`force_alert=true` proves the alert path without simulating an application
failure.

The schedule is an operational monitor, not a development validation suite or
a post-release task. It is active from canonical `main`; release evidence must
include one successful probe and the synthetic alert issue identifier.

## Extended operations contract

The client project must choose and configure providers for:

- external HTTPS uptime and certificate expiry;
- application readiness plus DB, feed and Payload jobs health;
- backup schedule/failure status and restore-drill freshness;
- lead-delivery pending/failed backlog;
- critical integration failures delivered to an approved alert channel.

Application readiness, backup, queue and lead-delivery alerts remain governed
by the authenticated health and `ALERT_WEBHOOK_URL` contracts. They must not be
misrepresented as part of this public availability probe.
