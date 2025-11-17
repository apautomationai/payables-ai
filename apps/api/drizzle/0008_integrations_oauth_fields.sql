-- Add provider_id and email columns
ALTER TABLE "integrations" ADD COLUMN "provider_id" text;--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "email" text;--> statement-breakpoint

-- Migrate existing startReading and lastRead data to metadata
UPDATE "integrations" 
SET "metadata" = CASE
  WHEN "start_reading" IS NOT NULL AND "last_read" IS NOT NULL THEN
    jsonb_set(
      jsonb_set(
        COALESCE("metadata", '{}'::jsonb),
        '{startReading}',
        to_jsonb("start_reading"::text)
      ),
      '{lastRead}',
      to_jsonb("last_read"::text)
    )
  WHEN "start_reading" IS NOT NULL THEN
    jsonb_set(
      COALESCE("metadata", '{}'::jsonb),
      '{startReading}',
      to_jsonb("start_reading"::text)
    )
  WHEN "last_read" IS NOT NULL THEN
    jsonb_set(
      COALESCE("metadata", '{}'::jsonb),
      '{lastRead}',
      to_jsonb("last_read"::text)
    )
  ELSE COALESCE("metadata", '{}'::jsonb)
END
WHERE "start_reading" IS NOT NULL OR "last_read" IS NOT NULL;--> statement-breakpoint

-- Drop old columns
ALTER TABLE "integrations" DROP COLUMN "start_reading";--> statement-breakpoint
ALTER TABLE "integrations" DROP COLUMN "last_read";--> statement-breakpoint

-- Add index on email for faster duplicate checks
CREATE INDEX "idx_integrations_email" ON "integrations" USING btree ("email");--> statement-breakpoint

