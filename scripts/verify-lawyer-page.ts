import assert from "node:assert/strict";
import { buildStaticMarketingPage } from "../src/project/static-page-composition.ts";

const lawyer = buildStaticMarketingPage({
	slug: "yurist",
	title: "Юрист по недвижимости в Донецке",
	seo: {
		title: "Юрист по недвижимости в Донецке, ДНР | ДОН СИТИ",
		description:
			"Юрист по недвижимости в Донецке: проверка документов, сопровождение купли-продажи, наследство, регистрация права и земельные вопросы.",
		canonicalPath: "/yurist/",
		indexing: "index",
		following: "follow",
	},
	breadcrumbs: { items: [{ label: "Главная", href: "/" }, { label: "Юрист" }] },
});

assert.equal(lawyer.title, "Юрист по недвижимости в Донецке");
assert.equal(lawyer.seo.canonicalPath, "/yurist/");
assert.equal(lawyer.leadContext?.formKind, "legal");
assert.equal(lawyer.leadContext?.sourcePage, "/yurist/");
assert.equal(lawyer.sections.length, 3);
assert.match(lawyer.sections[0]?.title ?? "", /Проверка документов/);
assert.match(lawyer.sections[2]?.text ?? "", /наследства/);

console.log("verify-lawyer-page: ok");
