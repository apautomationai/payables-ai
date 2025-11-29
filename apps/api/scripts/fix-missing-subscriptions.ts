/**
 * Script to fix users who don't have subscription records
 * This can happen if subscription creation failed during registration
 */

import db from '../lib/db';
import { usersModel } from '../models/users.model';
import { subscriptionsModel } from '../models/subscriptions.model';
import { RegistrationService } from '../services/registration.service';
import { sql } from 'drizzle-orm';

async function fixMissingSubscriptions() {
    console.log('🔍 Checking for users without subscriptions...');

    try {
        // Find users who don't have subscriptions
        const usersWithoutSubscriptions = await db
            .select({
                id: usersModel.id,
                email: usersModel.email,
                createdAt: usersModel.createdAt
            })
            .from(usersModel)
            .leftJoin(subscriptionsModel, sql`${usersModel.id} = ${subscriptionsModel.userId}`)
            .where(sql`${subscriptionsModel.id} IS NULL`);

        if (usersWithoutSubscriptions.length === 0) {
            console.log('✅ All users have subscriptions!');
            return;
        }

        console.log(`⚠️ Found ${usersWithoutSubscriptions.length} users without subscriptions`);

        // Fix each user
        for (const user of usersWithoutSubscriptions) {
            console.log(`\n📝 Fixing user ${user.id} (${user.email})...`);

            try {
                await RegistrationService.assignSubscriptionToExistingUser(user.id);
                console.log(`✅ Successfully created subscription for user ${user.id}`);
            } catch (error: any) {
                console.error(`❌ Failed to create subscription for user ${user.id}:`, error.message);
            }
        }

        console.log('\n✅ Migration complete!');
    } catch (error: any) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Run the script
fixMissingSubscriptions()
    .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
