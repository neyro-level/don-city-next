import assert from "node:assert/strict";
import { fixtureFooter, fixtureHeader } from "../src/fixture/provider.ts";
import { buildRealEstateAgentJsonLd } from "../src/core/seo/real-estate-agent.ts";
import {
	approvedSiteSettings,
	buildNapContactLinks,
	buildNapPhoneLink,
	toPublicNapDTO,
} from "../src/project/site-settings.ts";
import { buildStaticMarketingPage } from "../src/project/static-page-composition.ts";

const nap = toPublicNapDTO();

assert.equal(nap.brandName, approvedSiteSettings.brandName);
assert.equal(nap.phone.display, "+7 (949) 110-10-10");
assert.equal(nap.phone.e164, "+79491101010");
assert.equal(nap.email, "doncity-info@yandex.com");
assert.equal(nap.url, "https://doncity-home.ru");
assert.match(nap.address.full, /Шахтостроителей/);
assert.doesNotMatch(nap.phone.display, /000/);

const phoneLink = buildNapPhoneLink(nap);
assert.equal(phoneLink.label, nap.phone.display);
assert.equal(phoneLink.href, `tel:${nap.phone.e164}`);
assert.deepEqual(
	buildNapContactLinks(nap, "/kontakty/").map((contact) => contact.label),
	[nap.phone.display, nap.email, nap.address.full, nap.openingHours],
);
assert.equal(fixtureHeader.phone?.href, `tel:${nap.phone.e164}`);
assert.equal(fixtureFooter.contacts[0]?.label, nap.phone.display);

const agent = buildRealEstateAgentJsonLd(nap);
assert.equal(agent["@type"], "RealEstateAgent");
assert.equal(agent.name, nap.brandName);
assert.equal(agent.legalName, nap.legalName);
assert.equal(agent.telephone, nap.phone.e164);
assert.equal(agent.email, nap.email);
assert.deepEqual(agent.address, {
	"@type": "PostalAddress",
	streetAddress: nap.address.streetAddress,
	addressLocality: nap.address.addressLocality,
	addressRegion: nap.address.addressRegion,
	addressCountry: "RU",
});

const contacts = buildStaticMarketingPage({
	slug: "kontakty",
	title: "Контакты",
	seo: {
		title: "Контакты — ДОН СИТИ",
		description: "Контакты агентства недвижимости ДОН СИТИ.",
		canonicalPath: "/kontakty/",
		indexing: "index",
		following: "follow",
	},
	breadcrumbs: { items: [{ label: "Главная", href: "/" }, { label: "Контакты" }] },
	nap,
});
assert.equal(contacts.sections.length, 1);
assert.match(contacts.sections[0]?.text ?? "", /doncity-info@yandex.com/);
assert.match(contacts.sections[0]?.text ?? "", /Шахтостроителей/);

console.log("EPIC-07 site settings / NAP contract: PASS");
