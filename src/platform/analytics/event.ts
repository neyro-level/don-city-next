import type { PublicPageIdentityDTO } from "@ams/realtbase-contracts";

export type PublicAnalyticsEventName =
	| "all_property_view"
	| "category_catalog_view"
	| "district_view"
	| "facet_view"
	| "filter_apply"
	| "property_open"
	| "lead_submit";

type AnalyticsValue = string | number | boolean;
const piiKey = /(name|phone|email|address|message|comment|contact)/i;

export type PublicAnalyticsEvent = {
	event: PublicAnalyticsEventName;
	geo_slug: string;
	page_key: string;
	dimensions: Readonly<Record<string, AnalyticsValue>>;
};

export function buildPublicAnalyticsEvent(input: {
	event: PublicAnalyticsEventName;
	identity: PublicPageIdentityDTO;
	dimensions?: Readonly<Record<string, AnalyticsValue>>;
}): PublicAnalyticsEvent {
	if (!input.identity.geoSlug || !input.identity.pageKey) {
		throw new Error("Analytics requires geo_slug and page_key.");
	}
	for (const key of Object.keys(input.dimensions ?? {})) {
		if (piiKey.test(key)) throw new Error(`Analytics PII key rejected: ${key}`);
	}
	return {
		event: input.event,
		geo_slug: input.identity.geoSlug,
		page_key: input.identity.pageKey,
		dimensions: input.dimensions ?? {},
	};
}
