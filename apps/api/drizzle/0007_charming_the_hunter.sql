ALTER TABLE "line_items" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "line_items" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "quickbooks_accounts" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "quickbooks_products" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX "quickbooks_accounts_embedding_idx" ON "quickbooks_accounts" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "quickbooks_products_embedding_idx" ON "quickbooks_products" USING hnsw ("embedding" vector_cosine_ops);