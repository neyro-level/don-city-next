import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export const geoRelationBackfillUpSql = `
CREATE TABLE IF NOT EXISTS "_dc11_geo_relation_backfill_audit" (
	"property_id" integer PRIMARY KEY REFERENCES "properties"("id") ON DELETE CASCADE,
	"previous_city_id" integer,
	"previous_district_id" integer,
	"previous_needs_review" boolean,
	"previous_updated_at" timestamp(3) with time zone NOT NULL,
	"migrated_at" timestamp(3) with time zone NOT NULL DEFAULT now()
);

WITH "geo_matches" AS (
	SELECT
		property."id" AS "property_id",
		city_match."city_id",
		district_match."district_id",
		nullif(btrim(property."city_raw"), '') AS "city_raw",
		nullif(btrim(property."district_raw"), '') AS "district_raw"
	FROM "properties" property
	LEFT JOIN LATERAL (
		SELECT CASE WHEN count(*) = 1 THEN min(city."id") END AS "city_id"
		FROM "cities" city
		WHERE btrim(regexp_replace(lower(replace(property."city_raw", 'ё', 'е')), '[^a-zа-я0-9]+', ' ', 'g'))
			IN (
				btrim(regexp_replace(lower(replace(city."name", 'ё', 'е')), '[^a-zа-я0-9]+', ' ', 'g')),
				btrim(regexp_replace(lower(replace(city."slug", 'ё', 'е')), '[^a-zа-я0-9]+', ' ', 'g'))
			)
	) city_match ON true
	LEFT JOIN LATERAL (
		SELECT CASE WHEN count(*) = 1 THEN min(district."id") END AS "district_id"
		FROM "districts" district
		JOIN "cities" matched_city ON matched_city."id" = city_match."city_id"
		WHERE district."city_id" = city_match."city_id"
			AND (
				btrim(regexp_replace(lower(replace(property."district_raw", 'ё', 'е')), '[^a-zа-я0-9]+', ' ', 'g'))
					IN (
						btrim(regexp_replace(lower(replace(district."name", 'ё', 'е')), '[^a-zа-я0-9]+', ' ', 'g')),
						btrim(regexp_replace(lower(replace(district."slug", 'ё', 'е')), '[^a-zа-я0-9]+', ' ', 'g'))
					)
				OR (
					matched_city."slug" = 'donetsk'
					AND district."slug" = 'tekstilshchik'
					AND btrim(regexp_replace(lower(replace(property."district_raw", 'ё', 'е')), '[^a-zа-я0-9]+', ' ', 'g')) LIKE '%текстильщик%'
				)
			)
	) district_match ON city_match."city_id" IS NOT NULL
	WHERE property."status" = 'active'
		AND property."published_at" IS NOT NULL
		AND property."content_purged_at" IS NULL
),
"captured" AS (
	INSERT INTO "_dc11_geo_relation_backfill_audit" (
		"property_id",
		"previous_city_id",
		"previous_district_id",
		"previous_needs_review",
		"previous_updated_at"
	)
	SELECT
		property."id",
		property."city_id",
		property."district_id",
		property."needs_review",
		property."updated_at"
	FROM "properties" property
	JOIN "geo_matches" matched ON matched."property_id" = property."id"
	WHERE
		(property."city_id" IS NULL AND matched."city_id" IS NOT NULL)
		OR (property."district_id" IS NULL AND matched."district_id" IS NOT NULL)
		OR (
			coalesce(property."needs_review", false) = false
			AND (
				(matched."city_raw" IS NOT NULL AND matched."city_id" IS NULL)
				OR (matched."district_raw" IS NOT NULL AND matched."district_id" IS NULL)
			)
		)
	ON CONFLICT ("property_id") DO NOTHING
	RETURNING "property_id"
)
UPDATE "properties" property
SET
	"city_id" = coalesce(property."city_id", matched."city_id"),
	"district_id" = coalesce(property."district_id", matched."district_id"),
	"needs_review" = coalesce(property."needs_review", false) OR (
		(matched."city_raw" IS NOT NULL AND matched."city_id" IS NULL)
		OR (matched."district_raw" IS NOT NULL AND matched."district_id" IS NULL)
	),
	"updated_at" = now()
FROM "geo_matches" matched
JOIN "captured" captured ON captured."property_id" = matched."property_id"
WHERE property."id" = matched."property_id";
`;

export const geoRelationBackfillDownSql = `
UPDATE "properties" property
SET
	"city_id" = audit."previous_city_id",
	"district_id" = audit."previous_district_id",
	"needs_review" = audit."previous_needs_review",
	"updated_at" = audit."previous_updated_at"
FROM "_dc11_geo_relation_backfill_audit" audit
WHERE property."id" = audit."property_id";

DROP TABLE "_dc11_geo_relation_backfill_audit";
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql.raw(geoRelationBackfillUpSql));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql.raw(geoRelationBackfillDownSql));
}
