import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { categorySpecificPropertyFixtures } from "../packages/contracts/src/fixtures.ts";

const contractIndex = readFileSync(
	resolve("packages/contracts/src/index.ts"),
	"utf8",
);
const propertyPolicy = readFileSync(
	resolve("src/core/data-access/public/property-policy.ts"),
	"utf8",
);

for (const exportName of [
	"RegionDTO",
	"CityDTO",
	"DistrictDTO",
	"PropertyLocationDTO",
	"ApartmentPropertyDetailsDTO",
	"CommercialPropertyDetailsDTO",
	"HousePropertyDetailsDTO",
	"LandPropertyDetailsDTO",
	"PreparedCommercialPropertyDTO",
	"PreparedDevelopmentDTO",
]) {
	assert.match(contractIndex, new RegExp(`\\b${exportName}\\b`));
}

assert.equal(
	categorySpecificPropertyFixtures.house.categoryDetails.houseType,
	"dacha",
);
assert.equal(
	categorySpecificPropertyFixtures.land.categoryDetails.permittedUse,
	"ИЖС",
);
assert.equal(
	categorySpecificPropertyFixtures.commercial.market,
	"secondary",
);
assert.equal(
	categorySpecificPropertyFixtures.commercialPrepared.availability,
	"prepared-off",
);
assert.equal(
	categorySpecificPropertyFixtures.developmentPrepared.availability,
	"prepared-off",
);
assert.match(propertyPolicy, /"apartment"/);
assert.match(propertyPolicy, /"house"/);
assert.match(propertyPolicy, /"land"/);
assert.match(propertyPolicy, /"commercial"/);
assert.doesNotMatch(propertyPolicy, /"newbuild"/);

console.log("contracts DTO: PASS");
