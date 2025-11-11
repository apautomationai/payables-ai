import db from '../lib/db';
import { sql } from 'drizzle-orm';

async function createIndexes() {
    console.log('🔧 Creating indexes for soft delete columns...\n');

    try {
        // Create index on invoices.is_deleted
        console.log('Creating index on invoices.is_deleted...');
        await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_invoices_is_deleted ON invoices (is_deleted);
    `);
        console.log('✓ Index idx_invoices_is_deleted created');

        // Create index on attachments.is_deleted
        console.log('Creating index on attachments.is_deleted...');
        await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_attachments_is_deleted ON attachments (is_deleted);
    `);
        console.log('✓ Index idx_attachments_is_deleted created');

        console.log('\n🎉 All indexes created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        process.exit(1);
    }
}

createIndexes();
