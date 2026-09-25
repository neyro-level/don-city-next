import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export const addLeadBusinessContextUpSql = `
	CREATE TYPE "public"."enum_leads_context_form_kind" AS ENUM(
		'general', 'callback', 'property', 'mortgage', 'sell', 'legal', 'rent'
	);

	ALTER TABLE "leads"
		ADD COLUMN "context_form_kind" "enum_leads_context_form_kind",
		ADD COLUMN "context_category" varchar,
		ADD COLUMN "context_district" varchar,
		ADD COLUMN "context_city" varchar,
		ADD COLUMN "context_property_id" integer,
		ADD COLUMN "context_mortgage" varchar,
		ADD COLUMN "context_development" varchar;

	ALTER TABLE "leads"
		ADD CONSTRAINT "leads_context_property_id_properties_id_fk"
		FOREIGN KEY ("context_property_id") REFERENCES "public"."properties"("id")
		ON DELETE set null ON UPDATE no action;

	CREATE INDEX "leads_context_property_idx"
		ON "leads" USING btree ("context_property_id");
`;

export const addLeadBusinessContextDownSql = `
	DROP INDEX IF EXISTS "leads_context_property_idx";

	ALTER TABLE "leads"
		DROP CONSTRAINT IF EXISTS "leads_context_property_id_properties_id_fk",
		DROP COLUMN IF EXISTS "context_form_kind",
		DROP COLUMN IF EXISTS "context_category",
		DROP COLUMN IF EXISTS "context_district",
		DROP COLUMN IF EXISTS "context_city",
		DROP COLUMN IF EXISTS "context_property_id",
		DROP COLUMN IF EXISTS "context_mortgage",
		DROP COLUMN IF EXISTS "context_development";

	DROP TYPE IF EXISTS "public"."enum_leads_context_form_kind";
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql.raw(addLeadBusinessContextUpSql));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql.raw(addLeadBusinessContextDownSql));
}
