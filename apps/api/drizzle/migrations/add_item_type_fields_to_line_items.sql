-- Migration: Add item type and resource ID fields to line_items table
-- Created: 2025-11-06

-- Create enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE item_type AS ENUM ('account', 'product');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add columns if they don't exist
ALTER TABLE line_items 
ADD COLUMN IF NOT EXISTS item_type item_type,
ADD COLUMN IF NOT EXISTS resource_id INTEGER;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_line_items_item_type ON line_items(item_type);
CREATE INDEX IF NOT EXISTS idx_line_items_resource_id ON line_items(resource_id);