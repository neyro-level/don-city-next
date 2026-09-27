import { isLiveFuturePayloadJob } from "../leads/job-liveness.ts";

export type ImportRecoveryCandidate = {
	status: "queued" | "running" | string;
	queuedAt?: string | null;
	startedAt?: string | null;
	heartbeatAt?: string | null;
	jobId?: string | null;
};

export type ImportRecoveryDecision =
	| { interrupt: false }
	| {
			interrupt: true;
			reason:
				| "running_heartbeat_stale"
				| "running_heartbeat_missing"
				| "queued_without_job"
				| "queued_dead_job";
	  };

export function decideImportRunRecovery(input: {
	run: ImportRecoveryCandidate;
	importStaleBefore: string;
	queuedOrphanBefore: string;
	job?: {
		waitUntil?: string | null;
		completedAt?: string | null;
		processing?: boolean | null;
	} | null;
	now: Date;
}): ImportRecoveryDecision {
	const { run } = input;
	if (run.status === "running") {
		if (run.heartbeatAt) {
			return run.heartbeatAt < input.importStaleBefore
				? { interrupt: true, reason: "running_heartbeat_stale" }
				: { interrupt: false };
		}
		return run.startedAt && run.startedAt < input.importStaleBefore
			? { interrupt: true, reason: "running_heartbeat_missing" }
			: { interrupt: false };
	}

	if (
		run.status !== "queued" ||
		!run.queuedAt ||
		run.queuedAt >= input.queuedOrphanBefore
	) {
		return { interrupt: false };
	}
	if (!run.jobId) {
		return { interrupt: true, reason: "queued_without_job" };
	}
	return isLiveFuturePayloadJob(input.job, input.now)
		? { interrupt: false }
		: { interrupt: true, reason: "queued_dead_job" };
}
