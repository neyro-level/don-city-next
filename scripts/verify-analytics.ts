import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
	analyticsBrowserEventName,
	emitAnalyticsEvent,
} from "../packages/ui/src/analytics-browser.ts";
import { normalizeAnalyticsEvent } from "../packages/ui/src/analytics-contract.ts";

const expectedEvents = [
	"all_property_view",
	"category_catalog_view",
	"district_view",
	"facet_view",
	"filter_apply",
	"property_open",
	"lead_form_view",
	"lead_submit",
	"lead_success",
	"lead_error",
] as const;

const routeSource = readFileSync("src/app/(site)/public-route.tsx", "utf8");
const leadSource = readFileSync(
	"packages/ui/src/views/starter/LeadFormView.tsx",
	"utf8",
);
const propertySource = readFileSync(
	"packages/ui/src/views/property/StarterPropertyPageView.tsx",
	"utf8",
);
const catalogSource = readFileSync(
	"packages/ui/src/views/catalog/StarterCatalogPageView.tsx",
	"utf8",
);

for (const event of expectedEvents.slice(0, 4)) {
	assert.match(
		routeSource,
		new RegExp(`["]${event}["]`),
		`${event} route wiring`,
	);
}
assert.match(catalogSource, /event: "filter_apply"/);
assert.match(propertySource, /event: "property_open"/);
for (const event of expectedEvents.slice(6)) {
	assert.match(leadSource, new RegExp(`event: ["]${event}["]`));
}

const hostileInput = {
	event: "lead_submit",
	pageKey: "/donetsk/kvartiry/",
	geoSlug: "donetsk",
	formKind: "general",
	filterKeys: ["rooms", "unknown"],
	name: "Sensitive Name",
	phone: "+70000000000",
	message: "Sensitive message",
	query: "free text",
} as never;
const normalized = normalizeAnalyticsEvent(hostileInput);
assert.deepEqual(normalized, {
	event: "lead_submit",
	page_key: "/donetsk/kvartiry/",
	geo_slug: "donetsk",
	form_kind: "general",
	filter_keys: ["rooms"],
});
for (const forbidden of ["name", "phone", "message", "query"]) {
	assert.equal(forbidden in normalized, false, `${forbidden} must be dropped`);
}

const dispatched: Array<{ type: string; detail: unknown }> = [];
class TestCustomEvent<T> {
	readonly type: string;
	readonly init: { detail: T };
	constructor(type: string, init: { detail: T }) {
		this.type = type;
		this.init = init;
	}
	get detail() {
		return this.init.detail;
	}
}
const browserWindow = {
	amsAnalyticsQueue: [],
	dispatchEvent(event: { type: string; detail: unknown }) {
		dispatched.push(event);
		return true;
	},
};
Object.defineProperty(globalThis, "window", {
	configurable: true,
	value: browserWindow,
});
Object.defineProperty(globalThis, "CustomEvent", {
	configurable: true,
	value: TestCustomEvent,
});
emitAnalyticsEvent({
	event: "property_open",
	pageKey: "/kvartiry/kvartira-1042/",
	geoSlug: "donetsk",
	category: "apartment",
});
assert.deepEqual(browserWindow.amsAnalyticsQueue, [
	{
		event: "property_open",
		page_key: "/kvartiry/kvartira-1042/",
		geo_slug: "donetsk",
		category: "apartment",
	},
]);
assert.equal(dispatched.length, 1);
assert.equal(dispatched[0]?.type, analyticsBrowserEventName);
assert.deepEqual(dispatched[0]?.detail, browserWindow.amsAnalyticsQueue[0]);

console.log(
	"verify:analytics: page, filter, property and lead events PASS; browser queue/dispatch PASS; runtime PII allowlist PASS",
);
