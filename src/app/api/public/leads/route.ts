import { type NextRequest, NextResponse } from "next/server";
import {
	checkPublicLeadRateLimit,
	submitPublicLead,
} from "../../../../core/data-access/public/leads.ts";
import { readBoundedJsonBody } from "../../../../core/security/bounded-json-body.ts";
import { evaluatePublicLeadRequest } from "../../../../core/security/public-lead-request.ts";
import { getTrustedClientAddress } from "../../../../core/security/trusted-client-address.ts";
import { runtimeEnv } from "../../../../project/env.ts";

export const runtime = "nodejs";
const maxLeadBodyBytes = 64 * 1024;

export async function POST(request: NextRequest) {
	const boundary = evaluatePublicLeadRequest(
		request,
		runtimeEnv.NEXT_PUBLIC_SERVER_URL,
	);
	if (!boundary.allowed) {
		return NextResponse.json(
			{ accepted: false, code: "lead.invalid_request" },
			{ status: boundary.reason === "content_type" ? 415 : 403 },
		);
	}

	const rateLimitKey = getTrustedClientAddress(request);
	const limited = checkPublicLeadRateLimit(rateLimitKey);
	if (limited) {
		return NextResponse.json(
			{ accepted: false, code: limited.code },
			{ status: limited.status },
		);
	}

	const parsed = await readBoundedJsonBody(request, maxLeadBodyBytes);
	if (!parsed.ok) {
		return NextResponse.json(
			{ accepted: false, code: "lead.invalid_payload" },
			{ status: parsed.reason === "too_large" ? 413 : 400 },
		);
	}

	const result = await submitPublicLead({
		body: parsed.value,
		rateLimitKey,
		rateLimitChecked: true,
	});

	if (!result.accepted) {
		return NextResponse.json(
			{ accepted: false, code: result.code },
			{ status: result.status },
		);
	}

	return NextResponse.json({ accepted: true });
}
