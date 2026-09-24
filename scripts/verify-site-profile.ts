import assert from "node:assert/strict";
import {
	isGeoSwitcherVisible,
	resolveCategoryRoute,
	selectActiveCategoryLinks,
	validateSiteProfile,
} from "../src/platform/profile/index.ts";
import { siteProfile } from "../src/project/site.profile.ts";

assert.deepEqual(validateSiteProfile(siteProfile), []);
assert.equal(isGeoSwitcherVisible(siteProfile), false);
assert.equal(
	resolveCategoryRoute(siteProfile, "nearby-geo", "kvartiry").status,
	"NOINDEX_AUTO",
);
assert.equal(
	resolveCategoryRoute(siteProfile, siteProfile.primaryGeo, "kvartiry")
		.statusCode,
	200,
);

const apartmentCandidate = {
	category: "kvartiry" as const,
	geo: siteProfile.primaryGeo,
	href: "/donetsk/kvartiry/",
	label: "Apartments",
};
const preparedOffProfile = {
	...siteProfile,
	categoryStatus: { ...siteProfile.categoryStatus, kvartiry: "PREPARED_OFF" },
	geoCategoryStatus: {
		...siteProfile.geoCategoryStatus,
		donetsk: {
			...siteProfile.geoCategoryStatus.donetsk,
			kvartiry: "PREPARED_OFF",
		},
	},
} as const;

const disabledRoute = resolveCategoryRoute(
	preparedOffProfile,
	preparedOffProfile.primaryGeo,
	"kvartiry",
);
assert.equal(disabledRoute.statusCode, 404);
assert.equal(disabledRoute.indexable, false);
assert.equal(disabledRoute.promotable, false);

for (const surface of ["sitemap", "menu", "internal-link"] as const) {
	assert.deepEqual(
		selectActiveCategoryLinks(preparedOffProfile, [apartmentCandidate]),
		[],
		`${surface} must omit PREPARED_OFF apartments`,
	);
}

assert.ok(
	validateSiteProfile({ ...siteProfile, primaryGeo: "Invalid Geo" }).length > 0,
);

console.log("verify:site-profile PASS");
