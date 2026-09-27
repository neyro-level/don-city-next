import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
		ALTER TYPE "public"."enum_listing_contents_registry_id"
			ADD VALUE IF NOT EXISTS 'COMM_GEO';
	`);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
	// PostgreSQL enum values cannot be removed safely while preserving existing
	// rows. The additive value is backward-compatible with the previous image.
}
