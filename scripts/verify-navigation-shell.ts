import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildR1Navigation } from "../src/project/navigation.ts";
import {
	buildNapContactLinks,
	toPublicNapDTO,
} from "../src/project/site-settings.ts";
import { projectUrls } from "../src/project/url-grammar.ts";

const navigation = buildR1Navigation();
const nap = toPublicNapDTO();
const headerSource = readFileSync(
	"packages/ui/src/views/public-shell/PublicSiteShellView.tsx",
	"utf8",
);
const publicHeaderSource = readFileSync(
	"src/app/(site)/public-site-header.tsx",
	"utf8",
);

assert.equal(projectUrls.home, "/");
assert.deepEqual(
	navigation[0]?.children?.map((item) => item.href),
	[
		"/donetsk/",
		"/donetsk/kvartiry/",
		"/donetsk/doma/",
		"/donetsk/uchastki/",
		"/donetsk/kommercheskaya/",
	],
);
assert.equal(
	navigation.some((item) => item.href.includes("novostroyki")),
	false,
);
assert.equal(
	navigation.some((item) => item.href.includes("ipoteka")),
	false,
);
assert.equal(
	navigation.some((item) => item.href.includes("arenda")),
	false,
);
assert.match(publicHeaderSource, /usePathname/);
assert.match(publicHeaderSource, /activePath/);
assert.match(headerSource, /aria-current/);
assert.match(headerSource, /footer\.contacts\.map/);
assert.match(headerSource, /aria-label="Контакты"/);
assert.deepEqual(
	buildNapContactLinks(nap, projectUrls.contacts).map(
		(contact) => contact.href,
	),
	[
		`tel:${nap.phone.e164}`,
		`mailto:${nap.email}`,
		projectUrls.contacts,
		projectUrls.contacts,
	],
);

console.log("EPIC-17 navigation shell: PASS");
