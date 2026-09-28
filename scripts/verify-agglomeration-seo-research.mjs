import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const research = readFileSync(
	"docs/research/DC11_R12_03_AGGLOMERATION_SEO_RESEARCH.md",
	"utf8",
);
const productStructure = readFileSync("docs/02_PRODUCT_STRUCTURE.md", "utf8");

for (const snippet of [
	"Observation date: 2026-09-28",
	"Yandex Wordstat SearchAPI",
	"Yandex SearchAPI RU",
	"`купить квартиру в макеевке` | 990",
	"`купить дом в макеевке` | 636",
	"`купить участок в макеевке` | 23",
	"`купить коммерческую недвижимость в макеевке` | 1",
	"Counts overlap and must not be summed",
	"Recommended candidate slug: `makeevka`",
	"RECOMMEND AS THE ONLY R12-04 CANDIDATE",
	"do not activate any route now",
]) {
	assert.ok(
		research.includes(snippet),
		`Missing research evidence: ${snippet}`,
	);
}

for (const snippet of [
	"Research dated 2026-09-28 recommends `makeevka`",
	"This is not route approval",
	"remain unreachable and outside sitemap/navigation",
	"DC11_R12_03_AGGLOMERATION_SEO_RESEARCH.md",
]) {
	assert.ok(
		productStructure.includes(snippet),
		`Missing Product Structure decision boundary: ${snippet}`,
	);
}

assert.doesNotMatch(research, /estimated|оценочн(?:ый|ая|ое) спрос/i);

console.log("DC10-R12-03 agglomeration SEO research: PASS");
