import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE UNIQUE INDEX "city_slug_idx" ON "districts" USING btree ("city_id","slug");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP INDEX "city_slug_idx";`);
}
