import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Cities } from "./src/project/collections/Cities.ts";
import { Districts } from "./src/project/collections/Districts.ts";
import { FeedSources } from "./src/project/collections/FeedSources.ts";
import { ImportIssues } from "./src/project/collections/ImportIssues.ts";
import { ImportRuns } from "./src/project/collections/ImportRuns.ts";
import { LeadDeliveries } from "./src/project/collections/LeadDeliveries.ts";
import { Leads } from "./src/project/collections/Leads.ts";
import { ListingContents } from "./src/project/collections/ListingContents.ts";
import { Media } from "./src/project/collections/Media.ts";
import { Pages } from "./src/project/collections/Pages.ts";
import { Properties } from "./src/project/collections/Properties.ts";
import { Redirects } from "./src/project/collections/Redirects.ts";
import { Regions } from "./src/project/collections/Regions.ts";
import { Users } from "./src/project/collections/Users.ts";
import {
	detectRuntimeEnvMode,
	requirePayloadRuntime,
	runtimeEnv,
} from "./src/project/env.ts";
import { SiteSettings } from "./src/project/globals/SiteSettings.ts";
import { payloadJobsAutoRun } from "./src/project/jobs/queues.ts";
import { payloadJobTasks } from "./src/project/jobs/tasks.ts";
import { timewebS3Plugin } from "./src/project/timeweb-s3.plugin.ts";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const payloadRuntime =
	detectRuntimeEnvMode() === "build"
		? {
				databaseUri:
					runtimeEnv.DATABASE_URI ??
					"postgresql://127.0.0.1:5432/ams_realtbase_build_only",
				payloadSecret:
					runtimeEnv.PAYLOAD_SECRET ??
					"build-only-payload-secret-replace-before-runtime",
			}
		: requirePayloadRuntime();

export default buildConfig({
	admin: {
		user: Users.slug,
	},
	collections: [
		Users,
		Pages,
		Properties,
		Regions,
		Cities,
		Districts,
		ListingContents,
		FeedSources,
		ImportRuns,
		ImportIssues,
		Leads,
		LeadDeliveries,
		Media,
		Redirects,
	],
	globals: [SiteSettings],
	cors: runtimeEnv.NEXT_PUBLIC_SERVER_URL
		? [runtimeEnv.NEXT_PUBLIC_SERVER_URL]
		: [],
	csrf: runtimeEnv.NEXT_PUBLIC_SERVER_URL
		? [runtimeEnv.NEXT_PUBLIC_SERVER_URL]
		: [],
	cookiePrefix: "payload",
	db: postgresAdapter({
		migrationDir: resolve(projectRoot, "migrations"),
		pool: {
			connectionString: payloadRuntime.databaseUri,
			max: runtimeEnv.DATABASE_POOL_MAX,
		},
		push:
			process.env.NODE_ENV === "production"
				? false
				: runtimeEnv.PAYLOAD_DB_PUSH,
	}),
	plugins: [timewebS3Plugin],
	graphQL: {
		disable: true,
	},
	jobs: {
		enableConcurrencyControl: true,
		autoRun: payloadJobsAutoRun,
		tasks: payloadJobTasks,
		shouldAutoRun: async () => runtimeEnv.JOBS_AUTORUN,
	},
	secret: payloadRuntime.payloadSecret,
	serverURL: runtimeEnv.NEXT_PUBLIC_SERVER_URL,
	sharp,
	typescript: {
		outputFile: resolve(projectRoot, "src/project/payload-types.ts"),
	},
});
