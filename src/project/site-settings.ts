import type { PublicNapDTO, SiteNavItemDTO } from "@ams/realtbase-contracts";

export const siteSettingsSlug = "site-settings" as const;

export const approvedSiteSettings = {
	brandName: "ДОН СИТИ",
	legalName: "Индивидуальный предприниматель Плахтиенко Наталья Геннадьевна",
	phoneDisplay: "+7 (949) 110-10-10",
	phoneE164: "+79491101010",
	email: "doncity-info@yandex.com",
	address: {
		full: "Донецкая Народная Республика, г. Донецк, бульвар Шахтостроителей, 16",
		streetAddress: "бульвар Шахтостроителей, 16",
		addressLocality: "Донецк",
		addressRegion: "Донецкая Народная Республика",
		addressCountry: "RU" as const,
	},
	openingHours: "Пн–Пт: 09:00–18:00; Сб–Вс: 09:00–18:00",
	openingHoursSpecification: [
		{
			dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			opens: "09:00",
			closes: "18:00",
		},
		{
			dayOfWeek: ["Saturday", "Sunday"],
			opens: "09:00",
			closes: "18:00",
		},
	],
	url: "https://doncity-home.ru",
} as const;

export type SiteSettingsSource = {
	brandName?: string | null;
	legalName?: string | null;
	phoneDisplay?: string | null;
	phoneE164?: string | null;
	email?: string | null;
	address?: {
		full?: string | null;
		streetAddress?: string | null;
		addressLocality?: string | null;
		addressRegion?: string | null;
		addressCountry?: string | null;
	} | null;
	openingHours?: string | null;
};

function nonEmpty(value: string | null | undefined, fallback: string) {
	return value?.trim() || fallback;
}

/**
 * Produces the sole allow-listed public contact contract. The approved defaults
 * initialize the Global and keep local build-only rendering free of donor data
 * until the Global record exists in a configured Payload environment.
 */
export function toPublicNapDTO(
	source?: SiteSettingsSource | null,
): PublicNapDTO {
	const address = source?.address;
	return {
		brandName: nonEmpty(source?.brandName, approvedSiteSettings.brandName),
		legalName: nonEmpty(source?.legalName, approvedSiteSettings.legalName),
		phone: {
			display: nonEmpty(
				source?.phoneDisplay,
				approvedSiteSettings.phoneDisplay,
			),
			e164: nonEmpty(source?.phoneE164, approvedSiteSettings.phoneE164),
		},
		email: nonEmpty(source?.email, approvedSiteSettings.email),
		address: {
			full: nonEmpty(address?.full, approvedSiteSettings.address.full),
			streetAddress: nonEmpty(
				address?.streetAddress,
				approvedSiteSettings.address.streetAddress,
			),
			addressLocality: nonEmpty(
				address?.addressLocality,
				approvedSiteSettings.address.addressLocality,
			),
			addressRegion: nonEmpty(
				address?.addressRegion,
				approvedSiteSettings.address.addressRegion,
			),
			addressCountry: "RU",
		},
		openingHours: nonEmpty(
			source?.openingHours,
			approvedSiteSettings.openingHours,
		),
		openingHoursSpecification: approvedSiteSettings.openingHoursSpecification,
		url: approvedSiteSettings.url,
	};
}

export function buildNapPhoneLink(
	nap: PublicNapDTO,
): Pick<SiteNavItemDTO, "label" | "href"> {
	return { label: nap.phone.display, href: `tel:${nap.phone.e164}` };
}

export function buildNapContactLinks(
	nap: PublicNapDTO,
	contactsHref: string,
): readonly SiteNavItemDTO[] {
	return [
		buildNapPhoneLink(nap),
		{ label: nap.email, href: `mailto:${nap.email}` },
		{ label: nap.address.full, href: contactsHref },
		{ label: nap.openingHours, href: contactsHref },
	];
}
