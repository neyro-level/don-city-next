import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "public"."enum_properties_house_type" AS ENUM('house', 'cottage', 'townhouse', 'dacha', 'part_of_house');
  ALTER TYPE "public"."enum_properties_category" ADD VALUE 'room';
  ALTER TYPE "public"."enum_properties_category" ADD VALUE 'garage';
  CREATE TABLE "properties_communications" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar NOT NULL
  );

  ALTER TABLE "properties" ADD COLUMN "house_type" "enum_properties_house_type";
  ALTER TABLE "properties" ADD COLUMN "plot_area_sotka" numeric;
  ALTER TABLE "properties" ADD COLUMN "land_category" varchar;
  ALTER TABLE "properties" ADD COLUMN "permitted_use" varchar;
  ALTER TABLE "properties" ADD COLUMN "land_area_needs_review" boolean DEFAULT false;
  ALTER TABLE "properties_communications" ADD CONSTRAINT "properties_communications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_communications_order_idx" ON "properties_communications" USING btree ("_order");
  CREATE INDEX "properties_communications_parent_id_idx" ON "properties_communications" USING btree ("_parent_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "properties_communications" CASCADE;
  ALTER TABLE "properties" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_properties_category";
  CREATE TYPE "public"."enum_properties_category" AS ENUM('apartment', 'house', 'land', 'commercial');
  ALTER TABLE "properties" ALTER COLUMN "category" SET DATA TYPE "public"."enum_properties_category" USING "category"::"public"."enum_properties_category";
  ALTER TABLE "properties" DROP COLUMN "house_type";
  ALTER TABLE "properties" DROP COLUMN "plot_area_sotka";
  ALTER TABLE "properties" DROP COLUMN "land_category";
  ALTER TABLE "properties" DROP COLUMN "permitted_use";
  ALTER TABLE "properties" DROP COLUMN "land_area_needs_review";
  DROP TYPE "public"."enum_properties_house_type";`);
}
