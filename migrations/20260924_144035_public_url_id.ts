import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "properties" ADD COLUMN "public_url_id" numeric;
  CREATE UNIQUE INDEX "properties_public_url_id_idx" ON "properties" USING btree ("public_url_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "properties_public_url_id_idx";
  ALTER TABLE "properties" DROP COLUMN "public_url_id";`)
}
