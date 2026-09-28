import type { LeadFormKind } from "@ams/realtbase-contracts";

export const analyticsEventNames = [
	"all_property_view", "category_catalog_view", "district_view", "facet_view",
	"filter_apply", "property_open", "lead_form_view", "lead_submit",
	"lead_success", "lead_error", "share_click", "phone_reveal", "map_open",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type CatalogViewAnalyticsEvent = Extract<AnalyticsEventName,
	"all_property_view" | "category_catalog_view" | "district_view" | "facet_view">;
export type AnalyticsFilterKey = "rooms" | "houseType";
export type AnalyticsEventInput = {
	event: AnalyticsEventName; pageKey?: string; geoSlug?: string; category?: string;
	formKind?: LeadFormKind; filterKeys?: readonly AnalyticsFilterKey[];
	outcomeCode?: "accepted" | "rejected" | "network_error"; context?: string; item?: string;
};
export type AnalyticsEventRecord = {
	event: AnalyticsEventName; page_key?: string; geo_slug?: string; category?: string;
	form_kind?: LeadFormKind; filter_keys?: readonly AnalyticsFilterKey[];
	outcome_code?: "accepted" | "rejected" | "network_error"; context?: string; item?: string;
};

const allowedEvents = new Set<AnalyticsEventName>(analyticsEventNames);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const filterKeys = new Set<AnalyticsFilterKey>(["rooms", "houseType"]);
export function normalizeAnalyticsEvent(input: AnalyticsEventInput): AnalyticsEventRecord {
	if (!allowedEvents.has(input.event)) throw new Error("Unknown analytics event.");
	const record: AnalyticsEventRecord = { event: input.event };
	if (input.pageKey?.startsWith("/")) record.page_key = input.pageKey;
	if (input.geoSlug && slugPattern.test(input.geoSlug)) record.geo_slug = input.geoSlug;
	if (input.category && input.category.length <= 64 && slugPattern.test(input.category)) record.category = input.category;
	if (input.formKind) record.form_kind = input.formKind;
	const safeFilters = [...new Set(input.filterKeys?.filter((key) => filterKeys.has(key)) ?? [])];
	if (safeFilters.length) record.filter_keys = safeFilters;
	if (input.outcomeCode) record.outcome_code = input.outcomeCode;
	if (input.context && input.context.length <= 64) record.context = input.context;
	if (input.item && slugPattern.test(input.item)) record.item = input.item;
	return record;
}
