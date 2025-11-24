-- Migration: Add customer_id to line_items table
-- Date: 2024-11-24

ALTER TABLE "line_items" ADD COLUMN "customer_id" integer;
