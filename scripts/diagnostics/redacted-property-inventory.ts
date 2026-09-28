export type RedactedInventorySourceRow = {
	publicUrlId?: number | string | null;
	slug?: string | null;
	status?: string | null;
	market?: string | null;
	category?: string | null;
	dealType?: string | null;
	publishedAt?: string | null;
	contentPurgedAt?: string | null;
	needsReview?: boolean | null;
	cityId?: number | null;
	districtId?: number | null;
};

export type RedactedGeoRow = {
	id: number;
	slug: string;
	isPublished: boolean;
};

const launchCategories = new Set(["apartment", "house", "land", "commercial"]);

const categorySlugs: Record<string, string> = {
	apartment: "kvartiry",
	house: "doma",
	land: "uchastki",
	commercial: "kommercheskaya",
	garage: "garazhi",
	room: "komnaty",
};

function publicUrlId(value: number | string | null | undefined): string | null {
	if (typeof value === "number" && Number.isInteger(value) && value > 0) {
		return String(value);
	}
	if (typeof value === "string" && /^[1-9]\d*$/.test(value)) return value;
	return null;
}

export function buildRedactedPropertyInventory(input: {
	properties: readonly RedactedInventorySourceRow[];
	cities: readonly RedactedGeoRow[];
	districts: readonly RedactedGeoRow[];
}) {
	const cities = new Map(input.cities.map((row) => [row.id, row]));
	const districts = new Map(input.districts.map((row) => [row.id, row]));

	const rows = input.properties.map((property, index) => {
		const id = publicUrlId(property.publicUrlId);
		const category = property.category ?? "unknown";
		const categorySlug = categorySlugs[category];
		const slug = property.slug?.trim() || null;
		const city = property.cityId ? cities.get(property.cityId) : undefined;
		const district = property.districtId
			? districts.get(property.districtId)
			: undefined;
		const reasons: string[] = [];

		if (property.status !== "active") reasons.push("status");
		if (property.market !== "secondary") reasons.push("market");
		if (property.dealType !== "sale") reasons.push("deal");
		if (!launchCategories.has(category)) reasons.push("category");
		if (!property.publishedAt) reasons.push("publishedAt");
		if (property.contentPurgedAt) reasons.push("purged");
		if (!id) reasons.push("publicUrlId");
		if (!property.cityId) reasons.push("city_relation");
		if (property.cityId && !city?.isPublished) reasons.push("city_unpublished");
		if (property.districtId && !district?.isPublished) {
			reasons.push("district_unpublished");
		}

		const dataIndexable = reasons.every(
			(reason) =>
				reason !== "status" &&
				reason !== "market" &&
				reason !== "deal" &&
				reason !== "category" &&
				reason !== "publishedAt" &&
				reason !== "purged" &&
				reason !== "publicUrlId",
		);

		return {
			row: index + 1,
			publicUrlId: id,
			category,
			status: property.status ?? "unknown",
			market: property.market ?? "unknown",
			dealType: property.dealType ?? "unknown",
			city: city?.slug ?? null,
			district: district?.slug ?? null,
			needsReview: property.needsReview === true,
			url:
				id && slug && categorySlug ? `/${categorySlug}/${slug}-${id}/` : null,
			dataIndexable,
			reasons,
		};
	});

	return {
		totalPublished: rows.length,
		totalDataIndexable: rows.filter((row) => row.dataIndexable).length,
		missingCityRelation: rows.filter((row) =>
			row.reasons.includes("city_relation"),
		).length,
		needsReview: rows.filter((row) => row.needsReview).length,
		rows,
	};
}
