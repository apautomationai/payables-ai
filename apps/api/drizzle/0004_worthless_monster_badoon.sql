CREATE TYPE "public"."item_type" AS ENUM('account', 'product');--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "last_read" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "vendor_address" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "vendor_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "vendor_email" varchar(255);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "total_tax" numeric;--> statement-breakpoint
ALTER TABLE "line_items" ADD COLUMN "item_type" "item_type";--> statement-breakpoint
ALTER TABLE "line_items" ADD COLUMN "resource_id" varchar(50);