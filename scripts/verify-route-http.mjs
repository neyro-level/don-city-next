import assert from "node:assert/strict";

const baseUrl = process.env.ROUTE_BASE_URL ?? "http://127.0.0.1:4316";
const canonicalOrigin = "https://doncity-home.ru";
const allowEmptyCatalog = process.env.ROUTE_ALLOW_EMPTY_CATALOG === "true";

const catalogPaths = new Set([
	"/donetsk/",
	"/donetsk/kvartiry/",
	"/donetsk/doma/",
	"/donetsk/uchastki/",
	"/donetsk/kommercheskaya/",
	"/kvartiry/",
	"/doma/",
	"/uchastki/",
	"/kommercheskaya/",
	"/donetsk/kvartiry/tekstilshchik/",
	"/donetsk/kvartiry/kalininskiy/",
	"/donetsk/kvartiry/odnokomnatnye/",
]);

async function request(path) {
	const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
	return { response, body: await response.text() };
}

function metadata(body) {
	return {
		robots: /<meta name="robots" content="([^"]+)"/.exec(body)?.[1] ?? null,
		canonical: /<link rel="canonical" href="([^"]+)"/.exec(body)?.[1] ?? null,
	};
}

for (const [path, robots] of [
	["/donetsk/", "index, follow"],
	["/donetsk/kvartiry/", "index, follow"],
	["/donetsk/doma/", "index, follow"],
	["/donetsk/uchastki/", "index, follow"],
	["/donetsk/kommercheskaya/", "noindex, follow"],
	["/kvartiry/", "noindex, follow"],
	["/doma/", "noindex, follow"],
	["/uchastki/", "noindex, follow"],
	["/kommercheskaya/", "noindex, follow"],
	["/donetsk/kvartiry/tekstilshchik/", "noindex, follow"],
	["/donetsk/kvartiry/kalininskiy/", "noindex, follow"],
	["/donetsk/kvartiry/odnokomnatnye/", "noindex, follow"],
	["/prodat-nedvizhimost/", "index, follow"],
	["/yurist/", "index, follow"],
	["/o-kompanii/", "index, follow"],
	["/kontakty/", "index, follow"],
	["/politika-konfidencialnosti/", "noindex, follow"],
	["/soglasie-na-obrabotku-personalnyh-dannyh/", "noindex, follow"],
	["/spasibo/", "noindex, nofollow"],
]) {
	const { response, body } = await request(path);
	if (allowEmptyCatalog && catalogPaths.has(path) && response.status === 404) {
		const actual = metadata(body);
		assert.equal(actual.robots, "noindex", path);
		assert.equal(actual.canonical, null, path);
		continue;
	}
	assert.equal(response.status, 200, path);
	const actual = metadata(body);
	assert.equal(actual.robots, robots, path);
	assert.equal(actual.canonical, `${canonicalOrigin}${path}`, path);
}

for (const path of [
	"/kvartiry/donetsk/",
	"/donetsk/novostroyki/",
	"/komplex/test/",
	"/yurist/nasledstvo/",
	"/donetsk/kvartiry/neizvestnyy/",
	"/donetsk/kvartiry/tekstilshchik/odnokomnatnye/",
	"/obekty/test/",
	"/nedvizhimost/",
]) {
	assert.equal((await request(path)).response.status, 404, path);
}

const slash = (await request("/donetsk/kvartiry")).response;
assert.equal(slash.status, 308);
assert.equal(slash.headers.get("location"), "/donetsk/kvartiry/");

const propertyId = process.env.ROUTE_TEST_PROPERTY_ID;
const propertySemantic = process.env.ROUTE_TEST_PROPERTY_SEMANTIC;
if (propertyId && propertySemantic) {
	const canonicalPath = `/kvartiry/${propertySemantic}-${propertyId}/`;
	const canonical = await request(canonicalPath);
	assert.equal(canonical.response.status, 200);
	assert.equal(
		metadata(canonical.body).canonical,
		`${canonicalOrigin}${canonicalPath}`,
	);
	for (const mismatch of [
		`/doma/oshibka-${propertyId}/`,
		`/doma/oshibka-${propertyId}`,
	]) {
		const response = (await request(mismatch)).response;
		assert.equal(response.status, 301, mismatch);
		assert.equal(response.headers.get("location"), canonicalPath, mismatch);
	}
}

const gonePropertyId = process.env.ROUTE_TEST_GONE_PROPERTY_ID;
const gonePropertySemantic = process.env.ROUTE_TEST_GONE_PROPERTY_SEMANTIC;
if (gonePropertyId && gonePropertySemantic) {
	const gonePath = `/kvartiry/${gonePropertySemantic}-${gonePropertyId}/`;
	const gone = await request(gonePath);
	assert.equal(gone.response.status, 410, gonePath);
	assert.equal(metadata(gone.body).robots, "noindex, follow", gonePath);
	assert.match(gone.body, /<h1>Объект снят с публикации<\/h1>/, gonePath);
}

console.log("RP-06 HTTP route matrix: PASS");
