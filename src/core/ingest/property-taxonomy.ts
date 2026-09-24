import { normalizePlotAreaSotka } from "./numeric-invariants.ts";

export const propertyHouseTypes = [
	"house",
	"cottage",
	"townhouse",
	"dacha",
	"part_of_house",
] as const;

export type PropertyHouseType = (typeof propertyHouseTypes)[number];

export function normalizeHouseType(
	value: string | undefined,
): PropertyHouseType | undefined {
	const normalized = value?.trim().toLowerCase() ?? "";
	if (!normalized) return undefined;
	if (/(таунхаус|townhouse)/iu.test(normalized)) return "townhouse";
	if (/(коттедж|cottage)/iu.test(normalized)) return "cottage";
	if (/(дач|dacha)/iu.test(normalized)) return "dacha";
	if (/(част(?:ь|и).*дом|part.*house)/iu.test(normalized)) {
		return "part_of_house";
	}
	if (/(дом|house)/iu.test(normalized)) return "house";
	return undefined;
}

export function normalizeLandAreaToSotka(
	value: string | undefined,
	unit: string | undefined,
): { plotAreaSotka?: number; needsReview: boolean } {
	if (value == null || !value.trim()) return { needsReview: false };

	const amount = Number(value.trim().replace(",", "."));
	if (!Number.isFinite(amount) || amount < 0) return { needsReview: true };

	const normalizedUnit = unit?.trim().toLowerCase();
	if (!normalizedUnit) return { needsReview: true };

	let sotka: number;
	if (isSquareMeterUnit(normalizedUnit)) {
		sotka = amount / 100;
	} else if (isSotkaUnit(normalizedUnit)) {
		sotka = amount;
	} else if (isHectareUnit(normalizedUnit)) {
		sotka = amount * 100;
	} else {
		return { needsReview: true };
	}

	return {
		plotAreaSotka: normalizePlotAreaSotka(sotka, "round") ?? undefined,
		needsReview: false,
	};
}

function isSquareMeterUnit(unit: string): boolean {
	return ["sqm", "sq.m", "m2", "m²", "кв.м", "м2", "м²"].includes(unit);
}

function isSotkaUnit(unit: string): boolean {
	return ["sotka", "sotok", "сотка", "соток", "сот."].includes(unit);
}

function isHectareUnit(unit: string): boolean {
	return ["ha", "hectare", "hectares", "га"].includes(unit);
}
