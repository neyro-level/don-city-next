export const houseTypes = [
	"house",
	"cottage",
	"townhouse",
	"dacha",
	"part_of_house",
] as const;

export type HouseType = (typeof houseTypes)[number];

export function isHouseType(value: string): value is HouseType {
	return houseTypes.some((houseType) => houseType === value);
}
