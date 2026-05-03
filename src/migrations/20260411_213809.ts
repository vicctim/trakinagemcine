import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_edicoes_status" AS ENUM('ativa', 'arquivada');
  CREATE TYPE "public"."enum_premios_resultado" AS ENUM('premiado', 'selecionado');
  CREATE TYPE "public"."enum_apoiadores_categoria" AS ENUM('lei_incentivo', 'patrocinador', 'apoiador', 'parceiro');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "posts_press_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"cover_image_id" integer NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "edicoes_fotos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"foto_id" integer NOT NULL
  );
  
  CREATE TABLE "edicoes_video_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "edicoes_parceiros_institucionais" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL
  );
  
  CREATE TABLE "edicoes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"ano" numeric NOT NULL,
  	"status" "enum_edicoes_status" DEFAULT 'ativa' NOT NULL,
  	"resumo" jsonb NOT NULL,
  	"imagem_capa_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "edicoes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"apoiadores_id" integer
  );
  
  CREATE TABLE "filmes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"sinopse" varchar NOT NULL,
  	"capa_id" integer NOT NULL,
  	"youtube_url" varchar NOT NULL,
  	"edicao_id" integer NOT NULL,
  	"ano" numeric NOT NULL,
  	"duracao" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "filmes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"premios_id" integer
  );
  
  CREATE TABLE "premios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome_do_festival" varchar NOT NULL,
  	"categoria" varchar NOT NULL,
  	"resultado" "enum_premios_resultado" NOT NULL,
  	"ano_do_evento" numeric NOT NULL,
  	"filme_id" integer,
  	"logo_do_festival_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "apoiadores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"categoria" "enum_apoiadores_categoria" NOT NULL,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "apoiadores_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"edicoes_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"posts_id" integer,
  	"edicoes_id" integer,
  	"filmes_id" integer,
  	"premios_id" integer,
  	"apoiadores_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Trakinagem Cine',
  	"site_description" varchar DEFAULT 'Projeto cultural e educativo que ensina produção audiovisual a jovens em situação de vulnerabilidade social.',
  	"hero_image_id" integer,
  	"hero_title" varchar DEFAULT 'Cinema transforma vidas',
  	"hero_subtitle" varchar,
  	"social_links_instagram" varchar,
  	"social_links_youtube" varchar,
  	"social_links_facebook" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_press_images" ADD CONSTRAINT "posts_press_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_press_images" ADD CONSTRAINT "posts_press_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edicoes_fotos" ADD CONSTRAINT "edicoes_fotos_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edicoes_fotos" ADD CONSTRAINT "edicoes_fotos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."edicoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "edicoes_video_links" ADD CONSTRAINT "edicoes_video_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."edicoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "edicoes_parceiros_institucionais" ADD CONSTRAINT "edicoes_parceiros_institucionais_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."edicoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "edicoes" ADD CONSTRAINT "edicoes_imagem_capa_id_media_id_fk" FOREIGN KEY ("imagem_capa_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "edicoes_rels" ADD CONSTRAINT "edicoes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."edicoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "edicoes_rels" ADD CONSTRAINT "edicoes_rels_apoiadores_fk" FOREIGN KEY ("apoiadores_id") REFERENCES "public"."apoiadores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "filmes" ADD CONSTRAINT "filmes_capa_id_media_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "filmes" ADD CONSTRAINT "filmes_edicao_id_edicoes_id_fk" FOREIGN KEY ("edicao_id") REFERENCES "public"."edicoes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "filmes_rels" ADD CONSTRAINT "filmes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."filmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "filmes_rels" ADD CONSTRAINT "filmes_rels_premios_fk" FOREIGN KEY ("premios_id") REFERENCES "public"."premios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "premios" ADD CONSTRAINT "premios_filme_id_filmes_id_fk" FOREIGN KEY ("filme_id") REFERENCES "public"."filmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "premios" ADD CONSTRAINT "premios_logo_do_festival_id_media_id_fk" FOREIGN KEY ("logo_do_festival_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "apoiadores" ADD CONSTRAINT "apoiadores_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "apoiadores_rels" ADD CONSTRAINT "apoiadores_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."apoiadores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "apoiadores_rels" ADD CONSTRAINT "apoiadores_rels_edicoes_fk" FOREIGN KEY ("edicoes_id") REFERENCES "public"."edicoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_edicoes_fk" FOREIGN KEY ("edicoes_id") REFERENCES "public"."edicoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_filmes_fk" FOREIGN KEY ("filmes_id") REFERENCES "public"."filmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_premios_fk" FOREIGN KEY ("premios_id") REFERENCES "public"."premios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_apoiadores_fk" FOREIGN KEY ("apoiadores_id") REFERENCES "public"."apoiadores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "posts_press_images_order_idx" ON "posts_press_images" USING btree ("_order");
  CREATE INDEX "posts_press_images_parent_id_idx" ON "posts_press_images" USING btree ("_parent_id");
  CREATE INDEX "posts_press_images_image_idx" ON "posts_press_images" USING btree ("image_id");
  CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
  CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "edicoes_fotos_order_idx" ON "edicoes_fotos" USING btree ("_order");
  CREATE INDEX "edicoes_fotos_parent_id_idx" ON "edicoes_fotos" USING btree ("_parent_id");
  CREATE INDEX "edicoes_fotos_foto_idx" ON "edicoes_fotos" USING btree ("foto_id");
  CREATE INDEX "edicoes_video_links_order_idx" ON "edicoes_video_links" USING btree ("_order");
  CREATE INDEX "edicoes_video_links_parent_id_idx" ON "edicoes_video_links" USING btree ("_parent_id");
  CREATE INDEX "edicoes_parceiros_institucionais_order_idx" ON "edicoes_parceiros_institucionais" USING btree ("_order");
  CREATE INDEX "edicoes_parceiros_institucionais_parent_id_idx" ON "edicoes_parceiros_institucionais" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "edicoes_slug_idx" ON "edicoes" USING btree ("slug");
  CREATE INDEX "edicoes_imagem_capa_idx" ON "edicoes" USING btree ("imagem_capa_id");
  CREATE INDEX "edicoes_updated_at_idx" ON "edicoes" USING btree ("updated_at");
  CREATE INDEX "edicoes_created_at_idx" ON "edicoes" USING btree ("created_at");
  CREATE INDEX "edicoes_rels_order_idx" ON "edicoes_rels" USING btree ("order");
  CREATE INDEX "edicoes_rels_parent_idx" ON "edicoes_rels" USING btree ("parent_id");
  CREATE INDEX "edicoes_rels_path_idx" ON "edicoes_rels" USING btree ("path");
  CREATE INDEX "edicoes_rels_apoiadores_id_idx" ON "edicoes_rels" USING btree ("apoiadores_id");
  CREATE UNIQUE INDEX "filmes_slug_idx" ON "filmes" USING btree ("slug");
  CREATE INDEX "filmes_capa_idx" ON "filmes" USING btree ("capa_id");
  CREATE INDEX "filmes_edicao_idx" ON "filmes" USING btree ("edicao_id");
  CREATE INDEX "filmes_updated_at_idx" ON "filmes" USING btree ("updated_at");
  CREATE INDEX "filmes_created_at_idx" ON "filmes" USING btree ("created_at");
  CREATE INDEX "filmes_rels_order_idx" ON "filmes_rels" USING btree ("order");
  CREATE INDEX "filmes_rels_parent_idx" ON "filmes_rels" USING btree ("parent_id");
  CREATE INDEX "filmes_rels_path_idx" ON "filmes_rels" USING btree ("path");
  CREATE INDEX "filmes_rels_premios_id_idx" ON "filmes_rels" USING btree ("premios_id");
  CREATE INDEX "premios_filme_idx" ON "premios" USING btree ("filme_id");
  CREATE INDEX "premios_logo_do_festival_idx" ON "premios" USING btree ("logo_do_festival_id");
  CREATE INDEX "premios_updated_at_idx" ON "premios" USING btree ("updated_at");
  CREATE INDEX "premios_created_at_idx" ON "premios" USING btree ("created_at");
  CREATE INDEX "apoiadores_logo_idx" ON "apoiadores" USING btree ("logo_id");
  CREATE INDEX "apoiadores_updated_at_idx" ON "apoiadores" USING btree ("updated_at");
  CREATE INDEX "apoiadores_created_at_idx" ON "apoiadores" USING btree ("created_at");
  CREATE INDEX "apoiadores_rels_order_idx" ON "apoiadores_rels" USING btree ("order");
  CREATE INDEX "apoiadores_rels_parent_idx" ON "apoiadores_rels" USING btree ("parent_id");
  CREATE INDEX "apoiadores_rels_path_idx" ON "apoiadores_rels" USING btree ("path");
  CREATE INDEX "apoiadores_rels_edicoes_id_idx" ON "apoiadores_rels" USING btree ("edicoes_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_edicoes_id_idx" ON "payload_locked_documents_rels" USING btree ("edicoes_id");
  CREATE INDEX "payload_locked_documents_rels_filmes_id_idx" ON "payload_locked_documents_rels" USING btree ("filmes_id");
  CREATE INDEX "payload_locked_documents_rels_premios_id_idx" ON "payload_locked_documents_rels" USING btree ("premios_id");
  CREATE INDEX "payload_locked_documents_rels_apoiadores_id_idx" ON "payload_locked_documents_rels" USING btree ("apoiadores_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_config_hero_image_idx" ON "site_config" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "posts_press_images" CASCADE;
  DROP TABLE "posts_tags" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "edicoes_fotos" CASCADE;
  DROP TABLE "edicoes_video_links" CASCADE;
  DROP TABLE "edicoes_parceiros_institucionais" CASCADE;
  DROP TABLE "edicoes" CASCADE;
  DROP TABLE "edicoes_rels" CASCADE;
  DROP TABLE "filmes" CASCADE;
  DROP TABLE "filmes_rels" CASCADE;
  DROP TABLE "premios" CASCADE;
  DROP TABLE "apoiadores" CASCADE;
  DROP TABLE "apoiadores_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_config" CASCADE;
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum_edicoes_status";
  DROP TYPE "public"."enum_premios_resultado";
  DROP TYPE "public"."enum_apoiadores_categoria";`)
}
