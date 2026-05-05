import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_backup_config_last_backup_status" AS ENUM('success', 'error', 'running');
  CREATE TABLE "backup_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"retention_daily" numeric DEFAULT 7,
  	"retention_weekly" numeric DEFAULT 4,
  	"retention_monthly" numeric DEFAULT 6,
  	"drive_enabled" boolean DEFAULT false,
  	"drive_remote_name" varchar DEFAULT 'gdrive-trakinagem',
  	"drive_folder" varchar DEFAULT 'backups/trakinagemcine',
  	"cron_schedule" varchar DEFAULT '0 3 * * *',
  	"last_backup_at" timestamp(3) with time zone,
  	"last_backup_size" numeric,
  	"last_backup_status" "enum_backup_config_last_backup_status",
  	"last_backup_message" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "posts" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "filmes" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "filmes" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "filmes" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "filmes" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "edicoes" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "edicoes" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "edicoes" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "edicoes" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "filmes" ADD CONSTRAINT "filmes_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edicoes" ADD CONSTRAINT "edicoes_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "filmes_seo_seo_og_image_idx" ON "filmes" USING btree ("seo_og_image_id");
  CREATE INDEX "edicoes_seo_seo_og_image_idx" ON "edicoes" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "backup_config" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "backup_config" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT "posts_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "filmes" DROP CONSTRAINT "filmes_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "edicoes" DROP CONSTRAINT "edicoes_seo_og_image_id_media_id_fk";
  
  DROP INDEX "posts_seo_seo_og_image_idx";
  DROP INDEX "filmes_seo_seo_og_image_idx";
  DROP INDEX "edicoes_seo_seo_og_image_idx";
  ALTER TABLE "posts" DROP COLUMN "seo_meta_title";
  ALTER TABLE "posts" DROP COLUMN "seo_meta_description";
  ALTER TABLE "posts" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "posts" DROP COLUMN "seo_no_index";
  ALTER TABLE "filmes" DROP COLUMN "seo_meta_title";
  ALTER TABLE "filmes" DROP COLUMN "seo_meta_description";
  ALTER TABLE "filmes" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "filmes" DROP COLUMN "seo_no_index";
  ALTER TABLE "edicoes" DROP COLUMN "seo_meta_title";
  ALTER TABLE "edicoes" DROP COLUMN "seo_meta_description";
  ALTER TABLE "edicoes" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "edicoes" DROP COLUMN "seo_no_index";
  DROP TYPE "public"."enum_backup_config_last_backup_status";`)
}
