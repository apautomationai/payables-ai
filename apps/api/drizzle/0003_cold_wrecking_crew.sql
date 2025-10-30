CREATE TYPE "public"."integration_status" AS ENUM('success', 'failed', 'not_connected', 'disconnected', 'paused');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('pending', 'approved', 'rejected', 'failed', 'not_connected');--> statement-breakpoint
ALTER TABLE "quickbooks_integrations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "quickbooks_integrations" CASCADE;--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "status" SET DATA TYPE "public"."integration_status" USING "status"::text::"public"."integration_status";--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "status" SET DEFAULT 'not_connected';--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" SET DATA TYPE "public"."invoice_status" USING "status"::text::"public"."invoice_status";--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
DROP TYPE "public"."status";