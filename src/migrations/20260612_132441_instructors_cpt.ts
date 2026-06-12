import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`instructors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`bio\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`instructors_updated_at_idx\` ON \`instructors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`instructors_created_at_idx\` ON \`instructors\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`courses_rels\` ADD \`instructors_id\` integer REFERENCES instructors(id);`)
  await db.run(sql`CREATE INDEX \`courses_rels_instructors_id_idx\` ON \`courses_rels\` (\`instructors_id\`);`)
  await db.run(sql`ALTER TABLE \`_courses_v_rels\` ADD \`instructors_id\` integer REFERENCES instructors(id);`)
  await db.run(sql`CREATE INDEX \`_courses_v_rels_instructors_id_idx\` ON \`_courses_v_rels\` (\`instructors_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`instructors_id\` integer REFERENCES instructors(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_instructors_id_idx\` ON \`payload_locked_documents_rels\` (\`instructors_id\`);`)
  await db.run(sql`ALTER TABLE \`courses\` DROP COLUMN \`instructor_initials\`;`)
  await db.run(sql`ALTER TABLE \`courses\` DROP COLUMN \`instructor_name\`;`)
  await db.run(sql`ALTER TABLE \`courses\` DROP COLUMN \`instructor_role\`;`)
  await db.run(sql`ALTER TABLE \`courses\` DROP COLUMN \`instructor_bio\`;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` DROP COLUMN \`version_instructor_initials\`;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` DROP COLUMN \`version_instructor_name\`;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` DROP COLUMN \`version_instructor_role\`;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` DROP COLUMN \`version_instructor_bio\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`instructors\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_courses_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_courses_rels\`("id", "order", "parent_id", "path", "categories_id") SELECT "id", "order", "parent_id", "path", "categories_id" FROM \`courses_rels\`;`)
  await db.run(sql`DROP TABLE \`courses_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_courses_rels\` RENAME TO \`courses_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`courses_rels_order_idx\` ON \`courses_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`courses_rels_parent_idx\` ON \`courses_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`courses_rels_path_idx\` ON \`courses_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`courses_rels_categories_id_idx\` ON \`courses_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__courses_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_courses_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__courses_v_rels\`("id", "order", "parent_id", "path", "categories_id") SELECT "id", "order", "parent_id", "path", "categories_id" FROM \`_courses_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_courses_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__courses_v_rels\` RENAME TO \`_courses_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_courses_v_rels_order_idx\` ON \`_courses_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_rels_parent_idx\` ON \`_courses_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_rels_path_idx\` ON \`_courses_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_rels_categories_id_idx\` ON \`_courses_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`courses_id\` integer,
  	\`articles_id\` integer,
  	\`categories_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`courses_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "courses_id", "articles_id", "categories_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "pages_id", "courses_id", "articles_id", "categories_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_courses_id_idx\` ON \`payload_locked_documents_rels\` (\`courses_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`courses\` ADD \`instructor_initials\` text;`)
  await db.run(sql`ALTER TABLE \`courses\` ADD \`instructor_name\` text;`)
  await db.run(sql`ALTER TABLE \`courses\` ADD \`instructor_role\` text;`)
  await db.run(sql`ALTER TABLE \`courses\` ADD \`instructor_bio\` text;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` ADD \`version_instructor_initials\` text;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` ADD \`version_instructor_name\` text;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` ADD \`version_instructor_role\` text;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` ADD \`version_instructor_bio\` text;`)
}
