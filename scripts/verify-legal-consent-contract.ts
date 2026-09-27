import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { toShellDTO } from "../src/core/data-access/public/dto.ts";
import {
	buildProjectLegalLinks,
	consentEvidenceFields,
	legalPublicationConfig,
	napEvidenceContract,
	resolveOptionalLegalLinks,
} from "../src/project/legal.config.ts";
import { toPublicNapDTO } from "../src/project/site-settings.ts";
import { parseProjectUrl } from "../src/project/url-grammar.ts";

assert.deepEqual(consentEvidenceFields, {
	request: { accepted: "consentAccepted", version: "consentVersion" },
	storage: {
		group: "consent",
		accepted: "accepted",
		version: "version",
		consentedAt: "consentedAt",
	},
});

assert.equal(legalPublicationConfig.terms.status, "ABSENT");
assert.equal(legalPublicationConfig.managedContract.status, "ABSENT");
assert.deepEqual(resolveOptionalLegalLinks(), []);
assert.deepEqual(
	buildProjectLegalLinks().map((link) => link.href),
	[
		"/politika-konfidencialnosti/",
		"/soglasie-na-obrabotku-personalnyh-dannyh/",
	],
);
assert.deepEqual(
	toShellDTO([], toPublicNapDTO()).footer.legalLinks,
	buildProjectLegalLinks(),
);
assert.equal(parseProjectUrl("/usloviya-okazaniya-uslug/"), null);
assert.equal(parseProjectUrl("/dogovor.pdf/"), null);

const syntheticPublishedLinks = resolveOptionalLegalLinks({
	terms: {
		status: "PUBLISHED",
		ownerApproved: true,
		href: "/politika-konfidencialnosti/",
		label: "Synthetic approved terms fixture",
	},
	managedContract: {
		status: "PUBLISHED",
		ownerApproved: true,
		mediaId: "synthetic-media-id",
		fileName: "synthetic-contract.pdf",
		mimeType: "application/pdf",
		href: "/api/media/file/synthetic-contract.pdf",
		label: "Synthetic managed contract fixture",
	},
});
assert.equal(syntheticPublishedLinks.length, 2);
assert.throws(
	() =>
		resolveOptionalLegalLinks({
			terms: {
				status: "PUBLISHED",
				ownerApproved: true,
				href: "//external.example/terms" as `/${string}`,
				label: "Unsafe fixture",
			},
			managedContract: { status: "ABSENT", href: null, label: null },
		}),
	/internal canonical pathname/,
);
assert.throws(
	() =>
		resolveOptionalLegalLinks({
			terms: {
				status: "PUBLISHED",
				ownerApproved: true,
				href: "/unregistered-terms/",
				label: "Unregistered fixture",
			},
			managedContract: { status: "ABSENT", href: null, label: null },
		}),
	/registered static route/,
);

assert.deepEqual(napEvidenceContract, {
	status: "PENDING_EXTERNAL_VERIFICATION",
	requiredSourceNames: ["owner-confirmation", "yandex-business"],
	verifiedAt: null,
});

const dtoSource = readFileSync("src/core/data-access/public/dto.ts", "utf8");
assert.match(dtoSource, /legalLinks: buildProjectLegalLinks\(\)/);
assert.doesNotMatch(dtoSource, /usloviya-okazaniya-uslug|dogovor\.pdf/);

console.log(
	"DC10-R12-05 legal/consent contract: ABSENT resources stay unlinked; evidence names and NAP status are explicit; PASS",
);
