import type { PublicNapDTO } from "@ams/realtbase-contracts";

export type RealEstateAgentJsonLd = Record<string, unknown>;

export function buildRealEstateAgentJsonLd(
	nap: PublicNapDTO,
): RealEstateAgentJsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "RealEstateAgent",
		name: nap.brandName,
		legalName: nap.legalName,
		url: nap.url,
		telephone: nap.phone.e164,
		email: nap.email,
		openingHours: nap.openingHours,
		address: {
			"@type": "PostalAddress",
			streetAddress: nap.address.streetAddress,
			addressLocality: nap.address.addressLocality,
			addressRegion: nap.address.addressRegion,
			addressCountry: nap.address.addressCountry,
		},
	};
}
