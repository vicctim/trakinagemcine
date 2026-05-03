import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_config_theme" AS ENUM('default', 'editorial');
  CREATE TYPE "public"."enum_smtp_config_provider" AS ENUM('resend', 'ses', 'sendgrid', 'smtp');
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"empresa" varchar,
  	"email" varchar NOT NULL,
  	"telefone" varchar,
  	"mensagem" varchar NOT NULL,
  	"ip_origem" varchar,
  	"cidade" varchar,
  	"estado" varchar,
  	"pais" varchar DEFAULT 'Brasil',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "smtp_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum_smtp_config_provider" DEFAULT 'resend' NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"api_key" varchar,
  	"from_email" varchar DEFAULT 'noreply@trakinagemcine.com.br',
  	"from_name" varchar DEFAULT 'Trakinagem Cine',
  	"notify_email" varchar DEFAULT 'contato@trakinagemcine.com.br',
  	"smtp_host" varchar,
  	"smtp_port" numeric DEFAULT 587,
  	"smtp_user" varchar,
  	"smtp_tls" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "analytics_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"google_analytics_ga_enabled" boolean DEFAULT false,
  	"google_analytics_ga_measurement_id" varchar,
  	"meta_pixel_pixel_enabled" boolean DEFAULT false,
  	"meta_pixel_pixel_id" varchar,
  	"tag_manager_gtm_enabled" boolean DEFAULT false,
  	"tag_manager_gtm_id" varchar,
  	"head_script" varchar,
  	"body_script" varchar,
  	"cookie_consent_banner_enabled" boolean DEFAULT true,
  	"cookie_consent_privacy_page_url" varchar DEFAULT '/privacidade',
  	"cookie_consent_banner_text" varchar DEFAULT 'Usamos cookies para melhorar sua experiência no site. Ao continuar navegando, você concorda com nossa Política de Privacidade.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "posts" ADD COLUMN "is_mock" boolean DEFAULT false;
  ALTER TABLE "edicoes" ADD COLUMN "is_mock" boolean DEFAULT false;
  ALTER TABLE "filmes" ADD COLUMN "is_mock" boolean DEFAULT false;
  ALTER TABLE "premios" ADD COLUMN "is_mock" boolean DEFAULT false;
  ALTER TABLE "apoiadores" ADD COLUMN "is_mock" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "site_config" ADD COLUMN "theme" "enum_site_config_theme" DEFAULT 'default';
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "smtp_config" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_config" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "smtp_config" CASCADE;
  DROP TABLE "analytics_config" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "posts" DROP COLUMN "is_mock";
  ALTER TABLE "filmes" DROP COLUMN "is_mock";
  ALTER TABLE "edicoes" DROP COLUMN "is_mock";
  ALTER TABLE "premios" DROP COLUMN "is_mock";
  ALTER TABLE "apoiadores" DROP COLUMN "is_mock";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  ALTER TABLE "site_config" DROP COLUMN "theme";
  DROP TYPE "public"."enum_site_config_theme";
  DROP TYPE "public"."enum_smtp_config_provider";`)
}
