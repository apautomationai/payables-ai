-- Rollback script for soft delete migration
-- This script removes the soft delete columns and indexes

-- Drop indexes
DROP INDEX IF EXISTS idx_invoices_is_deleted;
DROP INDEX IF EXISTS idx_attachments_is_deleted;

-- Drop columns from invoices table
ALTER TABLE invoices DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE invoices DROP COLUMN IF EXISTS deleted_at;

-- Drop columns from attachments table
ALTER TABLE attachments DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE attachments DROP COLUMN IF EXISTS deleted_at;
