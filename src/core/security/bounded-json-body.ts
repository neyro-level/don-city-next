export type BoundedJsonResult =
	| { ok: true; value: unknown }
	| { ok: false; reason: "invalid" | "too_large" };

export async function readBoundedJsonBody(
	request: Request,
	maxBytes: number,
): Promise<BoundedJsonResult> {
	const declaredLength = Number(request.headers.get("content-length"));
	if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
		return { ok: false, reason: "too_large" };
	}

	const reader = request.body?.getReader();
	if (!reader) return { ok: false, reason: "invalid" };

	const chunks: Uint8Array[] = [];
	let received = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (!value) continue;
			received += value.byteLength;
			if (received > maxBytes) {
				await reader.cancel("request body exceeded limit");
				return { ok: false, reason: "too_large" };
			}
			chunks.push(value);
		}
	} catch {
		return { ok: false, reason: "invalid" };
	} finally {
		reader.releaseLock();
	}

	const body = new Uint8Array(received);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}
	try {
		return { ok: true, value: JSON.parse(new TextDecoder().decode(body)) };
	} catch {
		return { ok: false, reason: "invalid" };
	}
}
