import assert from "node:assert/strict";
import { buildStaticMarketingPage } from "../src/project/static-page-composition.ts";

const seller = buildStaticMarketingPage({
	slug: "prodat-nedvizhimost",
	title: "Продать недвижимость в Донецке",
	seo: {
		title: "Продать недвижимость в Донецке, ДНР | ДОН СИТИ",
		description:
			"Поможем продать квартиру, дом или участок в Донецке: оценка, подготовка, показы, переговоры и юридическое сопровождение сделки.",
		canonicalPath: "/prodat-nedvizhimost/",
		indexing: "index",
		following: "follow",
	},
	breadcrumbs: {
		items: [{ label: "Главная", href: "/" }, { label: "Продать" }],
	},
});

assert.equal(seller.title, "Продать недвижимость в Донецке");
assert.equal(seller.seo.canonicalPath, "/prodat-nedvizhimost/");
assert.equal(seller.leadContext?.formKind, "sell");
assert.equal(seller.leadContext?.sourcePage, "/prodat-nedvizhimost/");
assert.equal(seller.sections.length, 3);
assert.match(seller.sections[0]?.title ?? "", /Оценка/);
assert.match(seller.sections[2]?.text ?? "", /юридические этапы/);

const generic = buildStaticMarketingPage({
	slug: "kontakty",
	title: "Контакты агентства недвижимости «ДОН СИТИ» в Донецке",
	seo: { ...seller.seo, canonicalPath: "/kontakty/" },
	breadcrumbs: { items: [] },
});
assert.equal(generic.leadContext?.formKind, "general");
assert.equal(generic.sections.length, 0);

console.log("verify-seller-page: ok");
