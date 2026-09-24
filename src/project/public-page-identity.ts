import type { PublicPageIdentityDTO } from "@ams/realtbase-contracts";
import type { PageKey } from "../platform/grammar/types.ts";
import { type SiteCategory, siteProfile } from "./site.profile.ts";
import { buildProjectUrl } from "./url-grammar.ts";

export function buildPublicPageIdentity(
	key: PageKey,
	override: Partial<PublicPageIdentityDTO> = {},
): PublicPageIdentityDTO {
	const geoSlug =
		"geo" in key && typeof key.geo === "string"
			? key.geo
			: siteProfile.primaryGeo;
	const category =
		"category" in key && typeof key.category === "string"
			? (key.category as SiteCategory)
			: undefined;
	return {
		geoSlug,
		pageKey: buildProjectUrl(key),
		...(category ? { category } : {}),
		...override,
	};
}
