export type PublicLeadRequestDecision =
	| { allowed: true }
	| {
			allowed: false;
			reason: "content_type" | "fetch_site" | "origin";
	  };

function normalizedOrigin(value: string): string | undefined {
	try {
		return new URL(value).origin;
	} catch {
		return undefined;
	}
}

export function evaluatePublicLeadRequest(
	request: Pick<Request, "headers">,
	allowedOrigin: string | undefined,
): PublicLeadRequestDecision {
	const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
	if (!contentType.startsWith("application/json")) {
		return { allowed: false, reason: "content_type" };
	}

	const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
	if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
		return { allowed: false, reason: "fetch_site" };
	}

	const expected = allowedOrigin ? normalizedOrigin(allowedOrigin) : undefined;
	const actual = request.headers.get("origin");
	if (!expected || !actual || normalizedOrigin(actual) !== expected) {
		return { allowed: false, reason: "origin" };
	}

	return { allowed: true };
}
