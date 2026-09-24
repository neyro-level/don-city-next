import type { CanonicalPath, PageKey, UrlGrammarRegistry } from "./types.ts";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const publicUrlIdPattern = /^\d+$/;

function canonicalSlug(value: string, field: string): string {
	const normalized = value.trim().toLowerCase();
	if (!slugPattern.test(normalized)) {
		throw new Error(`${field} must be a non-empty Latin URL slug.`);
	}
	return normalized;
}

function canonicalPublicUrlId(value: string): string {
	const normalized = value.trim();
	if (!publicUrlIdPattern.test(normalized)) {
		throw new Error("publicUrlId must contain decimal digits only.");
	}
	return normalized;
}

export function buildUrl(key: PageKey): CanonicalPath {
	switch (key.kind) {
		case "home":
			return "/";
		case "geoHub":
			return `/${canonicalSlug(key.geo, "geo")}/`;
		case "categoryRoot":
			return `/${canonicalSlug(key.category, "category")}/`;
		case "categoryGeo":
			return `/${canonicalSlug(key.geo, "geo")}/${canonicalSlug(key.category, "category")}/`;
		case "categoryGeoDistrict":
			return `/${canonicalSlug(key.geo, "geo")}/${canonicalSlug(key.category, "category")}/${canonicalSlug(key.district, "district")}/`;
		case "categoryGeoFacet":
			return `/${canonicalSlug(key.geo, "geo")}/${canonicalSlug(key.category, "category")}/${canonicalSlug(key.facet, "facet")}/`;
		case "property":
			return `/${canonicalSlug(key.category, "category")}/${canonicalSlug(key.semantic, "semantic")}-${canonicalPublicUrlId(key.publicUrlId)}/`;
		case "static":
			return `/${canonicalSlug(key.slug, "static slug")}/`;
	}
}

function canonicalRegistry(registry: UrlGrammarRegistry): UrlGrammarRegistry {
	const categorySlugs = registry.categorySlugs.map((value) =>
		canonicalSlug(value, "category"),
	);
	const geoSlugs = registry.geoSlugs.map((value) =>
		canonicalSlug(value, "geo"),
	);
	const staticSlugs = registry.staticSlugs.map((value) =>
		canonicalSlug(value, "static slug"),
	);
	const roots = [...categorySlugs, ...geoSlugs, ...staticSlugs];
	if (new Set(roots).size !== roots.length) {
		throw new Error("URL grammar root slugs must be globally unique.");
	}

	const districts = registry.districts.map(({ geo, slug }) => ({
		geo: canonicalSlug(geo, "district geo"),
		slug: canonicalSlug(slug, "district"),
	}));
	const facets = registry.facets.map(({ category, slug }) => ({
		category: canonicalSlug(category, "facet category"),
		slug: canonicalSlug(slug, "facet"),
	}));
	if (
		new Set(districts.map((item) => `${item.geo}/${item.slug}`)).size !==
		districts.length
	) {
		throw new Error("URL grammar district keys must be unique per geo.");
	}
	if (
		new Set(facets.map((item) => `${item.category}/${item.slug}`)).size !==
		facets.length
	) {
		throw new Error("URL grammar facet keys must be unique per category.");
	}
	if (districts.some((item) => !geoSlugs.includes(item.geo))) {
		throw new Error(
			"Every URL grammar district must reference a registered geo.",
		);
	}
	if (facets.some((item) => !categorySlugs.includes(item.category))) {
		throw new Error(
			"Every URL grammar facet must reference a registered category.",
		);
	}
	for (const district of districts) {
		for (const facet of facets) {
			if (district.slug === facet.slug) {
				throw new Error(
					`District and facet slug collision is forbidden: ${district.slug}.`,
				);
			}
		}
	}

	return { categorySlugs, geoSlugs, staticSlugs, districts, facets };
}

export function parseUrl(
	path: string,
	registryInput: UrlGrammarRegistry,
): PageKey | null {
	const registry = canonicalRegistry(registryInput);
	const pathname = path.split(/[?#]/, 1)[0]?.toLowerCase() ?? "";
	if (!pathname.startsWith("/")) return null;
	const segments = pathname.split("/").filter(Boolean);
	if (segments.length === 0) return { kind: "home" };
	if (
		segments.length >= 4 ||
		segments.some((segment) => !slugPattern.test(segment))
	) {
		return null;
	}

	if (segments.length === 1) {
		const [root] = segments;
		if (registry.staticSlugs.includes(root))
			return { kind: "static", slug: root };
		if (registry.categorySlugs.includes(root)) {
			return { kind: "categoryRoot", category: root };
		}
		if (registry.geoSlugs.includes(root)) return { kind: "geoHub", geo: root };
		return null;
	}

	if (segments.length === 2) {
		const [first, second] = segments;
		if (
			registry.geoSlugs.includes(first) &&
			registry.categorySlugs.includes(second)
		) {
			return { kind: "categoryGeo", geo: first, category: second };
		}
		if (!registry.categorySlugs.includes(first)) return null;
		const property = /^([a-z0-9]+(?:-[a-z0-9]+)*)-(\d+)$/.exec(second);
		if (!property) return null;
		return {
			kind: "property",
			category: first,
			semantic: property[1],
			publicUrlId: property[2],
		};
	}

	const [geo, category, leaf] = segments;
	if (
		!registry.geoSlugs.includes(geo) ||
		!registry.categorySlugs.includes(category)
	) {
		return null;
	}
	if (
		registry.districts.some((item) => item.geo === geo && item.slug === leaf)
	) {
		return { kind: "categoryGeoDistrict", geo, category, district: leaf };
	}
	if (
		registry.facets.some(
			(item) => item.category === category && item.slug === leaf,
		)
	) {
		return { kind: "categoryGeoFacet", geo, category, facet: leaf };
	}
	return null;
}
