export type GeoReferenceDTO = {
	id: string;
	slug: string;
	name: string;
};

export type RegionDTO = GeoReferenceDTO & {
	shortName: string;
	isPublished: true;
};

export type CityDTO = GeoReferenceDTO & {
	region: RegionDTO;
	nameGenitive: string;
	nameLocative: string;
	preposition: string;
	isPublished: true;
};

export type DistrictDTO = GeoReferenceDTO & {
	type: "administrative_district" | "microdistrict";
	city: GeoReferenceDTO;
	parent?: GeoReferenceDTO;
	nameLocative?: string;
	preposition?: string;
	isPublished: true;
};

/**
 * Public geographical identity for a property. This is allow-listed DTO data,
 * never a Payload relation or a raw source address.
 */
export type PropertyLocationDTO = {
	region: RegionDTO;
	city: CityDTO;
	district?: DistrictDTO;
};
