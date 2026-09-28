import type { Payload, PayloadRequest } from "payload";
import { systemOverrideAccess } from "./overrides.ts";

export async function systemQueueJob({
	req,
	task,
	queue,
	input,
	waitUntil,
}: {
	req: PayloadRequest;
	task: never;
	queue: string;
	input: never;
	waitUntil?: Date;
}) {
	return req.payload.jobs.queue({
		task,
		queue,
		input,
		waitUntil,
		req,
		...systemOverrideAccess("system-job"),
	});
}

export async function systemQueuePayloadJob({
	payload,
	task,
	queue,
	input,
	waitUntil,
}: {
	payload: Payload;
	task: never;
	queue: string;
	input: never;
	waitUntil?: Date;
}) {
	return payload.jobs.queue({
		task,
		queue,
		input,
		waitUntil,
		req: {
			payload,
			user: null,
			context: systemOverrideAccess("system-job").context,
		} as unknown as PayloadRequest,
		...systemOverrideAccess("system-job"),
	});
}
