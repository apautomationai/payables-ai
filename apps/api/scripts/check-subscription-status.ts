/**
 * Diagnostic script to check subscription status for a specific user
 */

import db from '../lib/db';
import { usersModel } from '../models/users.model';
import { subscriptionsModel, registrationCounterModel } from '../models/subscriptions.model';
import { eq } from 'drizzle-orm';

async function checkSubscriptionStatus(userId: number) {
    console.log(`\n🔍 Checking subscription status for user ${userId}...\n`);

    try {
        // Check if user exists
        const [user] = await db
            .select()
            .from(usersModel)
            .where(eq(usersModel.id, userId))
            .limit(1);

        if (!user) {
            console.log(`❌ User ${userId} does not exist`);
            return;
        }

        console.log(`✅ User found:`, {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        });

        // Check if subscription exists
        const [subscription] = await db
            .select()
            .from(subscriptionsModel)
            .where(eq(subscriptionsModel.userId, userId))
            .limit(1);

        if (subscription) {
            console.log(`\n✅ Subscription exists:`, {
                id: subscription.id,
                userId: subscription.userId,
                registrationOrder: subscription.registrationOrder,
                tier: subscription.tier,
                status: subscription.status,
                createdAt: subscription.createdAt
            });
        } else {
            console.log(`\n❌ No subscription found for user ${userId}`);
        }

        // Check registration counter
        const [counter] = await db
            .select()
            .from(registrationCounterModel)
            .limit(1);

        console.log(`\n📊 Registration counter:`, {
            currentCount: counter?.currentCount || 0,
            updatedAt: counter?.updatedAt
        });

        // Count total users
        const totalUsers = await db
            .select()
            .from(usersModel);

        console.log(`\n👥 Total users in database: ${totalUsers.length}`);

        // Count total subscriptions
        const totalSubscriptions = await db
            .select()
            .from(subscriptionsModel);

        console.log(`📋 Total subscriptions in database: ${totalSubscriptions.length}`);

        // Check for duplicate registration orders
        const allSubscriptions = await db
            .select({
                registrationOrder: subscriptionsModel.registrationOrder,
                userId: subscriptionsModel.userId
            })
            .from(subscriptionsModel)
            .orderBy(subscriptionsModel.registrationOrder);

        const orderCounts = new Map<number, number>();
        allSubscriptions.forEach(sub => {
            orderCounts.set(sub.registrationOrder, (orderCounts.get(sub.registrationOrder) || 0) + 1);
        });

        const duplicates = Array.from(orderCounts.entries()).filter(([_, count]) => count > 1);
        if (duplicates.length > 0) {
            console.log(`\n⚠️ Found duplicate registration orders:`, duplicates);
        } else {
            console.log(`\n✅ No duplicate registration orders found`);
        }

        // Calculate what the registration order should be for this user
        const calculatedOrder = totalUsers.filter(u => u.id <= userId).length;
        console.log(`\n🧮 Calculated registration order for user ${userId}: ${calculatedOrder}`);

    } catch (error: any) {
        console.error('❌ Error checking subscription status:', error);
        throw error;
    }
}

// Get user ID from command line argument
const userId = process.argv[2] ? parseInt(process.argv[2]) : 47;

checkSubscriptionStatus(userId)
    .then(() => {
        console.log('\n✅ Check complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Check failed:', error);
        process.exit(1);
    });
