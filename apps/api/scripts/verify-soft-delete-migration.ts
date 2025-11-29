import db from '../lib/db';
import { sql } from 'drizzle-orm';

async function verifyMigration() {
    console.log('🔍 Verifying soft delete migration...\n');

    try {
        // Check invoices table columns
        console.log('Checking invoices table...');
        const invoicesColumns = await db.execute(sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'invoices'
      AND column_name IN ('is_deleted', 'deleted_at')
      ORDER BY column_name;
    `);

        console.log('Invoices columns:', invoicesColumns.rows);

        // Check attachments table columns
        console.log('\nChecking attachments table...');
        const attachmentsColumns = await db.execute(sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'attachments'
      AND column_name IN ('is_deleted', 'deleted_at')
      ORDER BY column_name;
    `);

        console.log('Attachments columns:', attachmentsColumns.rows);

        // Check indexes
        console.log('\nChecking indexes...');
        const indexes = await db.execute(sql`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename IN ('invoices', 'attachments')
      AND indexname LIKE '%is_deleted%'
      ORDER BY tablename, indexname;
    `);

        console.log('Indexes:', indexes.rows);

        // Verify the structure
        const invoicesHasIsDeleted = invoicesColumns.rows.some((row: any) => row.column_name === 'is_deleted');
        const invoicesHasDeletedAt = invoicesColumns.rows.some((row: any) => row.column_name === 'deleted_at');
        const attachmentsHasIsDeleted = attachmentsColumns.rows.some((row: any) => row.column_name === 'is_deleted');
        const attachmentsHasDeletedAt = attachmentsColumns.rows.some((row: any) => row.column_name === 'deleted_at');
        const hasInvoicesIndex = indexes.rows.some((row: any) => row.indexname === 'idx_invoices_is_deleted');
        const hasAttachmentsIndex = indexes.rows.some((row: any) => row.indexname === 'idx_attachments_is_deleted');

        console.log('\n✅ Verification Results:');
        console.log(`  Invoices.is_deleted: ${invoicesHasIsDeleted ? '✓' : '✗'}`);
        console.log(`  Invoices.deleted_at: ${invoicesHasDeletedAt ? '✓' : '✗'}`);
        console.log(`  Attachments.is_deleted: ${attachmentsHasIsDeleted ? '✓' : '✗'}`);
        console.log(`  Attachments.deleted_at: ${attachmentsHasDeletedAt ? '✓' : '✗'}`);
        console.log(`  Index on invoices.is_deleted: ${hasInvoicesIndex ? '✓' : '✗'}`);
        console.log(`  Index on attachments.is_deleted: ${hasAttachmentsIndex ? '✓' : '✗'}`);

        const allChecksPass = invoicesHasIsDeleted && invoicesHasDeletedAt &&
            attachmentsHasIsDeleted && attachmentsHasDeletedAt &&
            hasInvoicesIndex && hasAttachmentsIndex;

        if (allChecksPass) {
            console.log('\n🎉 Migration verified successfully! All columns and indexes are in place.');
        } else {
            console.log('\n⚠️  Some checks failed. Please review the results above.');
        }

        process.exit(allChecksPass ? 0 : 1);
    } catch (error) {
        console.error('❌ Error verifying migration:', error);
        process.exit(1);
    }
}

verifyMigration();
