import { execFileSync } from "node:child_process";
import { leadDeliveryRelationalContractUpSql } from "../../migrations/20260919_151000.ts";
import {
	payloadAuthSecurityDownSql,
	payloadAuthSecurityUpSql,
} from "../../migrations/20260921_185354_add_reset_password_requested_at.ts";
import {
	geoRelationBackfillDownSql,
	geoRelationBackfillUpSql,
} from "../../migrations/20260928_003000_geo_relation_backfill.ts";
import { propertyNumericInvariantsUpSql } from "../../src/core/data-access/system/sql/property-numeric-invariants.ts";
import { assertLocalTestDatabaseUri } from "./env.mjs";

function psql(uri, sql) {
	try {
		return execFileSync(
			"psql",
			["-X", "-v", "ON_ERROR_STOP=1", "-d", uri, "-t", "-A", "-c", sql],
			{
				stdio: "pipe",
				encoding: "utf8",
				env: {
					...process.env,
					PGPASSWORD: process.env.PGPASSWORD ?? "",
					PGCLIENTENCODING: process.platform === "win32" ? "WIN1251" : "UTF8",
				},
			},
		).trim();
	} catch (error) {
		const stderr = error.stderr?.toString("utf8")?.trim();
		throw new Error(stderr || "psql command failed");
	}
}

function expectPsqlFailure(uri, sql, expectedPattern) {
	try {
		psql(uri, sql);
	} catch (error) {
		if (!expectedPattern.test(String(error))) throw error;
		return;
	}
	throw new Error(`Expected PostgreSQL failure matching ${expectedPattern}.`);
}

function adminUri(uri) {
	const parsed = new URL(uri);
	parsed.pathname = "/postgres";
	return parsed.toString();
}

function adminUriFrom(uri) {
	return adminUri(uri);
}

export async function prepareIntegrationDatabase(preferredUri) {
	const { database } = assertLocalTestDatabaseUri(preferredUri);
	const admin = adminUriFrom(preferredUri);
	const exists = psql(
		admin,
		`SELECT 1 FROM pg_database WHERE datname = '${database.replace(/'/g, "''")}'`,
	);
	if (!exists) {
		psql(admin, `CREATE DATABASE ${database}`);
	}

	const ownsPublicSchema = psql(
		preferredUri,
		"SELECT pg_get_userbyid(nspowner) = current_user FROM pg_namespace WHERE nspname = 'public'",
	);
	const isSuperuser = psql(
		preferredUri,
		"SELECT current_setting('is_superuser') = 'on'",
	);
	if (ownsPublicSchema === "t" || isSuperuser === "t") {
		psql(preferredUri, "DROP SCHEMA IF EXISTS public CASCADE");
		psql(preferredUri, "CREATE SCHEMA public");
		psql(preferredUri, "GRANT ALL ON SCHEMA public TO PUBLIC");
	} else {
		// PostgreSQL 15+ databases can retain a public schema owned by the bootstrap
		// administrator. The isolated test role still owns every Payload object, so
		// remove only that role's disposable objects without requiring superuser.
		psql(preferredUri, "DROP OWNED BY CURRENT_USER CASCADE");
	}
	return { uri: preferredUri, fromZero: true };
}

export function runPayloadMigrations(env) {
	execFileSync("pnpm", ["exec", "payload", "migrate"], {
		stdio: "pipe",
		env: {
			...env,
			NODE_OPTIONS: [env.NODE_OPTIONS, "--conditions=react-server"]
				.filter(Boolean)
				.join(" "),
		},
		encoding: "utf8",
		shell: process.platform === "win32",
	});
}

export function provePropertyNumericMigration(testUri) {
	const createPreviousTable = `
		CREATE TABLE properties (
			id serial PRIMARY KEY,
			price_minor numeric,
			price_per_meter_minor numeric,
			total_area numeric,
			living_area numeric,
			kitchen_area numeric
		);
	`;

	psql(testUri, createPreviousTable);
	psql(
		testUri,
		"INSERT INTO properties (price_minor, total_area) VALUES (10.5, 42.25)",
	);
	expectPsqlFailure(
		testUri,
		propertyNumericInvariantsUpSql,
		/properties_price_minor_invariant/i,
	);
	const constraintsAfterFailure = psql(
		testUri,
		"SELECT count(*) FROM pg_constraint WHERE conrelid = 'properties'::regclass AND conname LIKE 'properties_%_invariant'",
	);
	if (constraintsAfterFailure !== "0") {
		throw new Error(
			"Failed numeric migration must not leave partial constraints.",
		);
	}

	psql(testUri, "DROP TABLE properties");
	psql(testUri, createPreviousTable);
	psql(
		testUri,
		"INSERT INTO properties (price_minor, price_per_meter_minor, total_area, living_area, kitchen_area) VALUES (123400, 10000, 12.34, 10.25, 2.09)",
	);
	psql(testUri, propertyNumericInvariantsUpSql);
	const preserved = psql(
		testUri,
		"SELECT price_minor || '|' || price_per_meter_minor || '|' || total_area || '|' || living_area || '|' || kitchen_area FROM properties",
	);
	if (preserved !== "123400|10000|12.34|10.25|2.09") {
		throw new Error(
			`Numeric migration changed valid previous data: ${preserved}`,
		);
	}
	expectPsqlFailure(
		testUri,
		"UPDATE properties SET price_minor = 1.5",
		/properties_price_minor_invariant/i,
	);
	expectPsqlFailure(
		testUri,
		"UPDATE properties SET total_area = 1.234",
		/properties_total_area_invariant/i,
	);
}

export function proveLeadDeliveryRelationalMigration(testUri) {
	psql(
		testUri,
		`
		CREATE TABLE leads (id serial PRIMARY KEY);
		CREATE TABLE lead_deliveries (
			id serial PRIMARY KEY,
			lead_id integer,
			CONSTRAINT lead_deliveries_lead_id_leads_id_fk
				FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
		);
		INSERT INTO leads DEFAULT VALUES;
		INSERT INTO lead_deliveries (lead_id) VALUES (1);
		INSERT INTO lead_deliveries (lead_id) VALUES (NULL);
	`,
	);
	expectPsqlFailure(
		testUri,
		leadDeliveryRelationalContractUpSql,
		/relational retention migration stopped/i,
	);
	const relationAfterFailure = psql(
		testUri,
		"SELECT confdeltype FROM pg_constraint WHERE conname = 'lead_deliveries_lead_id_leads_id_fk'",
	);
	if (relationAfterFailure !== "n") {
		throw new Error("Rejected relational migration changed the previous FK.");
	}

	psql(testUri, "DELETE FROM lead_deliveries WHERE lead_id IS NULL");
	psql(testUri, leadDeliveryRelationalContractUpSql);
	const contract = psql(
		testUri,
		`SELECT constraint_row.confdeltype::text || '|' || column_row.attnotnull::text
		 FROM pg_constraint constraint_row
		 JOIN pg_attribute column_row
		 ON column_row.attrelid = constraint_row.conrelid
		 AND column_row.attnum = ANY (constraint_row.conkey)
		 WHERE constraint_row.conname = 'lead_deliveries_lead_id_leads_id_fk'
		 AND column_row.attname = 'lead_id'`,
	);
	if (contract !== "c|true") {
		throw new Error(
			`Relational migration did not install cascade/not-null: ${contract}`,
		);
	}
	psql(testUri, "DELETE FROM leads WHERE id = 1");
	if (psql(testUri, "SELECT count(*) FROM lead_deliveries") !== "0") {
		throw new Error(
			"Lead delete did not cascade on the previous non-empty fixture.",
		);
	}
}

export function proveGeoRelationBackfillMigration(testUri) {
	psql(
		testUri,
		`
		CREATE TABLE cities (
			id serial PRIMARY KEY,
			name varchar NOT NULL,
			slug varchar NOT NULL UNIQUE
		);
		CREATE TABLE districts (
			id serial PRIMARY KEY,
			name varchar NOT NULL,
			slug varchar NOT NULL,
			city_id integer NOT NULL REFERENCES cities(id)
		);
		CREATE TABLE properties (
			id serial PRIMARY KEY,
			status varchar NOT NULL,
			published_at timestamp(3) with time zone,
			content_purged_at timestamp(3) with time zone,
			city_raw varchar,
			district_raw varchar,
			city_id integer REFERENCES cities(id),
			district_id integer REFERENCES districts(id),
			needs_review boolean DEFAULT false,
			updated_at timestamp(3) with time zone NOT NULL
		);
		INSERT INTO cities (id, name, slug) VALUES
			(1, 'Донецк', 'donetsk'),
			(2, 'Макеевка', 'makeyevka');
		INSERT INTO districts (id, name, slug, city_id) VALUES
			(10, 'Будённовский', 'budennovskiy', 1),
			(11, 'Текстильщик', 'tekstilshchik', 1),
			(12, 'Калининский', 'kalininskiy', 1),
			(13, 'Ленинский', 'leninskiy', 1),
			(14, 'Пролетарский', 'proletarskiy', 1),
			(15, 'Ворошиловский', 'voroshilovskiy', 1),
			(20, 'Будённовский', 'budennovskiy', 2);
		INSERT INTO properties (
			id, status, published_at, city_raw, district_raw,
			city_id, district_id, needs_review, updated_at
		) VALUES
			(100, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(101, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'неизвестный район', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(102, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'мкр. Текстильщик, Донецк', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(103, 'active', '2026-09-01T00:00:00Z', 'Неизвестный город', 'Будённовский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(104, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', 2, 20, false, '2026-09-01T00:00:00Z'),
			(105, 'archived', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(106, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', NULL, NULL, NULL, '2026-09-01T00:00:00Z'),
			(200, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', NULL, NULL, true, '2026-09-01T00:00:00Z'),
			(201, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(202, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(203, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Будённовский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(204, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Калининский', NULL, NULL, true, '2026-09-01T00:00:00Z'),
			(205, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Калининский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(206, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Калининский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(207, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Ленинский', NULL, NULL, true, '2026-09-01T00:00:00Z'),
			(208, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Ленинский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(209, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Пролетарский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(210, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Пролетарский', NULL, NULL, false, '2026-09-01T00:00:00Z'),
			(211, 'active', '2026-09-01T00:00:00Z', 'Донецк', 'Ворошиловский', NULL, NULL, true, '2026-09-01T00:00:00Z');
	`,
	);

	const before = psql(
		testUri,
		"SELECT string_agg(id || ':' || coalesce(city_id::text, '-') || ':' || coalesce(district_id::text, '-') || ':' || needs_review::text || ':' || updated_at::text, ',' ORDER BY id) FROM properties",
	);
	psql(testUri, geoRelationBackfillUpSql);
	const first = psql(
		testUri,
		"SELECT string_agg(id || ':' || coalesce(city_id::text, '-') || ':' || coalesce(district_id::text, '-') || ':' || needs_review::text, ',' ORDER BY id) FROM properties WHERE id < 200",
	);
	if (
		first !==
		"100:1:10:false,101:1:-:true,102:1:11:false,103:-:-:true,104:2:20:false,105:-:-:false,106:1:10:false"
	) {
		throw new Error(
			`Geo relation backfill produced an unsafe mapping: ${first}`,
		);
	}
	if (
		psql(
			testUri,
			'SELECT count(*) FROM "_dc11_geo_relation_backfill_audit"',
		) !== "17"
	) {
		throw new Error(
			"Geo relation backfill did not capture the exact changed set.",
		);
	}
	const productionShape = psql(
		testUri,
		`SELECT
			count(*) || '|' ||
			count(*) FILTER (WHERE city_id = 1) || '|' ||
			count(*) FILTER (WHERE district_id IS NOT NULL) || '|' ||
			count(*) FILTER (WHERE needs_review)
		 FROM properties
		 WHERE id BETWEEN 200 AND 211`,
	);
	if (productionShape !== "12|12|12|4") {
		throw new Error(
			`Production-shaped geo fixture did not reconcile: ${productionShape}`,
		);
	}

	const firstUpdatedAt = psql(
		testUri,
		"SELECT string_agg(id || ':' || updated_at::text, ',' ORDER BY id) FROM properties",
	);
	psql(testUri, geoRelationBackfillUpSql);
	const secondUpdatedAt = psql(
		testUri,
		"SELECT string_agg(id || ':' || updated_at::text, ',' ORDER BY id) FROM properties",
	);
	if (secondUpdatedAt !== firstUpdatedAt) {
		throw new Error("Second geo relation backfill run was not idempotent.");
	}

	psql(testUri, geoRelationBackfillDownSql);
	const afterRollback = psql(
		testUri,
		"SELECT string_agg(id || ':' || coalesce(city_id::text, '-') || ':' || coalesce(district_id::text, '-') || ':' || needs_review::text || ':' || updated_at::text, ',' ORDER BY id) FROM properties",
	);
	if (afterRollback !== before) {
		throw new Error(
			"Geo relation backfill rollback did not restore the fixture.",
		);
	}
	if (
		psql(
			testUri,
			"SELECT to_regclass('_dc11_geo_relation_backfill_audit') IS NULL",
		) !== "t"
	) {
		throw new Error(
			"Geo relation backfill rollback left its audit table behind.",
		);
	}
}

export function provePayloadAuthSecurityMigration(testUri) {
	psql(
		testUri,
		`
		CREATE TABLE users (
			id serial PRIMARY KEY,
			reset_password_token varchar,
			reset_password_expiration timestamp(3) with time zone
		);
		CREATE TABLE media (id serial PRIMARY KEY);
		CREATE TABLE properties_images (
			id serial PRIMARY KEY,
			media_id integer,
			CONSTRAINT properties_images_media_id_media_id_fk
				FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE set null
		);
	`,
	);
	psql(testUri, payloadAuthSecurityUpSql);
	if (
		psql(
			testUri,
			"SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='reset_password_requested_at'",
		) !== "1"
	) {
		throw new Error(
			"Payload auth migration did not add reset request timestamp.",
		);
	}
	psql(testUri, payloadAuthSecurityDownSql);
	if (
		psql(
			testUri,
			"SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='reset_password_requested_at'",
		) !== "0"
	) {
		throw new Error(
			"Payload auth migration down did not remove the new field.",
		);
	}
	psql(testUri, payloadAuthSecurityUpSql);
}

export function psqlOnTest(testUri, sql) {
	return psql(testUri, sql);
}
