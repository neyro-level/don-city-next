import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export const agglomerationModelUpSql = `
DO $$ BEGIN
	CREATE TYPE "enum_cities_locality_kind" AS ENUM ('primary_city', 'nearby_locality');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "cities"
	ADD COLUMN IF NOT EXISTS "locality_kind" "enum_cities_locality_kind" DEFAULT 'nearby_locality' NOT NULL,
	ADD COLUMN IF NOT EXISTS "latitude" numeric,
	ADD COLUMN IF NOT EXISTS "longitude" numeric,
	ADD COLUMN IF NOT EXISTS "coordinates_verified_at" timestamp(3) with time zone,
	ADD COLUMN IF NOT EXISTS "agglomeration_distance_km" numeric,
	ADD COLUMN IF NOT EXISTS "agglomeration_approved" boolean DEFAULT false NOT NULL,
	ADD COLUMN IF NOT EXISTS "agglomeration_approved_at" timestamp(3) with time zone;

UPDATE "cities"
SET
	"locality_kind" = 'primary_city',
	"agglomeration_of_id" = NULL,
	"agglomeration_distance_km" = NULL,
	"agglomeration_approved" = false,
	"agglomeration_approved_at" = NULL
WHERE "slug" = 'donetsk';

ALTER TABLE "cities"
	ADD CONSTRAINT "cities_latitude_range" CHECK ("latitude" IS NULL OR "latitude" BETWEEN -90 AND 90),
	ADD CONSTRAINT "cities_longitude_range" CHECK ("longitude" IS NULL OR "longitude" BETWEEN -180 AND 180),
	ADD CONSTRAINT "cities_agglomeration_distance_nonnegative" CHECK ("agglomeration_distance_km" IS NULL OR "agglomeration_distance_km" >= 0),
	ADD CONSTRAINT "cities_primary_not_nearby" CHECK (
		"locality_kind" <> 'primary_city'
		OR (
			"agglomeration_of_id" IS NULL
			AND "agglomeration_distance_km" IS NULL
			AND "agglomeration_approved" = false
			AND "agglomeration_approved_at" IS NULL
		)
	),
	ADD CONSTRAINT "cities_approved_nearby_complete" CHECK (
		"agglomeration_approved" = false
		OR (
			"locality_kind" = 'nearby_locality'
			AND "agglomeration_of_id" IS NOT NULL
			AND "latitude" IS NOT NULL
			AND "longitude" IS NOT NULL
			AND "coordinates_verified_at" IS NOT NULL
			AND "agglomeration_distance_km" BETWEEN 0 AND 50
			AND "agglomeration_approved_at" IS NOT NULL
		)
	);

CREATE INDEX IF NOT EXISTS "cities_locality_kind_idx" ON "cities" USING btree ("locality_kind");
CREATE INDEX IF NOT EXISTS "cities_agglomeration_approved_idx" ON "cities" USING btree ("agglomeration_approved");
`;

export const agglomerationModelDownSql = `
DROP INDEX IF EXISTS "cities_agglomeration_approved_idx";
DROP INDEX IF EXISTS "cities_locality_kind_idx";
ALTER TABLE "cities"
	DROP CONSTRAINT IF EXISTS "cities_approved_nearby_complete",
	DROP CONSTRAINT IF EXISTS "cities_primary_not_nearby",
	DROP CONSTRAINT IF EXISTS "cities_agglomeration_distance_nonnegative",
	DROP CONSTRAINT IF EXISTS "cities_longitude_range",
	DROP CONSTRAINT IF EXISTS "cities_latitude_range",
	DROP COLUMN IF EXISTS "agglomeration_approved_at",
	DROP COLUMN IF EXISTS "agglomeration_approved",
	DROP COLUMN IF EXISTS "agglomeration_distance_km",
	DROP COLUMN IF EXISTS "coordinates_verified_at",
	DROP COLUMN IF EXISTS "longitude",
	DROP COLUMN IF EXISTS "latitude",
	DROP COLUMN IF EXISTS "locality_kind";
DROP TYPE IF EXISTS "enum_cities_locality_kind";
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql.raw(agglomerationModelUpSql));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql.raw(agglomerationModelDownSql));
}
