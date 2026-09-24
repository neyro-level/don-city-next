import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
    CREATE TABLE "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "brand_name" varchar DEFAULT 'ДОН СИТИ' NOT NULL,
      "legal_name" varchar DEFAULT 'Индивидуальный предприниматель Плахтиенко Наталья Геннадьевна' NOT NULL,
      "phone_display" varchar DEFAULT '+7 (949) 110-10-10' NOT NULL,
      "phone_e164" varchar DEFAULT '+79491101010' NOT NULL,
      "email" varchar DEFAULT 'doncity-info@yandex.com' NOT NULL,
      "address_full" varchar DEFAULT 'Донецкая Народная Республика, г. Донецк, бульвар Шахтостроителей, 16' NOT NULL,
      "address_street_address" varchar DEFAULT 'бульвар Шахтостроителей, 16' NOT NULL,
      "address_address_locality" varchar DEFAULT 'Донецк' NOT NULL,
      "address_address_region" varchar DEFAULT 'Донецкая Народная Республика' NOT NULL,
      "address_address_country" varchar DEFAULT 'RU' NOT NULL,
      "opening_hours" varchar DEFAULT 'Пн–Пт: 09:00–18:00; Сб–Вс: 09:00–18:00' NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
    DROP TABLE "site_settings" CASCADE;
  `);
}
