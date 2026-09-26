import assert from "node:assert/strict";
import { seoRegistry } from "../src/project/seo-registry.generated.ts";
import { approvedSiteSettings } from "../src/project/site-settings.ts";
import { projectSitemapPaths } from "../src/project/sitemap.ts";

const baseUrl = new URL(
	process.env.SEO_CRAWL_BASE_URL ?? "https://staging.doncity-home.ru",
);
const canonicalOrigin = "https://doncity-home.ru";
const requestDelayMs = Number(process.env.SEO_CRAWL_DELAY_MS ?? "500");
const expectedStagingNoindex =
	process.env.SEO_CRAWL_EXPECT_STAGING_NOINDEX !== "false";

assert.ok(
	baseUrl.protocol === "https:" ||
		(baseUrl.protocol === "http:" &&
			["127.0.0.1", "localhost"].includes(baseUrl.hostname)),
	"SEO crawl target must use HTTPS or an explicit loopback HTTP runtime.",
);
assert.ok(
	Number.isFinite(requestDelayMs) && requestDelayMs >= 500,
	"SEO crawl delay must keep the structural crawl at or below 2 RPS.",
);

type PageSnapshot = {
	path: string;
	status: number;
	location: string | null;
	contentType: string;
	xRobotsTag: string;
	body: string;
};

type Finding = {
	rule: string;
	path: string;
	message: string;
};

const findings: Finding[] = [];
const snapshots = new Map<string, PageSnapshot>();
let previousRequestAt = 0;

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path: string): Promise<PageSnapshot> {
	const cached = snapshots.get(path);
	if (cached) return cached;

	const wait = requestDelayMs - (Date.now() - previousRequestAt);
	if (wait > 0) await sleep(wait);
	previousRequestAt = Date.now();

	const response = await fetch(new URL(path, baseUrl), {
		redirect: "manual",
		headers: { "user-agent": "DON-CITY-EPIC-46-VERIFY/1.0" },
		signal: AbortSignal.timeout(20_000),
	});
	const snapshot = {
		path,
		status: response.status,
		location: response.headers.get("location"),
		contentType: response.headers.get("content-type") ?? "",
		xRobotsTag: response.headers.get("x-robots-tag") ?? "",
		body: await response.text(),
	};
	snapshots.set(path, snapshot);
	return snapshot;
}

function normalizeSpace(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function decodeHtml(value: string) {
	return value
		.replace(/&quot;/g, '"')
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&laquo;/g, "«")
		.replace(/&raquo;/g, "»")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">");
}

function textContent(value: string) {
	return normalizeSpace(decodeHtml(value.replace(/<[^>]+>/g, " ")));
}

function attribute(html: string, pattern: RegExp) {
	return decodeHtml(pattern.exec(html)?.[1] ?? "");
}

function metadata(html: string) {
	const h1Matches = [...html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)];
	return {
		title: textContent(/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? ""),
		description: attribute(
			html,
			/<meta\s+name="description"\s+content="([^"]*)"/i,
		),
		robots: attribute(html, /<meta\s+name="robots"\s+content="([^"]*)"/i),
		canonical: attribute(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
		h1: h1Matches.map((match) => textContent(match[1] ?? "")),
	};
}

function normalizeRobots(value: string) {
	return value
		.toLowerCase()
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean)
		.join(",");
}

function check(
	condition: unknown,
	rule: string,
	path: string,
	message: string,
) {
	if (!condition) findings.push({ rule, path, message });
}

function jsonLd(html: string) {
	const blocks = [
		...html.matchAll(
			/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
		),
	];
	return blocks.map((block, index) => {
		try {
			return JSON.parse(block[1] ?? "null") as Record<string, unknown>;
		} catch (error) {
			findings.push({
				rule: "json-ld-parse",
				path: "/",
				message: `JSON-LD block ${index + 1} is invalid: ${String(error)}`,
			});
			return null;
		}
	});
}

for (const entry of seoRegistry) {
	const snapshot = await request(entry.url);
	const actual = metadata(snapshot.body);
	check(
		snapshot.status === 200,
		"registry-status",
		entry.url,
		`expected 200, received ${snapshot.status}`,
	);
	check(
		actual.title === entry.title,
		"registry-title",
		entry.url,
		`expected ${JSON.stringify(entry.title)}, received ${JSON.stringify(actual.title)}`,
	);
	check(
		actual.description === entry.description,
		"registry-description",
		entry.url,
		"rendered description differs from the V4 registry",
	);
	check(
		actual.h1.length === 1,
		"registry-h1-count",
		entry.url,
		`expected one H1, received ${actual.h1.length}`,
	);
	check(
		actual.h1[0] === entry.h1,
		"registry-h1",
		entry.url,
		`expected ${JSON.stringify(entry.h1)}, received ${JSON.stringify(actual.h1[0] ?? "")}`,
	);
	check(
		actual.canonical === `${canonicalOrigin}${entry.url}`,
		"registry-canonical",
		entry.url,
		`unexpected canonical ${JSON.stringify(actual.canonical)}`,
	);
	check(
		normalizeRobots(actual.robots) === normalizeRobots(entry.robots),
		"registry-robots",
		entry.url,
		`expected ${entry.robots}, received ${actual.robots}`,
	);
	if (expectedStagingNoindex) {
		check(
			normalizeRobots(snapshot.xRobotsTag) === "noindex,nofollow",
			"staging-noindex",
			entry.url,
			`unexpected X-Robots-Tag ${JSON.stringify(snapshot.xRobotsTag)}`,
		);
	}
	check(
		!/(?:start-baza\.ams24\.ru|\/obekty\/|localhost|127\.0\.0\.1)/i.test(
			snapshot.body,
		),
		"forbidden-public-output",
		entry.url,
		"legacy, donor or local URL leaked into public HTML",
	);
}

for (const queryCase of [
	{ path: "/donetsk/kvartiry/?rooms=1", canonical: "/donetsk/kvartiry/" },
	{ path: "/donetsk/kvartiry/?page=2", canonical: "/donetsk/kvartiry/?page=2" },
]) {
	const snapshot = await request(queryCase.path);
	const actual = metadata(snapshot.body);
	check(
		snapshot.status === 200,
		"query-status",
		queryCase.path,
		`expected 200, received ${snapshot.status}`,
	);
	check(
		actual.canonical === `${canonicalOrigin}${queryCase.canonical}`,
		"query-canonical",
		queryCase.path,
		`unexpected canonical ${actual.canonical}`,
	);
	check(
		normalizeRobots(actual.robots) === "noindex,follow",
		"query-robots",
		queryCase.path,
		`unexpected robots ${actual.robots}`,
	);
}

const pageOne = await request("/donetsk/kvartiry/?page=1");
check(
	pageOne.status === 301,
	"query-page-one-redirect",
	"/donetsk/kvartiry/?page=1",
	`expected 301, received ${pageOne.status}`,
);

for (const path of [
	"/kvartiry/donetsk/",
	"/donetsk/novostroyki/",
	"/donetsk/kvartiry/neizvestnyy/",
	"/donetsk/kvartiry/tekstilshchik/odnokomnatnye/",
	"/obekty/test/",
	"/nedvizhimost/",
]) {
	const snapshot = await request(path);
	check(
		snapshot.status === 404,
		"invalid-route-status",
		path,
		`expected 404, received ${snapshot.status}`,
	);
}

const trailingSlash = await request("/donetsk/kvartiry");
check(
	trailingSlash.status === 308,
	"trailing-slash-status",
	trailingSlash.path,
	`expected 308, received ${trailingSlash.status}`,
);
check(
	trailingSlash.location === "/donetsk/kvartiry/",
	"trailing-slash-location",
	trailingSlash.path,
	`unexpected Location ${trailingSlash.location}`,
);

const robots = await request("/robots.txt");
check(
	robots.status === 200,
	"robots-status",
	robots.path,
	`expected 200, received ${robots.status}`,
);
if (expectedStagingNoindex) {
	check(
		/User-agent:\s*\*/i.test(robots.body) &&
			/Disallow:\s*\//i.test(robots.body),
		"robots-staging-deny",
		robots.path,
		"staging robots must deny all crawlers",
	);
}

const sitemapUrls = new Set<string>();
let sitemapLastmodCount = 0;
for (const path of projectSitemapPaths) {
	const sitemap = await request(path);
	check(
		sitemap.status === 200,
		"sitemap-status",
		path,
		`expected 200, received ${sitemap.status}`,
	);
	check(
		sitemap.contentType.includes("xml"),
		"sitemap-content-type",
		path,
		`unexpected content type ${sitemap.contentType}`,
	);
	for (const match of sitemap.body.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
		const row = match[1] ?? "";
		const location = decodeHtml(/<loc>(.*?)<\/loc>/i.exec(row)?.[1] ?? "");
		const lastmod = /<lastmod>(.*?)<\/lastmod>/i.exec(row)?.[1] ?? "";
		check(
			location.startsWith(`${canonicalOrigin}/`),
			"sitemap-origin",
			path,
			`unexpected sitemap URL ${location}`,
		);
		check(
			!sitemapUrls.has(location),
			"sitemap-duplicate",
			path,
			`duplicate sitemap URL ${location}`,
		);
		check(
			Boolean(lastmod) && !Number.isNaN(Date.parse(lastmod)),
			"sitemap-lastmod",
			path,
			`missing or invalid lastmod for ${location}`,
		);
		if (lastmod) sitemapLastmodCount += 1;
		sitemapUrls.add(location);
	}
}

const expectedRegistrySitemapUrls = new Set(
	seoRegistry
		.filter(
			(entry) => entry.status === "active" && entry.robots === "index,follow",
		)
		.map((entry) => `${canonicalOrigin}${entry.url}`),
);
for (const expected of expectedRegistrySitemapUrls) {
	check(
		sitemapUrls.has(expected),
		"sitemap-missing",
		"sitemaps",
		`missing canonical registry URL ${expected}`,
	);
}
for (const location of sitemapUrls) {
	check(
		!/[?&]/.test(location),
		"sitemap-query",
		"sitemaps",
		`query URL leaked into sitemap: ${location}`,
	);
	check(
		!["/kvartiry/", "/doma/", "/uchastki/"].includes(
			location.replace(canonicalOrigin, ""),
		),
		"sitemap-category-root",
		"sitemaps",
		`global category root leaked into sitemap: ${location}`,
	);
}

const home = snapshots.get("/");
assert.ok(home, "Home snapshot is required.");
const structuredData = jsonLd(home.body).filter(Boolean) as Record<
	string,
	unknown
>[];
const agent = structuredData.find((row) => row["@type"] === "RealEstateAgent");
check(
	Boolean(agent),
	"json-ld-agent",
	"/",
	"RealEstateAgent JSON-LD is missing",
);
if (agent) {
	const address = (agent.address ?? {}) as Record<string, unknown>;
	check(
		agent.name === approvedSiteSettings.brandName,
		"json-ld-name",
		"/",
		"JSON-LD brand name differs from site-settings",
	);
	check(
		agent.telephone === approvedSiteSettings.phoneE164,
		"json-ld-phone",
		"/",
		"JSON-LD phone differs from site-settings",
	);
	check(
		agent.url === approvedSiteSettings.url,
		"json-ld-url",
		"/",
		"JSON-LD URL differs from site-settings",
	);
	check(
		address.streetAddress === approvedSiteSettings.address.streetAddress,
		"json-ld-address",
		"/",
		"JSON-LD address differs from site-settings",
	);
}

const contacts = snapshots.get("/kontakty/");
assert.ok(contacts, "Contacts snapshot is required.");
for (const visibleValue of [
	approvedSiteSettings.brandName,
	approvedSiteSettings.phoneDisplay,
	approvedSiteSettings.email,
	approvedSiteSettings.address.full,
]) {
	check(
		textContent(contacts.body).includes(visibleValue),
		"visible-nap",
		"/kontakty/",
		`visible NAP value is missing: ${visibleValue}`,
	);
}

const summary = {
	verdict: findings.length === 0 ? "PASS" : "FAIL",
	mode: "VERIFY",
	coverage: "FULL",
	profile: "CATALOG",
	target: baseUrl.origin,
	registryPages: seoRegistry.length,
	httpRequests: snapshots.size,
	sitemapUrls: sitemapUrls.size,
	sitemapLastmodCount,
	jsonLdTypes: structuredData.map((row) => row["@type"]),
	limitations: [
		"No public property fixture is retained on staging; property lifecycle status evidence was captured separately with an approved temporary synthetic non-PII fixture and cleanup.",
		"Rendered-browser and field performance evidence are recorded separately from this structural crawl.",
		"Yandex Webmaster is intentionally excluded for noindex staging.",
	],
	findings,
};

console.log(JSON.stringify(summary, null, 2));
assert.equal(
	findings.length,
	0,
	`EPIC-46 crawl found ${findings.length} violation(s).`,
);
