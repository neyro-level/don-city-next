export type ClientReadinessConfig = {
	domain: string | null;
	deploymentTarget: "timeweb-vps" | "approved-runtime" | null;
	database: "timeweb-managed-postgresql" | "approved-managed-postgresql" | null;
	mediaStorage: "timeweb-s3" | "approved-object-storage" | null;
	feedImageSource: "external-urls" | "object-storage" | null;
	jobsActiveRuntimeCount: number | null;
	leadRetentionDays: number | null;
	archiveRetentionDays: number | null;
	employeeArchiveRetention: "indefinite";
	legalContent: "approved" | "placeholder";
	productionIndexing: "public" | "noindex" | null;
	requiredHostAllowlists: {
		outbound: readonly string[];
		externalImages: readonly string[];
		leadOutbound: readonly string[];
	};
	nginx: boolean;
	automaticBackup: boolean;
	externalMonitoring: boolean;
};

/**
 * Starter-demo values are intentionally incomplete. Client clones switch
 * siteConfig.projectKind to `client` and replace every placeholder before the
 * staging/release readiness gate.
 */
export const clientReadinessConfig = {
	domain: "doncity-home.ru",
	deploymentTarget: "timeweb-vps",
	database: "timeweb-managed-postgresql",
	mediaStorage: "timeweb-s3",
	feedImageSource: null,
	jobsActiveRuntimeCount: 1,
	leadRetentionDays: 100,
	archiveRetentionDays: 100,
	employeeArchiveRetention: "indefinite",
	legalContent: "approved",
	productionIndexing: "public",
	requiredHostAllowlists: {
		outbound: [],
		externalImages: [],
		leadOutbound: [],
	},
	nginx: true,
	automaticBackup: true,
	externalMonitoring: true,
} as const satisfies ClientReadinessConfig;
