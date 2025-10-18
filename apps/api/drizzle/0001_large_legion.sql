CREATE TYPE "public"."provider" AS ENUM('local', 'gmail', 'outlook');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected', 'failed', 'not_connected');--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash_id" text,
	"user_id" integer NOT NULL,
	"email_id" text,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"sender" text,
	"receiver" text,
	"provider" "provider" DEFAULT 'local' NOT NULL,
	"file_url" text,
	"file_key" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"status" "status" DEFAULT 'not_connected' NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"token_type" text,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"start_reading" timestamp,
	"last_read" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"attachment_id" integer NOT NULL,
	"invoice_number" varchar(50),
	"vendor_name" varchar(255),
	"customer_name" varchar(255),
	"invoice_date" timestamp,
	"due_date" timestamp,
	"total_amount" numeric,
	"currency" varchar(10),
	"line_items" numeric,
	"cost_code" varchar(50),
	"quantity" numeric,
	"rate" numeric,
	"description" text,
	"file_url" text,
	"file_key" text,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quickbooks_integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_id" varchar(255) NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"token_expires_at" timestamp NOT NULL,
	"realm_id" varchar(255) NOT NULL,
	"company_name" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "login" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "register" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "login" CASCADE;--> statement-breakpoint
DROP TABLE "register" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" varchar(255) DEFAULT 'credentials' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "quickbooks_integrations" ADD CONSTRAINT "quickbooks_integrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";