/**
 * Public query ownership is explicit: semantic parameters change the requested
 * catalog state, while cleanable parameters are tracking-only and never do.
 */
export const publicSemanticQueryParameters = {
	pagination: "page",
	apartmentRooms: "rooms",
	houseType: "houseType",
} as const;

export const publicCleanableQueryParameters = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"yclid",
	"gclid",
	"fbclid",
] as const;
