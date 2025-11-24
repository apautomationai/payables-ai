#!/bin/bash

# Run the migration to add customer_id column to line_items table
echo "Running migration: Add customer_id to line_items..."

# Use drizzle-kit to push the schema changes
pnpm db:push

echo "Migration completed!"
