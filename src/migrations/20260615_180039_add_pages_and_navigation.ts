import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_edicoes_logos_rodape_tipo_exibicao" AS ENUM('imagem_unica', 'individual');
  CREATE TYPE "public"."enum_pages_blocks_hero_section_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_cards_grid_variant" AS ENUM('default', 'film', 'edition');
  CREATE TYPE "public"."enum_pages_blocks_logos_tipo_exibicao" AS ENUM('imagem_unica', 'individual');
  CREATE TYPE "public"."enum_pages_blocks_call_to_action_variant" AS ENUM('primary', 'secondary', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_call_to_action_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_navigation_menu_principal_submenu_tipo_link" AS ENUM('pagina', 'rota', 'externo');
  CREATE TYPE "public"."enum_navigation_menu_principal_tipo_link" AS ENUM('pagina', 'rota', 'externo');
  CREATE TYPE "public"."enum_navigation_menu_secundario_submenu_tipo_link" AS ENUM('pagina', 'rota', 'externo');
  CREATE TYPE "public"."enum_navigation_menu_secundario_tipo_link" AS ENUM('pagina', 'rota', 'externo');
  CREATE TABLE "edicoes_logos_rodape_logos_individuais" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"nome" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar NOT NULL,
  	"accent" varchar,
  	"subtitle" varchar,
  	"align" "enum_pages_blocks_hero_section_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"tag" varchar,
  	"date" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"variant" "enum_pages_blocks_cards_grid_variant" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_counters_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"end" numeric NOT NULL,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_counters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logos_logos_individuais" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"nome" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tipo_exibicao" "enum_pages_blocks_logos_tipo_exibicao" DEFAULT 'imagem_unica',
  	"imagem_unica_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"variant" "enum_pages_blocks_call_to_action_variant" DEFAULT 'primary',
  	"align" "enum_pages_blocks_call_to_action_align" DEFAULT 'left',
  	"externo" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"is_mock" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigation_menu_principal_submenu" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"tipo_link" "enum_navigation_menu_principal_submenu_tipo_link" DEFAULT 'rota',
  	"pagina_id" integer,
  	"rota" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "navigation_menu_principal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"tipo_link" "enum_navigation_menu_principal_tipo_link" DEFAULT 'rota',
  	"pagina_id" integer,
  	"rota" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "navigation_menu_secundario_submenu" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"tipo_link" "enum_navigation_menu_secundario_submenu_tipo_link" DEFAULT 'rota',
  	"pagina_id" integer,
  	"rota" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "navigation_menu_secundario" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"tipo_link" "enum_navigation_menu_secundario_tipo_link" DEFAULT 'rota',
  	"pagina_id" integer,
  	"rota" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "edicoes" ADD COLUMN "logos_rodape_tipo_exibicao" "enum_edicoes_logos_rodape_tipo_exibicao" DEFAULT 'imagem_unica';
  ALTER TABLE "edicoes" ADD COLUMN "logos_rodape_imagem_unica_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "edicoes_logos_rodape_logos_individuais" ADD CONSTRAINT "edicoes_logos_rodape_logos_individuais_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edicoes_logos_rodape_logos_individuais" ADD CONSTRAINT "edicoes_logos_rodape_logos_individuais_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."edicoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_section" ADD CONSTRAINT "pages_blocks_hero_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_grid_items" ADD CONSTRAINT "pages_blocks_cards_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_grid_items" ADD CONSTRAINT "pages_blocks_cards_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_grid" ADD CONSTRAINT "pages_blocks_cards_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_counters_items" ADD CONSTRAINT "pages_blocks_counters_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_counters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_counters" ADD CONSTRAINT "pages_blocks_counters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_logos_individuais" ADD CONSTRAINT "pages_blocks_logos_logos_individuais_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos_logos_individuais" ADD CONSTRAINT "pages_blocks_logos_logos_individuais_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos" ADD CONSTRAINT "pages_blocks_logos_imagem_unica_id_media_id_fk" FOREIGN KEY ("imagem_unica_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logos" ADD CONSTRAINT "pages_blocks_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_menu_principal_submenu" ADD CONSTRAINT "navigation_menu_principal_submenu_pagina_id_pages_id_fk" FOREIGN KEY ("pagina_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_menu_principal_submenu" ADD CONSTRAINT "navigation_menu_principal_submenu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_menu_principal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_principal" ADD CONSTRAINT "navigation_menu_principal_pagina_id_pages_id_fk" FOREIGN KEY ("pagina_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_menu_principal" ADD CONSTRAINT "navigation_menu_principal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_secundario_submenu" ADD CONSTRAINT "navigation_menu_secundario_submenu_pagina_id_pages_id_fk" FOREIGN KEY ("pagina_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_menu_secundario_submenu" ADD CONSTRAINT "navigation_menu_secundario_submenu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_menu_secundario"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_secundario" ADD CONSTRAINT "navigation_menu_secundario_pagina_id_pages_id_fk" FOREIGN KEY ("pagina_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_menu_secundario" ADD CONSTRAINT "navigation_menu_secundario_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "edicoes_logos_rodape_logos_individuais_order_idx" ON "edicoes_logos_rodape_logos_individuais" USING btree ("_order");
  CREATE INDEX "edicoes_logos_rodape_logos_individuais_parent_id_idx" ON "edicoes_logos_rodape_logos_individuais" USING btree ("_parent_id");
  CREATE INDEX "edicoes_logos_rodape_logos_individuais_logo_idx" ON "edicoes_logos_rodape_logos_individuais" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_hero_section_order_idx" ON "pages_blocks_hero_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_section_parent_id_idx" ON "pages_blocks_hero_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_section_path_idx" ON "pages_blocks_hero_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_cards_grid_items_order_idx" ON "pages_blocks_cards_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_grid_items_parent_id_idx" ON "pages_blocks_cards_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_grid_items_image_idx" ON "pages_blocks_cards_grid_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cards_grid_order_idx" ON "pages_blocks_cards_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_grid_parent_id_idx" ON "pages_blocks_cards_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_grid_path_idx" ON "pages_blocks_cards_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_counters_items_order_idx" ON "pages_blocks_counters_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_counters_items_parent_id_idx" ON "pages_blocks_counters_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_counters_order_idx" ON "pages_blocks_counters" USING btree ("_order");
  CREATE INDEX "pages_blocks_counters_parent_id_idx" ON "pages_blocks_counters" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_counters_path_idx" ON "pages_blocks_counters" USING btree ("_path");
  CREATE INDEX "pages_blocks_logos_logos_individuais_order_idx" ON "pages_blocks_logos_logos_individuais" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_logos_individuais_parent_id_idx" ON "pages_blocks_logos_logos_individuais" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_logos_individuais_logo_idx" ON "pages_blocks_logos_logos_individuais" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logos_order_idx" ON "pages_blocks_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logos_parent_id_idx" ON "pages_blocks_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logos_path_idx" ON "pages_blocks_logos" USING btree ("_path");
  CREATE INDEX "pages_blocks_logos_imagem_unica_idx" ON "pages_blocks_logos" USING btree ("imagem_unica_id");
  CREATE INDEX "pages_blocks_call_to_action_order_idx" ON "pages_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_parent_id_idx" ON "pages_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_path_idx" ON "pages_blocks_call_to_action" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "navigation_menu_principal_submenu_order_idx" ON "navigation_menu_principal_submenu" USING btree ("_order");
  CREATE INDEX "navigation_menu_principal_submenu_parent_id_idx" ON "navigation_menu_principal_submenu" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_principal_submenu_pagina_idx" ON "navigation_menu_principal_submenu" USING btree ("pagina_id");
  CREATE INDEX "navigation_menu_principal_order_idx" ON "navigation_menu_principal" USING btree ("_order");
  CREATE INDEX "navigation_menu_principal_parent_id_idx" ON "navigation_menu_principal" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_principal_pagina_idx" ON "navigation_menu_principal" USING btree ("pagina_id");
  CREATE INDEX "navigation_menu_secundario_submenu_order_idx" ON "navigation_menu_secundario_submenu" USING btree ("_order");
  CREATE INDEX "navigation_menu_secundario_submenu_parent_id_idx" ON "navigation_menu_secundario_submenu" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_secundario_submenu_pagina_idx" ON "navigation_menu_secundario_submenu" USING btree ("pagina_id");
  CREATE INDEX "navigation_menu_secundario_order_idx" ON "navigation_menu_secundario" USING btree ("_order");
  CREATE INDEX "navigation_menu_secundario_parent_id_idx" ON "navigation_menu_secundario" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_secundario_pagina_idx" ON "navigation_menu_secundario" USING btree ("pagina_id");
  ALTER TABLE "edicoes" ADD CONSTRAINT "edicoes_logos_rodape_imagem_unica_id_media_id_fk" FOREIGN KEY ("logos_rodape_imagem_unica_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "edicoes_logos_rodape_logos_rodape_imagem_unica_idx" ON "edicoes" USING btree ("logos_rodape_imagem_unica_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "edicoes_logos_rodape_logos_individuais" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cards_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cards_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_counters_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_counters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logos_logos_individuais" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_call_to_action" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_menu_principal_submenu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_menu_principal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_menu_secundario_submenu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_menu_secundario" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "edicoes_logos_rodape_logos_individuais" CASCADE;
  DROP TABLE "pages_blocks_hero_section" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_cards_grid_items" CASCADE;
  DROP TABLE "pages_blocks_cards_grid" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_counters_items" CASCADE;
  DROP TABLE "pages_blocks_counters" CASCADE;
  DROP TABLE "pages_blocks_logos_logos_individuais" CASCADE;
  DROP TABLE "pages_blocks_logos" CASCADE;
  DROP TABLE "pages_blocks_call_to_action" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "navigation_menu_principal_submenu" CASCADE;
  DROP TABLE "navigation_menu_principal" CASCADE;
  DROP TABLE "navigation_menu_secundario_submenu" CASCADE;
  DROP TABLE "navigation_menu_secundario" CASCADE;
  DROP TABLE "navigation" CASCADE;
  ALTER TABLE "edicoes" DROP CONSTRAINT "edicoes_logos_rodape_imagem_unica_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "edicoes_logos_rodape_logos_rodape_imagem_unica_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "edicoes" DROP COLUMN "logos_rodape_tipo_exibicao";
  ALTER TABLE "edicoes" DROP COLUMN "logos_rodape_imagem_unica_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."enum_edicoes_logos_rodape_tipo_exibicao";
  DROP TYPE "public"."enum_pages_blocks_hero_section_align";
  DROP TYPE "public"."enum_pages_blocks_cards_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_logos_tipo_exibicao";
  DROP TYPE "public"."enum_pages_blocks_call_to_action_variant";
  DROP TYPE "public"."enum_pages_blocks_call_to_action_align";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_navigation_menu_principal_submenu_tipo_link";
  DROP TYPE "public"."enum_navigation_menu_principal_tipo_link";
  DROP TYPE "public"."enum_navigation_menu_secundario_submenu_tipo_link";
  DROP TYPE "public"."enum_navigation_menu_secundario_tipo_link";`)
}
