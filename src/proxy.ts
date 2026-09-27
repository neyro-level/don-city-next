import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPublicPropertyEdgeState } from "@/core/data-access/public/provider";
import { createPropertyGoneResponse } from "@/core/http/property-gone-response";
import { cacheControlForMediaPath } from "@/core/media/cache-policy";
import { anonymousRawRestEdgeDecision } from "./core/security/anonymous-raw-rest.ts";

const filePath = /\.[a-z0-9]+$/i;
const propertyLeaf = /-[0-9]+$/;

function publicUrlIdFromLeaf(leaf: string) {
	return leaf.match(/-([0-9]+)$/)?.[1] ?? null;
}

async function resolvePropertyEdgeRequest(
	request: NextRequest,
	segments: readonly string[],
) {
	const publicUrlId = publicUrlIdFromLeaf(segments[1] ?? "");
	if (!publicUrlId) return NextResponse.next();
	const state = await getPublicPropertyEdgeState(publicUrlId);
	if (state?.lifecycle.kind === "gone") {
		return createPropertyGoneResponse(publicUrlId);
	}
	if (
		state?.canonicalPath &&
		state.canonicalPath !== request.nextUrl.pathname
	) {
		return NextResponse.redirect(
			new URL(state.canonicalPath, request.url),
			301,
		);
	}
	return NextResponse.next();
}

async function resolvePublicRequest(request: NextRequest) {
	if (request.method !== "GET" && request.method !== "HEAD") {
		return NextResponse.next();
	}
	const pathname = request.nextUrl.pathname;
	if (pathname === "/" || pathname.endsWith("/") || filePath.test(pathname)) {
		const segments = pathname.split("/").filter(Boolean);
		if (segments.length === 2 && propertyLeaf.test(segments[1] ?? "")) {
			return resolvePropertyEdgeRequest(request, segments);
		}
		return NextResponse.next();
	}

	const segments = pathname.split("/").filter(Boolean);
	if (segments.length === 2 && propertyLeaf.test(segments[1] ?? "")) {
		const edgeResponse = await resolvePropertyEdgeRequest(request, segments);
		if (edgeResponse.status !== 200) return edgeResponse;
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
		const response = NextResponse.next();
		const cacheControl = cacheControlForMediaPath(request.nextUrl.pathname);
		if (cacheControl) response.headers.set("Cache-Control", cacheControl);
		return response;
	}
	return resolvePublicRequest(request);
}

export const config = {
	matcher: [
		"/api/:path*",
		"/((?!api(?:/|$)|admin(?:/|$)|http(?:/|$)|_next(?:/|$)|media(?:/|$)|[.]well-known(?:/|$)).*)",
	],
};
