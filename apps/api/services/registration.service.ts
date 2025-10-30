import db from '../lib/db';
import { registrationCounterModel } from '../models/subscriptions.model';
import { SubscriptionService } from './subscription.service';
import { eq, sql } from 'drizzle-orm';
import { InternalServerError } from '../helpers/errors';

export class RegistrationService {
    /**
     * Get next registration order atomically with fallback logic
     * Requirements: 1.1
     */
    static async getNextRegistrationOrder(): Promise<number> {
        try {
            // First, try to get the current counter
            let [counter] = await db
                .select()
                .from(registrationCounterModel)
                .limit(1);

            // If no counter exists, initialize it (fallback logic)
            if (!counter) {
                try {
                    [counter] = await db
                        .insert(registrationCounterModel)
                        .values({ currentCount: 0 })
                        .returning();
                } catch (insertError: any) {
                    // Handle race condition where another process might have inserted
                    if (insertError.code === '23505') { // unique_violation
                        [counter] = await db
                            .select()
                            .from(registrationCounterModel)
                            .limit(1);
                    } else {
                        throw insertError;
                    }
                }
            }

            if (!counter) {
                throw new InternalServerError('Failed to initialize registration counter');
            }

            // Atomically increment and return the new value (handles concurrent scenarios)
            const [updatedCounter] = await db
                .update(registrationCounterModel)
                .set({
                    currentCount: sql`${registrationCounterModel.currentCount} + 1`,
                    updatedAt: new Date()
                })
                .where(eq(registrationCounterModel.id, counter.id))
                .returning();

            return updatedCounter.currentCount;
        } catch (error: any) {
            throw new InternalServerError(`Failed to get registration order: ${error.message}`);
        }
    }

    /**
     * Assign subscription to user during registration
     * Requirements: 1.1
     */
    static async assignSubscriptionToUser(userId: number): Promise<void> {
        try {
            // Get next registration order
            const registrationOrder = await this.getNextRegistrationOrder();

            // Create subscription with tier assignment
            await SubscriptionService.createSubscription(userId, registrationOrder);
        } catch (error: any) {
            // Log error but don't break user registration
            console.error(`Failed to assign subscription to user ${userId}:`, error);
            throw new InternalServerError(`Subscription assignment failed: ${error.message}`);
        }
    }

    /**
     * Get current registration count (for monitoring/debugging)
     */
    static async getCurrentRegistrationCount(): Promise<number> {
        try {
            const [counter] = await db
                .select()
                .from(registrationCounterModel)
                .limit(1);

            return counter?.currentCount || 0;
        } catch (error: any) {
            throw new InternalServerError(`Failed to get registration count: ${error.message}`);
        }
    }
}