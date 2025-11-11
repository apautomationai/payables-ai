-- Add soft delete columns to invoices table
ALTER TABLE "invoices" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint

-- Add soft delete columns to attachments table
ALTER TABLE "attachments" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint

-- Create indexes for query performance
CREATE INDEX "idx_invoices_is_deleted" ON "invoices" ("is_deleted");--> statement-breakpoint
CREATE INDEX "idx_attachments_is_deleted" ON "attachments" ("is_deleted");
