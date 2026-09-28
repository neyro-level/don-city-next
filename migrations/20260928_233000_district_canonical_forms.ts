import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export const districtCanonicalFormsUpSql = `
ALTER TABLE "districts"
	ADD COLUMN IF NOT EXISTS "name_genitive" varchar;

CREATE TABLE IF NOT EXISTS "districts_synonyms" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar NOT NULL
);

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'districts_synonyms_parent_id_fk'
	) THEN
		ALTER TABLE "districts_synonyms"
			ADD CONSTRAINT "districts_synonyms_parent_id_fk"
			FOREIGN KEY ("_parent_id") REFERENCES "public"."districts"("id")
			ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS "districts_synonyms_order_idx"
	ON "districts_synonyms" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "districts_synonyms_parent_id_idx"
	ON "districts_synonyms" USING btree ("_parent_id");

WITH canonical(slug, name_genitive, synonyms) AS (
	VALUES
		('budennovskiy', 'Будённовского', ARRAY['Будённовский район', 'Будённовском районе', 'Будённовский р-н']),
		('voroshilovskiy', 'Ворошиловского', ARRAY['Ворошиловский район', 'Ворошиловском районе', 'Ворошиловский р-н']),
		('kalininskiy', 'Калининского', ARRAY['Калининский район', 'Калининском районе', 'Калининский р-н']),
		('kievskiy', 'Киевского', ARRAY['Киевский район', 'Киевском районе', 'Киевский р-н']),
		('kirovskiy', 'Кировского', ARRAY['Кировский район', 'Кировском районе', 'Кировский р-н']),
		('kuybyshevskiy', 'Куйбышевского', ARRAY['Куйбышевский район', 'Куйбышевском районе', 'Куйбышевский р-н']),
		('leninskiy', 'Ленинского', ARRAY['Ленинский район', 'Ленинском районе', 'Ленинский р-н']),
		('petrovskiy', 'Петровского', ARRAY['Петровский район', 'Петровском районе', 'Петровский р-н']),
		('proletarskiy', 'Пролетарского', ARRAY['Пролетарский район', 'Пролетарском районе', 'Пролетарский р-н']),
		('tekstilshchik', 'Текстильщика', ARRAY['мкр. Текстильщик', 'микрорайон Текстильщик', 'на Текстильщике'])
)
UPDATE "districts" AS district
SET "name_genitive" = canonical.name_genitive
FROM canonical
JOIN "cities" AS city ON city."slug" = 'donetsk'
WHERE district."city_id" = city."id"
	AND district."slug" = canonical.slug;

WITH canonical(slug, synonyms) AS (
	VALUES
		('budennovskiy', ARRAY['Будённовский район', 'Будённовском районе', 'Будённовский р-н']),
		('voroshilovskiy', ARRAY['Ворошиловский район', 'Ворошиловском районе', 'Ворошиловский р-н']),
		('kalininskiy', ARRAY['Калининский район', 'Калининском районе', 'Калининский р-н']),
		('kievskiy', ARRAY['Киевский район', 'Киевском районе', 'Киевский р-н']),
		('kirovskiy', ARRAY['Кировский район', 'Кировском районе', 'Кировский р-н']),
		('kuybyshevskiy', ARRAY['Куйбышевский район', 'Куйбышевском районе', 'Куйбышевский р-н']),
		('leninskiy', ARRAY['Ленинский район', 'Ленинском районе', 'Ленинский р-н']),
		('petrovskiy', ARRAY['Петровский район', 'Петровском районе', 'Петровский р-н']),
		('proletarskiy', ARRAY['Пролетарский район', 'Пролетарском районе', 'Пролетарский р-н']),
		('tekstilshchik', ARRAY['мкр. Текстильщик', 'микрорайон Текстильщик', 'на Текстильщике'])
)
INSERT INTO "districts_synonyms" ("_order", "_parent_id", "id", "value")
SELECT
	alias.ordinality - 1,
	district."id",
	'dc11-r12-01-' || district."id" || '-' || alias.ordinality,
	alias.value
FROM canonical
JOIN "cities" AS city ON city."slug" = 'donetsk'
JOIN "districts" AS district
	ON district."city_id" = city."id" AND district."slug" = canonical.slug
CROSS JOIN LATERAL unnest(canonical.synonyms) WITH ORDINALITY AS alias(value, ordinality)
ON CONFLICT ("id") DO UPDATE SET
	"_order" = EXCLUDED."_order",
	"_parent_id" = EXCLUDED."_parent_id",
	"value" = EXCLUDED."value";
`;

export const districtCanonicalFormsDownSql = `
DROP TABLE IF EXISTS "districts_synonyms" CASCADE;
ALTER TABLE "districts" DROP COLUMN IF EXISTS "name_genitive";
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql.raw(districtCanonicalFormsUpSql));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql.raw(districtCanonicalFormsDownSql));
}
