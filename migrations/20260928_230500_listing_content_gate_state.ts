import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export const listingContentGateStateUpSql = `
ALTER TABLE "listing_contents"
	ADD COLUMN IF NOT EXISTS "inventory_snapshot" numeric,
	ADD COLUMN IF NOT EXISTS "inventory_evaluated_at" timestamp(3) with time zone,
	ADD COLUMN IF NOT EXISTS "last_threshold_passed_at" timestamp(3) with time zone;

ALTER TABLE "listing_contents"
	ADD CONSTRAINT "listing_contents_inventory_snapshot_nonnegative"
	CHECK ("inventory_snapshot" IS NULL OR "inventory_snapshot" >= 0);
`;

export const listingContentGateStateDownSql = `
ALTER TABLE "listing_contents"
	DROP CONSTRAINT IF EXISTS "listing_contents_inventory_snapshot_nonnegative",
	DROP COLUMN IF EXISTS "last_threshold_passed_at",
	DROP COLUMN IF EXISTS "inventory_evaluated_at",
	DROP COLUMN IF EXISTS "inventory_snapshot";
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql.raw(listingContentGateStateUpSql));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql.raw(listingContentGateStateDownSql));
}
