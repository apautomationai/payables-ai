import db from '../lib/db';
import { usersModel } from '../models/users.model';
import { subscriptionsModel } from '../models/subscriptions.model';
import { RegistrationService } from '../services/registration.service';
import { SubscriptionService } from '../services/subscription.service';
import { eq, notExists } from 'drizzle-orm';

/**
 * Utility to find and fix users who are missing subscriptions
 * This can happen if users were created via OAuth before subscription assignment was implemented
 */
export class SubscriptionFixUtility {
    /**
     * Find users without subscriptions
     */
    static async findUsersWithoutSubscriptions() {
        try {
            const usersWithoutSubscriptions = await db
                .select({
                    id: usersModel.id,
                    email: usersModel.email,
                    provider: usersModel.provider,
                    createdAt: usersModel.createdAt
                })
                .from(usersModel)
                .where(
                    notExists(
                        db.select()
                            .from(subscriptionsModel)
                            .where(eq(subscriptionsModel.userId, usersModel.id))
                    )
                );

            return usersWithoutSubscriptions;
        } catch (error: any) {
            console.error('Error finding users without subscriptions:', error);
            throw error;
        }
    }

    /**
     * Fix missing subscriptions for users
     */
    static async fixMissingSubscriptions() {
        try {
            const usersWithoutSubscriptions = await this.findUsersWithoutSubscriptions();

            if (usersWithoutSubscriptions.length === 0) {
                console.log('✅ All users have subscriptions assigned');
                return { fixed: 0, errors: [] };
            }

            console.log(`Found ${usersWithoutSubscriptions.length} users without subscriptions:`);
            usersWithoutSubscriptions.forEach(user => {
                console.log(`- User ID: ${user.id}, Email: ${user.email}, Provider: ${user.provider || 'credentials'}, Created: ${user.createdAt}`);
            });

            const results = {
                fixed: 0,
                errors: [] as Array<{ userId: number, email: string, error: string }>
            };

            // Fix each user's subscription
            for (const user of usersWithoutSubscriptions) {
                try {
                    console.log(`Assigning subscription to user ${user.id} (${user.email})...`);
                    await RegistrationService.assignSubscriptionToUser(user.id);
                    results.fixed++;
                    console.log(`✅ Successfully assigned subscription to user ${user.id}`);
                } catch (error: any) {
                    const errorMsg = error.message || 'Unknown error';
                    results.errors.push({
                        userId: user.id,
                        email: user.email,
                        error: errorMsg
                    });
                    console.error(`❌ Failed to assign subscription to user ${user.id}: ${errorMsg}`);
                }
            }

            console.log(`\n📊 Summary:`);
            console.log(`- Fixed: ${results.fixed} users`);
            console.log(`- Errors: ${results.errors.length} users`);

            if (results.errors.length > 0) {
                console.log(`\n❌ Errors:`);
                results.errors.forEach(error => {
                    console.log(`- User ${error.userId} (${error.email}): ${error.error}`);
                });
            }

            return results;
        } catch (error: any) {
            console.error('Error fixing missing subscriptions:', error);
            throw error;
        }
    }

    /**
     * Check subscription status for a specific user
     */
    static async checkUserSubscription(userId: number) {
        try {
            const subscription = await SubscriptionService.getSubscriptionByUserId(userId);

            if (!subscription) {
                console.log(`❌ User ${userId} has no subscription`);
                return null;
            }

            console.log(`✅ User ${userId} subscription:`, {
                id: subscription.id,
                tier: subscription.tier,
                status: subscription.status,
                registrationOrder: subscription.registrationOrder,
                trialEnd: subscription.trialEnd,
                hasActiveAccess: SubscriptionService.hasActiveAccess(subscription),
                requiresPaymentSetup: SubscriptionService.requiresPaymentSetup(subscription)
            });

            return subscription;
        } catch (error: any) {
            console.error(`Error checking subscription for user ${userId}:`, error);
            throw error;
        }
    }
}

// CLI usage example (can be run directly)
if (require.main === module) {
    (async () => {
        try {
            console.log('🔍 Checking for users without subscriptions...\n');
            await SubscriptionFixUtility.fixMissingSubscriptions();
        } catch (error) {
            console.error('Script failed:', error);
            process.exit(1);
        }
    })();
}