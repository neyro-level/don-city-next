import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "public"."enum_districts_type" AS ENUM('administrative_district', 'microdistrict');
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"owner_verified" boolean DEFAULT false NOT NULL,
  	"sort_order" numeric DEFAULT 100 NOT NULL,
  	"is_published" boolean DEFAULT false NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"region_id" integer NOT NULL,
  	"name_genitive" varchar NOT NULL,
  	"name_locative" varchar NOT NULL,
  	"preposition" varchar NOT NULL,
  	"agglomeration_of_id" integer,
  	"owner_verified" boolean DEFAULT false NOT NULL,
  	"sort_order" numeric DEFAULT 100 NOT NULL,
  	"is_published" boolean DEFAULT false NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "districts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_districts_type" NOT NULL,
  	"city_id" integer NOT NULL,
  	"parent_id" integer,
  	"sort_order" numeric DEFAULT 100 NOT NULL,
  	"preposition" varchar,
  	"name_locative" varchar,
  	"owner_verified" boolean DEFAULT false NOT NULL,
  	"is_published" boolean DEFAULT false NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_noindex" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "properties" RENAME COLUMN "region" TO "region_raw";
  ALTER TABLE "properties" RENAME COLUMN "locality" TO "city_raw";
  ALTER TABLE "properties" RENAME COLUMN "district" TO "district_raw";
  DROP INDEX "properties_district_idx";
  ALTER TABLE "properties" ADD COLUMN "region_id" integer;
  ALTER TABLE "properties" ADD COLUMN "city_id" integer;
  ALTER TABLE "properties" ADD COLUMN "district_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "regions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cities_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "districts_id" integer;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_agglomeration_of_id_cities_id_fk" FOREIGN KEY ("agglomeration_of_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "districts" ADD CONSTRAINT "districts_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "districts" ADD CONSTRAINT "districts_parent_id_districts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "regions_slug_idx" ON "regions" USING btree ("slug");
  CREATE INDEX "regions_sort_order_idx" ON "regions" USING btree ("sort_order");
  CREATE INDEX "regions_is_published_idx" ON "regions" USING btree ("is_published");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE UNIQUE INDEX "cities_slug_idx" ON "cities" USING btree ("slug");
  CREATE INDEX "cities_region_idx" ON "cities" USING btree ("region_id");
  CREATE INDEX "cities_agglomeration_of_idx" ON "cities" USING btree ("agglomeration_of_id");
  CREATE INDEX "cities_sort_order_idx" ON "cities" USING btree ("sort_order");
  CREATE INDEX "cities_is_published_idx" ON "cities" USING btree ("is_published");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "districts_slug_idx" ON "districts" USING btree ("slug");
  CREATE INDEX "districts_type_idx" ON "districts" USING btree ("type");
  CREATE INDEX "districts_city_idx" ON "districts" USING btree ("city_id");
  CREATE INDEX "districts_parent_idx" ON "districts" USING btree ("parent_id");
  CREATE INDEX "districts_sort_order_idx" ON "districts" USING btree ("sort_order");
  CREATE INDEX "districts_is_published_idx" ON "districts" USING btree ("is_published");
  CREATE INDEX "districts_updated_at_idx" ON "districts" USING btree ("updated_at");
  CREATE INDEX "districts_created_at_idx" ON "districts" USING btree ("created_at");
  ALTER TABLE "properties" ADD CONSTRAINT "properties_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_districts_fk" FOREIGN KEY ("districts_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_region_idx" ON "properties" USING btree ("region_id");
  CREATE INDEX "properties_city_idx" ON "properties" USING btree ("city_id");
  CREATE INDEX "properties_district_raw_idx" ON "properties" USING btree ("district_raw");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_districts_id_idx" ON "payload_locked_documents_rels" USING btree ("districts_id");
  CREATE INDEX "properties_district_idx" ON "properties" USING btree ("district_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
  ALTER TABLE "properties" DROP CONSTRAINT "properties_region_id_regions_id_fk";
  ALTER TABLE "properties" DROP CONSTRAINT "properties_city_id_cities_id_fk";
  ALTER TABLE "properties" DROP CONSTRAINT "properties_district_id_districts_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_regions_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cities_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_districts_fk";
  DROP INDEX "properties_region_idx";
  DROP INDEX "properties_city_idx";
  DROP INDEX "properties_district_raw_idx";
  DROP INDEX "payload_locked_documents_rels_regions_id_idx";
  DROP INDEX "payload_locked_documents_rels_cities_id_idx";
  DROP INDEX "payload_locked_documents_rels_districts_id_idx";
  DROP INDEX "properties_district_idx";
  ALTER TABLE "properties" DROP COLUMN "region_id";
  ALTER TABLE "properties" DROP COLUMN "city_id";
  ALTER TABLE "properties" DROP COLUMN "district_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "regions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cities_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "districts_id";

  ALTER TABLE "properties" RENAME COLUMN "region_raw" TO "region";
  ALTER TABLE "properties" RENAME COLUMN "city_raw" TO "locality";
  ALTER TABLE "properties" RENAME COLUMN "district_raw" TO "district";
  CREATE INDEX "properties_district_idx" ON "properties" USING btree ("district");

  DROP TABLE "districts";
  DROP TABLE "cities";
  DROP TABLE "regions";
  DROP TYPE "public"."enum_districts_type";`);
}
