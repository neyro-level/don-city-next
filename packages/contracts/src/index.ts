export const contractVersion = "2.0.0" as const;
export const contractState = "frozen" as const;

export type {
	PropertyCategory,
	PropertyDealType,
	PropertyMarket,
} from "./common";
export type {
	AppliedPropertyFiltersDTO,
	PropertyFilterDTO,
	PropertyFilterOptionDTO,
	PropertySort,
	PropertyView,
} from "./filters";
export type {
	CityDTO,
	DistrictDTO,
	GeoReferenceDTO,
	PropertyLocationDTO,
	RegionDTO,
} from "./geo";
export type {
	LeadFormContext,
	LeadFormKind,
	LeadPropertyContextDTO,
} from "./lead";
export type {
	HomePageDTO,
	MarketingPageActionDTO,
	MarketingPageDTO,
	MarketingSectionDTO,
} from "./marketing";
export type { MediaDTO, MediaVariantDTO } from "./media";
export type { PublicNapDTO } from "./nap";
export type {
	ApartmentPropertyDetailsDTO,
	CommercialPropertyDetailsDTO,
	HousePropertyDetailsDTO,
	LandPropertyDetailsDTO,
	PreparedCommercialPropertyDTO,
	PreparedDevelopmentDTO,
	PropertyCardDTO,
	PropertyCharacteristicDTO,
	PropertyDetailsDTO,
	PropertyListDTO,
	PropertyPriceDTO,
	PropertySummaryItemDTO,
	R1PropertyDetailsDTO,
} from "./property";
export type { PublicPageIdentityDTO } from "./public-page";
export type { BreadcrumbDTO, BreadcrumbItemDTO, PageSEOContract } from "./seo";
export type {
	SiteFooterDTO,
	SiteFooterGroupDTO,
	SiteHeaderDTO,
	SiteNavItemDTO,
} from "./shell";
