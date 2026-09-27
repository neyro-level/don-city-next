import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "media" ALTER COLUMN "prefix" SET DEFAULT '';
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_detail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_detail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_detail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_detail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_detail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_detail_filename" varchar;
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_detail_sizes_detail_filename_idx" ON "media" USING btree ("sizes_detail_filename");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "media" ALTER COLUMN "prefix" DROP DEFAULT;
  DROP INDEX "media_sizes_thumb_sizes_thumb_filename_idx";
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_detail_sizes_detail_filename_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_detail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_detail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_detail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_detail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_detail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_detail_filename";`);
}
