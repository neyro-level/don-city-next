import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPublicPropertyByPublicUrlId } from "@/core/data-access/public/provider";
import { resolveProjectPublicRoute } from "@/project/public-route-resolver";
import { anonymousRawRestEdgeDecision } from "./core/security/anonymous-raw-rest.ts";

const filePath = /\.[a-z0-9]+$/i;
const propertyLeaf = /-[0-9]+$/;

async function resolvePublicRequest(request: NextRequest) {
	if (request.method !== "GET" && request.method !== "HEAD") {
		return NextResponse.next();
	}
	const pathname = request.nextUrl.pathname;
	if (pathname === "/" || pathname.endsWith("/") || filePath.test(pathname)) {
		const segments = pathname.split("/").filter(Boolean);
		if (segments.length === 2 && propertyLeaf.test(segments[1] ?? "")) {
			const result = await resolveProjectPublicRoute(segments, {
				loadProperty: getPublicPropertyByPublicUrlId,
			});
			if (result.kind === "redirect" && result.statusCode === 301) {
				return NextResponse.redirect(
					new URL(result.destination, request.url),
					301,
				);
			}
		}
		return NextResponse.next();
	}

	const segments = pathname.split("/").filter(Boolean);
	if (segments.length === 2 && propertyLeaf.test(segments[1] ?? "")) {
		const result = await resolveProjectPublicRoute(segments, {
			loadProperty: getPublicPropertyByPublicUrlId,
		});
		if (result.kind === "redirect" && result.statusCode === 301) {
			return NextResponse.redirect(
				new URL(result.destination, request.url),
				301,
			);
		}
	}
	const destination = new URL(request.url);
	destination.pathname = `${pathname}/`;
	return NextResponse.redirect(destination, 308);
}

export function proxy(request: NextRequest) {
	const denial = anonymousRawRestEdgeDecision(
		request.nextUrl.pathname,
		request.cookies.get("payload-token")?.value,
	);
	if (denial) {
		return NextResponse.json({ error: "notFound" }, { status: denial.status });
	}
	if (request.nextUrl.pathname.startsWith("/api/")) {
		return NextResponse.next();
	}
	return resolvePublicRequest(request);
}

export const config = {
	matcher: [
		"/api/:path*",
		"/((?!api(?:/|$)|admin(?:/|$)|http(?:/|$)|_next(?:/|$)|media(?:/|$)|[.]well-known(?:/|$)).*)",
	],
};
