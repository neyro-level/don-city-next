import type { PublicNapDTO } from "@ams/realtbase-contracts";

export type RealEstateAgentJsonLd = Record<string, unknown>;

export function buildRealEstateAgentJsonLd(
	nap: PublicNapDTO,
): RealEstateAgentJsonLd {
	const assetUrl = (path: string) => new URL(path, nap.url).toString();
	return {
		"@context": "https://schema.org",
		"@type": "RealEstateAgent",
		name: nap.brandName,
		legalName: nap.legalName,
		url: nap.url,
		telephone: nap.phone.e164,
		email: nap.email,
		logo: assetUrl("/brand/don-city-logo-approved.jpg"),
		image: assetUrl("/brand/don-city-social-default.png"),
		openingHoursSpecification: nap.openingHoursSpecification.map(
			(schedule) => ({
				"@type": "OpeningHoursSpecification",
				dayOfWeek: schedule.dayOfWeek.map((day) => `https://schema.org/${day}`),
				opens: schedule.opens,
				closes: schedule.closes,
			}),
		),
		address: {
			"@type": "PostalAddress",
			streetAddress: nap.address.streetAddress,
			addressLocality: nap.address.addressLocality,
			addressRegion: nap.address.addressRegion,
			addressCountry: nap.address.addressCountry,
		},
	};
}
