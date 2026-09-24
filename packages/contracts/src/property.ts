import type {
	PropertyCategory,
	PropertyDealType,
	PropertyMarket,
} from "./common";
import type { AppliedPropertyFiltersDTO } from "./filters";
import type { PropertyLocationDTO } from "./geo";
import type { MediaDTO } from "./media";

export type PropertyPriceDTO = {
	priceMinor: number;
	pricePerMeterMinor?: number;
	currency: "RUB";
	period?: "total" | "month";
	label: string;
};

export type PropertySummaryItemDTO = {
	key: "area" | "livingArea" | "kitchenArea" | "floor" | "rooms" | "lotArea";
	label: string;
	value: string;
};

export type PropertyCharacteristicDTO = {
	label: string;
	value: string;
};

export type PropertyCardDTO = {
	id: string;
	slug: string;
	href: string;
	title: string;
	category: PropertyCategory;
	dealType: PropertyDealType;
	price: PropertyPriceDTO | null;
	address: string;
	city: string;
	district?: string;
	geo?: PropertyLocationDTO;
	primaryMedia: MediaDTO | null;
	summary: readonly PropertySummaryItemDTO[];
	badges: readonly string[];
};

export type PropertyDetailsDTO = PropertyCardDTO & {
	description: string;
	gallery: readonly MediaDTO[];
	characteristics: readonly PropertyCharacteristicDTO[];
	location?: {
		latitude: number;
		longitude: number;
	};
	related: readonly PropertyCardDTO[];
};

export type ApartmentPropertyDetailsDTO = PropertyDetailsDTO & {
	category: "apartment";
	market: "secondary";
	geo: PropertyLocationDTO;
	categoryDetails: {
		rooms?: number;
		totalArea?: number;
		livingArea?: number;
		kitchenArea?: number;
		floor?: number;
		floors?: number;
	};
};

export type HousePropertyDetailsDTO = PropertyDetailsDTO & {
	category: "house";
	market: "secondary";
	geo: PropertyLocationDTO;
	categoryDetails: {
		houseType: "house" | "cottage" | "townhouse" | "dacha" | "part_of_house";
		plotAreaSotka?: number;
	};
};

export type LandPropertyDetailsDTO = PropertyDetailsDTO & {
	category: "land";
	market: "secondary";
	geo: PropertyLocationDTO;
	categoryDetails: {
		plotAreaSotka?: number;
		landCategory?: string;
		permittedUse?: string;
		communications: readonly string[];
	};
};

/** Prepared-off: this type does not authorize a public R1 catalog or route. */
export type PreparedCommercialPropertyDTO = PropertyDetailsDTO & {
	category: "commercial";
	market: PropertyMarket;
	geo: PropertyLocationDTO;
	availability: "prepared-off";
};

/** Prepared-off: newbuild may not be exposed before its R2 research contract. */
export type PreparedDevelopmentDTO = {
	market: "newbuild";
	geo: PropertyLocationDTO;
	availability: "prepared-off";
};

export type R1PropertyDetailsDTO =
	| ApartmentPropertyDetailsDTO
	| HousePropertyDetailsDTO
	| LandPropertyDetailsDTO;

export type PropertyListDTO = {
	items: readonly PropertyCardDTO[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
	appliedFilters: AppliedPropertyFiltersDTO;
};
