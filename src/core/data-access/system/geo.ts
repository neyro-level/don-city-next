import { systemOverrideAccess } from "./overrides.ts";

export const geoMatchSystemAccess = systemOverrideAccess("system-job");
export const geoValidationSystemAccess = systemOverrideAccess(
	"controlled-maintenance",
);
