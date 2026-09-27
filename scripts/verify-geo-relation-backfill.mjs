import {
	assertLocalTestDatabaseUri,
	loadLocalEnv,
} from "./integration/env.mjs";
import {
	prepareIntegrationDatabase,
	proveGeoRelationBackfillMigration,
} from "./integration/test-database.mjs";

loadLocalEnv();

const testUri = process.env.DATABASE_URI_TEST;
if (!testUri) {
	throw new Error(
		"verify:geo-relation-backfill requires an explicit DATABASE_URI_TEST.",
	);
}
assertLocalTestDatabaseUri(testUri);

await prepareIntegrationDatabase(testUri);
proveGeoRelationBackfillMigration(testUri);

console.log("verify:geo-relation-backfill: ok");
