import type { LeadFormKind } from "@ams/realtbase-contracts";

export const analyticsEventNames = [
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

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type CatalogViewAnalyticsEvent = Extract<
	AnalyticsEventName,
	"all_property_view" | "category_catalog_view" | "district_view" | "facet_view"
>;
export type AnalyticsFilterKey = "rooms" | "houseType";
export type LeadOutcomeCode = "accepted" | "rejected" | "network_error";

export type AnalyticsEventInput = {
	event: AnalyticsEventName;
	pageKey?: string;
	geoSlug?: string;
	category?: string;
	formKind?: LeadFormKind;
	filterKeys?: readonly AnalyticsFilterKey[];
	outcomeCode?: LeadOutcomeCode;
};

export type AnalyticsEventRecord = {
	event: AnalyticsEventName;
	page_key?: string;
	geo_slug?: string;
	category?: string;
	form_kind?: LeadFormKind;
	filter_keys?: readonly AnalyticsFilterKey[];
	outcome_code?: LeadOutcomeCode;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const filterKeySet = new Set<AnalyticsFilterKey>(["rooms", "houseType"]);

/**
 * Runtime allowlist at the only browser dispatch boundary. Unknown properties
 * are deliberately dropped so form fields and free-text values cannot leak
 * into an analytics adapter through an accidental object spread.
 */
export function normalizeAnalyticsEvent(
	input: AnalyticsEventInput,
): AnalyticsEventRecord {
	const record: AnalyticsEventRecord = { event: input.event };
	if (input.pageKey?.startsWith("/")) record.page_key = input.pageKey;
	if (input.geoSlug && slugPattern.test(input.geoSlug)) {
		record.geo_slug = input.geoSlug;
	}
	if (
		input.category &&
		input.category.length <= 64 &&
		slugPattern.test(input.category)
	) {
		record.category = input.category;
	}
	if (input.formKind) record.form_kind = input.formKind;
	if (input.filterKeys?.length) {
		const filterKeys = [
			...new Set(input.filterKeys.filter((key) => filterKeySet.has(key))),
		];
		if (filterKeys.length) record.filter_keys = filterKeys;
	}
	if (input.outcomeCode) record.outcome_code = input.outcomeCode;
	return record;
}
