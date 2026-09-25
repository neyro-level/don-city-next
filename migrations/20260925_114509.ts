import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "public"."enum_listing_contents_registry_id" AS ENUM('APT_DIST_VOR', 'APT_DIST_KALIN', 'APT_DIST_KIR', 'APT_DIST_PROL', 'APT_MICRO_TEXT', 'APT_ROOM_1', 'APT_ROOM_2', 'APT_DIST_LEN', 'APT_DIST_PETR', 'HOUSE_DIST_BUD', 'HOUSE_DIST_KIR', 'HOUSE_DIST_KUYB', 'APT_ROOM_3', 'APT_DIST_BUD', 'APT_DIST_KIEV', 'APT_DIST_KUYB', 'HOUSE_DIST_VOR', 'HOUSE_DIST_KALIN', 'HOUSE_DIST_KIEV', 'HOUSE_DIST_LEN', 'HOUSE_DIST_PETR', 'HOUSE_DIST_PROL', 'HOUSE_FACET_DACHI', 'LAND_FACET_IZHS', 'LAND_FACET_SNT');
  CREATE TYPE "public"."enum_listing_contents_status" AS ENUM('draft', 'approved');
  CREATE TABLE "listing_contents_context_facts" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "source" varchar NOT NULL,
    "checked_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "listing_contents" (
    "id" serial PRIMARY KEY NOT NULL,
    "registry_id" "enum_listing_contents_registry_id" NOT NULL,
    "status" "enum_listing_contents_status" DEFAULT 'draft' NOT NULL,
    "introduction" varchar NOT NULL,
    "approved_at" timestamp(3) with time zone,
    "approved_by_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "listing_contents_id" integer;
  ALTER TABLE "listing_contents_context_facts" ADD CONSTRAINT "listing_contents_context_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."listing_contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "listing_contents" ADD CONSTRAINT "listing_contents_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "listing_contents_context_facts_order_idx" ON "listing_contents_context_facts" USING btree ("_order");
  CREATE INDEX "listing_contents_context_facts_parent_id_idx" ON "listing_contents_context_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "listing_contents_registry_id_idx" ON "listing_contents" USING btree ("registry_id");
  CREATE INDEX "listing_contents_status_idx" ON "listing_contents" USING btree ("status");
  CREATE INDEX "listing_contents_approved_by_idx" ON "listing_contents" USING btree ("approved_by_id");
  CREATE INDEX "listing_contents_updated_at_idx" ON "listing_contents" USING btree ("updated_at");
  CREATE INDEX "listing_contents_created_at_idx" ON "listing_contents" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_listing_contents_fk" FOREIGN KEY ("listing_contents_id") REFERENCES "public"."listing_contents"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_listing_contents_id_idx" ON "payload_locked_documents_rels" USING btree ("listing_contents_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_listing_contents_fk";
  DROP INDEX "payload_locked_documents_rels_listing_contents_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "listing_contents_id";
  DROP TABLE "listing_contents_context_facts" CASCADE;
  DROP TABLE "listing_contents" CASCADE;
  DROP TYPE "public"."enum_listing_contents_registry_id";
  DROP TYPE "public"."enum_listing_contents_status";`);
}
