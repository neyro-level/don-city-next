import "server-only";

import type { PublicNapDTO } from "@ams/realtbase-contracts";
import type { Payload } from "payload";
import { toPublicNapDTO, siteSettingsSlug } from "../../../project/site-settings.ts";
import { publicGatewayPolicy } from "./policy.ts";

const publicSiteSettingsSelect = {
	brandName: true,
	legalName: true,
	phoneDisplay: true,
	phoneE164: true,
	email: true,
	address: {
		full: true,
		streetAddress: true,
		addressLocality: true,
		addressRegion: true,
		addressCountry: true,
	},
	openingHours: true,
} as const;

export async function findPublicSiteSettings(
	payload: Payload,
): Promise<PublicNapDTO> {
	const siteSettings = await payload.findGlobal({
		slug: siteSettingsSlug,
		select: publicSiteSettingsSelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
		depth: publicGatewayPolicy.depth,
	});
	return toPublicNapDTO(siteSettings);
}
