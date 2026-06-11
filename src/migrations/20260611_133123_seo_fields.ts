import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`courses\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`courses\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`courses\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`courses_meta_meta_image_idx\` ON \`courses\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_courses_v\` ADD \`version_meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` ADD \`version_meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`_courses_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_courses_v_version_meta_version_meta_image_idx\` ON \`_courses_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`articles_meta_meta_image_idx\` ON \`articles\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_articles_v\` ADD \`version_meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` ADD \`version_meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` ADD \`version_meta_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_meta_version_meta_image_idx\` ON \`_articles_v\` (\`version_meta_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages\`("id", "title", "slug", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "updated_at", "created_at", "_status" FROM \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v\`("id", "parent_id", "version_title", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v\` RENAME TO \`_pages_v\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_courses\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`price_old\` text,
  	\`price_now\` text,
  	\`cover_id\` integer,
  	\`cover_color_from\` text DEFAULT '#314a2a',
  	\`cover_color_to\` text DEFAULT '#1a2f1d',
  	\`lede\` text,
  	\`featured_image_id\` integer,
  	\`featured_caption\` text,
  	\`body\` text,
  	\`bonus_title\` text,
  	\`bonus_text\` text,
  	\`quote_text\` text,
  	\`quote_cite\` text,
  	\`instructor_initials\` text,
  	\`instructor_name\` text,
  	\`instructor_role\` text,
  	\`instructor_bio\` text,
  	\`price_installment\` text,
  	\`cta_label\` text DEFAULT 'Fazer matrícula',
  	\`cta_url\` text,
  	\`slug\` text,
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_courses\`("id", "title", "description", "price_old", "price_now", "cover_id", "cover_color_from", "cover_color_to", "lede", "featured_image_id", "featured_caption", "body", "bonus_title", "bonus_text", "quote_text", "quote_cite", "instructor_initials", "instructor_name", "instructor_role", "instructor_bio", "price_installment", "cta_label", "cta_url", "slug", "featured", "updated_at", "created_at", "_status") SELECT "id", "title", "description", "price_old", "price_now", "cover_id", "cover_color_from", "cover_color_to", "lede", "featured_image_id", "featured_caption", "body", "bonus_title", "bonus_text", "quote_text", "quote_cite", "instructor_initials", "instructor_name", "instructor_role", "instructor_bio", "price_installment", "cta_label", "cta_url", "slug", "featured", "updated_at", "created_at", "_status" FROM \`courses\`;`)
  await db.run(sql`DROP TABLE \`courses\`;`)
  await db.run(sql`ALTER TABLE \`__new_courses\` RENAME TO \`courses\`;`)
  await db.run(sql`CREATE INDEX \`courses_cover_idx\` ON \`courses\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`courses_featured_image_idx\` ON \`courses\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`courses_slug_idx\` ON \`courses\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`courses_updated_at_idx\` ON \`courses\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`courses_created_at_idx\` ON \`courses\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`courses__status_idx\` ON \`courses\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__courses_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_description\` text,
  	\`version_price_old\` text,
  	\`version_price_now\` text,
  	\`version_cover_id\` integer,
  	\`version_cover_color_from\` text DEFAULT '#314a2a',
  	\`version_cover_color_to\` text DEFAULT '#1a2f1d',
  	\`version_lede\` text,
  	\`version_featured_image_id\` integer,
  	\`version_featured_caption\` text,
  	\`version_body\` text,
  	\`version_bonus_title\` text,
  	\`version_bonus_text\` text,
  	\`version_quote_text\` text,
  	\`version_quote_cite\` text,
  	\`version_instructor_initials\` text,
  	\`version_instructor_name\` text,
  	\`version_instructor_role\` text,
  	\`version_instructor_bio\` text,
  	\`version_price_installment\` text,
  	\`version_cta_label\` text DEFAULT 'Fazer matrícula',
  	\`version_cta_url\` text,
  	\`version_slug\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__courses_v\`("id", "parent_id", "version_title", "version_description", "version_price_old", "version_price_now", "version_cover_id", "version_cover_color_from", "version_cover_color_to", "version_lede", "version_featured_image_id", "version_featured_caption", "version_body", "version_bonus_title", "version_bonus_text", "version_quote_text", "version_quote_cite", "version_instructor_initials", "version_instructor_name", "version_instructor_role", "version_instructor_bio", "version_price_installment", "version_cta_label", "version_cta_url", "version_slug", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_description", "version_price_old", "version_price_now", "version_cover_id", "version_cover_color_from", "version_cover_color_to", "version_lede", "version_featured_image_id", "version_featured_caption", "version_body", "version_bonus_title", "version_bonus_text", "version_quote_text", "version_quote_cite", "version_instructor_initials", "version_instructor_name", "version_instructor_role", "version_instructor_bio", "version_price_installment", "version_cta_label", "version_cta_url", "version_slug", "version_featured", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_courses_v\`;`)
  await db.run(sql`DROP TABLE \`_courses_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__courses_v\` RENAME TO \`_courses_v\`;`)
  await db.run(sql`CREATE INDEX \`_courses_v_parent_idx\` ON \`_courses_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_version_version_cover_idx\` ON \`_courses_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_version_version_featured_image_idx\` ON \`_courses_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_version_version_slug_idx\` ON \`_courses_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_version_version_updated_at_idx\` ON \`_courses_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_version_version_created_at_idx\` ON \`_courses_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_version_version__status_idx\` ON \`_courses_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_created_at_idx\` ON \`_courses_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_updated_at_idx\` ON \`_courses_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_courses_v_latest_idx\` ON \`_courses_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`excerpt\` text,
  	\`cover_id\` integer,
  	\`category_id\` integer,
  	\`slug\` text,
  	\`published_at\` text,
  	\`reading_time\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_articles\`("id", "title", "excerpt", "cover_id", "category_id", "slug", "published_at", "reading_time", "updated_at", "created_at", "_status") SELECT "id", "title", "excerpt", "cover_id", "category_id", "slug", "published_at", "reading_time", "updated_at", "created_at", "_status" FROM \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`ALTER TABLE \`__new_articles\` RENAME TO \`articles\`;`)
  await db.run(sql`CREATE INDEX \`articles_cover_idx\` ON \`articles\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_category_idx\` ON \`articles\` (\`category_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_cover_id\` integer,
  	\`version_category_id\` integer,
  	\`version_slug\` text,
  	\`version_published_at\` text,
  	\`version_reading_time\` numeric,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__articles_v\`("id", "parent_id", "version_title", "version_excerpt", "version_cover_id", "version_category_id", "version_slug", "version_published_at", "version_reading_time", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_excerpt", "version_cover_id", "version_category_id", "version_slug", "version_published_at", "version_reading_time", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__articles_v\` RENAME TO \`_articles_v\`;`)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_cover_idx\` ON \`_articles_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_category_idx\` ON \`_articles_v\` (\`version_category_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
}
