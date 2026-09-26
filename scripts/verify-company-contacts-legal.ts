import assert from "node:assert/strict";
import { companyProfile } from "../src/project/company-profile.ts";
import { legalConsentConfig } from "../src/project/legal.config.ts";
import {
	getProjectLegalDocument,
	projectLegalSlugs,
} from "../src/project/legal-documents.ts";
import { seoRegistryById } from "../src/project/seo-registry.generated.ts";
import { toPublicNapDTO } from "../src/project/site-settings.ts";
import { buildStaticMarketingPage } from "../src/project/static-page-composition.ts";
import { projectUrls } from "../src/project/url-grammar.ts";

const nap = toPublicNapDTO();

function page(
	slug: string,
	indexing: "index" | "noindex",
	following: "follow" | "nofollow",
) {
	return buildStaticMarketingPage({
		slug,
		title: slug,
		seo: {
			title: slug,
			description: `Описание ${slug}`,
			canonicalPath: `/${slug}/`,
			indexing,
			following,
		},
		breadcrumbs: { items: [{ label: "Главная", href: "/" }, { label: slug }] },
		nap,
	});
}

const about = page("o-kompanii", "index", "follow");
assert.equal(about.sections.length, 3);
assert.match(about.sections[1]?.title ?? "", /Руководитель и основатель/);
assert.match(
	about.sections[1]?.text ?? "",
	new RegExp(companyProfile.managerName),
);
assert.match(about.sections[2]?.text ?? "", new RegExp(nap.legalName));
assert.equal(about.leadContext?.formKind, "general");

const contacts = page("kontakty", "index", "follow");
assert.equal(contacts.sections.length, 2);
assert.match(contacts.sections[0]?.text ?? "", new RegExp(nap.email));
assert.match(contacts.sections[1]?.text ?? "", /Пн/);

assert.deepEqual(projectLegalSlugs, [
	"politika-konfidencialnosti",
	"soglasie-na-obrabotku-personalnyh-dannyh",
]);

for (const slug of projectLegalSlugs) {
	const legal = page(slug, "noindex", "follow");
	assert.equal(legal.seo.indexing, "noindex");
	assert.equal(legal.leadContext, undefined);
	assert.equal(legal.sections.length, 0);

	const document = getProjectLegalDocument(slug, nap);
	assert.ok(document);
	assert.ok(document.sections.length >= 5);
	const serialized = JSON.stringify(document);
	assert.match(serialized, new RegExp(nap.legalName));
	assert.match(serialized, new RegExp(companyProfile.inn));
	assert.match(serialized, new RegExp(companyProfile.ogrnip));
	assert.match(serialized, new RegExp(nap.email));
	assert.doesNotMatch(serialized, /TODO/);
	assert.doesNotMatch(serialized, /Владимир/);
	assert.doesNotMatch(serialized, /\+7 \(949\)/);
}

const consent = getProjectLegalDocument(projectLegalSlugs[1], nap);
assert.equal(consent?.version, legalConsentConfig.currentConsentVersion);
assert.equal(
	getProjectLegalDocument(projectLegalSlugs[0], nap)?.title,
	seoRegistryById.get("PRIVACY")?.h1,
);
assert.equal(consent?.title, seoRegistryById.get("CONSENT")?.h1);

const thanks = page("spasibo", "noindex", "nofollow");
assert.equal(thanks.leadContext, undefined);
assert.equal(thanks.primaryAction?.href, projectUrls.home);
assert.equal(thanks.seo.following, "nofollow");

console.log("EPIC-33 company, contacts and legal composition: PASS");
