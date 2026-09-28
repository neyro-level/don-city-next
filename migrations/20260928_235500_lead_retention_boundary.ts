import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export const leadRetentionBoundaryDays = 100;

export const leadRetentionBoundaryUpSql = `
UPDATE "leads"
SET "retention_until" = "created_at" + INTERVAL '${leadRetentionBoundaryDays} days'
WHERE "retention_until" IS NULL;

DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM "leads" WHERE "retention_until" IS NULL) THEN
		RAISE EXCEPTION 'Lead retention backfill left NULL boundaries';
	END IF;
END $$;

ALTER TABLE "leads"
	ALTER COLUMN "retention_until" SET NOT NULL;
`;

export const leadRetentionBoundaryDownSql = `
ALTER TABLE "leads"
	ALTER COLUMN "retention_until" DROP NOT NULL;
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql.raw(leadRetentionBoundaryUpSql));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql.raw(leadRetentionBoundaryDownSql));
}
