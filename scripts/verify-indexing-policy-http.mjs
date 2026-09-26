import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import {
	composeMetadataRobots,
	xRobotsTagForPolicy,
} from "../src/project/indexing-policy.ts";

const routeMatrix = [
	{ id: "home", status: 200, robots: { index: true, follow: true } },
	{ id: "geo", status: 200, robots: { index: true, follow: true } },
	{ id: "category", status: 200, robots: { index: true, follow: true } },
	{ id: "district", status: 200, robots: { index: true, follow: true } },
	{ id: "facet", status: 200, robots: { index: false, follow: true } },
	{ id: "property", status: 200, robots: { index: true, follow: true } },
	{ id: "static", status: 200, robots: { index: true, follow: true } },
	{ id: "legal", status: 200, robots: { index: false, follow: true } },
	{ id: "not-found", status: 404, robots: { index: false, follow: false } },
	{
		id: "gone",
		status: 410,
		robots: { index: false, follow: true },
		explicitHeader: "noindex, follow",
	},
];

function normalizeRobots(value) {
	return value
		.toLowerCase()
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean)
		.join(",");
}

function robotsContent(robots) {
	return `${robots.index ? "index" : "noindex"},${
		robots.follow ? "follow" : "nofollow"
	}`;
}

const server = createServer((request, response) => {
	const [, policy, routeId] = new URL(
		request.url ?? "/",
		"http://127.0.0.1",
	).pathname.split("/");
	assert.ok(policy === "noindex" || policy === "public");
	const route = routeMatrix.find((candidate) => candidate.id === routeId);
	assert.ok(route, `Unknown route fixture ${routeId}`);

	const effectiveRobots = composeMetadataRobots(policy, route.robots);
	const xRobotsTag =
		xRobotsTagForPolicy(policy) ?? route.explicitHeader ?? null;
	if (xRobotsTag) response.setHeader("X-Robots-Tag", xRobotsTag);
	response.writeHead(route.status, { "Content-Type": "text/html; charset=utf-8" });
	response.end(
		`<!doctype html><html><head><meta name="robots" content="${robotsContent(
			effectiveRobots,
		)}"></head><body>${route.id}</body></html>`,
	);
});

await new Promise((resolve, reject) => {
	server.once("error", reject);
	server.listen(0, "127.0.0.1", resolve);
});

try {
	const address = server.address();
	assert.ok(address && typeof address === "object");
	const origin = `http://127.0.0.1:${address.port}`;

	for (const policy of ["noindex", "public"]) {
		for (const route of routeMatrix) {
			const response = await fetch(`${origin}/${policy}/${route.id}`);
			const body = await response.text();
			const metaRobots = /<meta name="robots" content="([^"]+)"/.exec(
				body,
			)?.[1];
			assert.equal(response.status, route.status, `${policy}:${route.id}:status`);

			if (policy === "noindex") {
				assert.equal(
					normalizeRobots(metaRobots ?? ""),
					"noindex,nofollow",
					`${policy}:${route.id}:meta`,
				);
				assert.equal(
					normalizeRobots(response.headers.get("x-robots-tag") ?? ""),
					"noindex,nofollow",
					`${policy}:${route.id}:header`,
				);
				continue;
			}

			assert.equal(
				normalizeRobots(metaRobots ?? ""),
				normalizeRobots(robotsContent(route.robots)),
				`${policy}:${route.id}:page-policy`,
			);
			assert.equal(
				normalizeRobots(response.headers.get("x-robots-tag") ?? ""),
				normalizeRobots(route.explicitHeader ?? ""),
				`${policy}:${route.id}:header`,
			);
		}
	}

	const nextConfig = readFileSync("next.config.ts", "utf8");
	assert.match(nextConfig, /xRobotsTagForPolicy\(getProjectIndexingPolicy\(\)\)/);
	assert.match(nextConfig, /\.\.\.releaseIndexingHeaders/);
	assert.match(nextConfig, /\.\.\.adminIndexingHeaders/g);

	for (const file of [
		"src/app/(site)/page.tsx",
		"src/app/(site)/marketing-route.tsx",
		"src/app/(site)/public-route.tsx",
	]) {
		const source = readFileSync(file, "utf8");
		assert.match(source, /@\/project\/page-metadata/, file);
		assert.doesNotMatch(source, /@\/core\/seo\/page-metadata/, file);
	}

	console.log(
		`CP-01 indexing HTTP matrix: PASS (${routeMatrix.length * 2} cases)`,
	);
} finally {
	await new Promise((resolve, reject) =>
		server.close((error) => (error ? reject(error) : resolve())),
	);
}
