import "server-only";

import type { Payload } from "payload";
import type {
	CitiesSelect,
	City,
	District,
	DistrictsSelect,
} from "@/project/payload-types";
import { publicGatewayPolicy } from "./policy";

const citySelect = {
	slug: true,
	isPublished: true,
} satisfies CitiesSelect<true>;

const districtSelect = {
	slug: true,
	type: true,
	city: true,
	parent: true,
	isPublished: true,
} satisfies DistrictsSelect<true>;

type PublicCity = Pick<City, "id" | "slug" | "isPublished">;
type PublicDistrict = Pick<
	District,
	"id" | "slug" | "type" | "city" | "parent" | "isPublished"
>;

function relationId(value: unknown): number | null {
	const raw =
		typeof value === "object" && value !== null
			? (value as { id?: unknown }).id
			: value;
	if (typeof raw === "number" && Number.isInteger(raw)) return raw;
	if (typeof raw === "string" && /^\d+$/.test(raw)) return Number(raw);
	return null;
}

export async function findPublicDistrictParentSlug(
	payload: Payload,
	geoSlug: string,
	districtSlug: string,
): Promise<string | null> {
	const cityResult = await payload.find({
		collection: "cities",
		where: {
			and: [{ slug: { equals: geoSlug } }, { isPublished: { equals: true } }],
		},
		limit: 1,
		depth: publicGatewayPolicy.depth,
		select: citySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const city = cityResult.docs[0] as PublicCity | undefined;
	if (!city?.isPublished) return null;

	const districtResult = await payload.find({
		collection: "districts",
		where: {
			and: [
				{ slug: { equals: districtSlug } },
				{ city: { equals: city.id } },
				{ isPublished: { equals: true } },
			],
		},
		limit: 1,
		depth: publicGatewayPolicy.depth,
		select: districtSelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const district = districtResult.docs[0] as PublicDistrict | undefined;
	if (!district?.isPublished || relationId(district.city) !== city.id)
		return null;

	const parentId = relationId(district.parent);
	if (parentId === null) return null;
	const parentResult = await payload.find({
		collection: "districts",
		where: {
			and: [
				{ id: { equals: parentId } },
				{ city: { equals: city.id } },
				{ type: { equals: "administrative_district" } },
				{ isPublished: { equals: true } },
			],
		},
		limit: 1,
		depth: publicGatewayPolicy.depth,
		select: districtSelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const parent = parentResult.docs[0] as PublicDistrict | undefined;
	if (
		!parent?.isPublished ||
		parent.type !== "administrative_district" ||
		relationId(parent.city) !== city.id
	) {
		return null;
	}
	return parent.slug;
}
