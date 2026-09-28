export type PublicNapDTO = {
	brandName: string;
	legalName: string;
	phone: {
		display: string;
		e164: string;
	};
	email: string;
	address: {
		full: string;
		streetAddress: string;
		addressLocality: string;
		addressRegion: string;
		addressCountry: "RU";
	};
	openingHours: string;
	openingHoursSpecification: readonly {
		dayOfWeek: readonly string[];
		opens: string;
		closes: string;
	}[];
	url: string;
};
