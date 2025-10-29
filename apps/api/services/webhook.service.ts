import Stripe from 'stripe';
import { SubscriptionService } from './subscription.service';
import { SUBSCRIPTION_CONFIG } from '../config/subscription.config';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

export class WebhookService {
    /**
     * Validate webhook signatures for security
     * Requirements: 5.2, 5.3, 5.4, 5.5
     */
    static validateWebhookSignature(payload: Buffer | string, signature: string, endpointSecret: string): Stripe.Event {
        try {
            const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
            return event;
        } catch (error) {
            console.error('Webhook signature verification failed:', error);
            throw new Error(`Webhook signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Process Stripe webhook events
     * Requirements: 5.2, 5.3, 5.4, 5.5
     */
    static async processWebhookEvent(event: Stripe.Event): Promise<void> {
        console.log(`Processing webhook event: ${event.type}`);

        try {
            switch (event.type) {
                // Subscription lifecycle events
                case 'customer.subscription.created':
                    await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
                    break;

                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                    break;

                // Payment events
                case 'invoice.payment_succeeded':
                    await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
                    break;

                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
                    break;

                // Checkout session events
                case 'checkout.session.completed':
                    await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                    break;

                // Customer events
                case 'customer.created':
                    await this.handleCustomerCreated(event.data.object as Stripe.Customer);
                    break;

                case 'customer.updated':
                    await this.handleCustomerUpdated(event.data.object as Stripe.Customer);
                    break;

                // Additional subscription events for better coverage
                case 'customer.subscription.trial_will_end':
                    await this.handleTrialWillEnd(event.data.object as Stripe.Subscription);
                    break;

                case 'invoice.upcoming':
                    await this.handleUpcomingInvoice(event.data.object as Stripe.Invoice);
                    break;

                case 'invoice.created':
                    await this.handleInvoiceCreated(event.data.object as Stripe.Invoice);
                    break;

                default:
                    console.log(`Unhandled webhook event type: ${event.type}`);
                    break;
            }
        } catch (error) {
            console.error(`Error processing webhook event ${event.type}:`, error);
            throw error;
        }
    }

    /**
     * Handle subscription created events
     * Requirements: 5.2, 5.3
     */
    private static async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
        try {
            console.log(`Handling subscription created: ${subscription.id}`);

            const customerId = subscription.customer as string;
            const userId = this.extractUserIdFromMetadata(subscription.metadata);

            if (!userId) {
                console.error('No user ID found in subscription metadata');
                return;
            }

            // Get local subscription
            const localSubscription = await SubscriptionService.getSubscriptionByUserId(userId);
            if (!localSubscription) {
                console.error(`Local subscription not found for user ${userId}`);
                return;
            }

            // Determine status based on subscription state
            const status = this.mapStripeStatusToLocal(subscription.status) as any;

            // Update local subscription with Stripe data
            const updateData: any = {
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscription.id,
                status,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
            };

            // Only add period dates if they exist (cast to any to access these properties)
            const subWithPeriods = subscription as any;
            if (subWithPeriods.current_period_start) {
                updateData.currentPeriodStart = new Date(subWithPeriods.current_period_start * 1000);
            }
            if (subWithPeriods.current_period_end) {
                updateData.currentPeriodEnd = new Date(subWithPeriods.current_period_end * 1000);
            }

            await SubscriptionService.updateSubscriptionByUserId(userId, updateData);

            // Start trial period now that payment method is set up
            if (localSubscription.status === 'incomplete') {
                await SubscriptionService.startTrialPeriod(userId);
                console.log(`Started trial period for user ${userId}`);
            }

            console.log(`Successfully updated subscription for user ${userId}`);
        } catch (error) {
            console.error('Error handling subscription created:', error);
            throw error;
        }
    }

    /**
     * Handle subscription updated events
     * Requirements: 5.2, 5.3, 5.5
     */
    private static async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
        try {
            console.log(`Handling subscription updated: ${subscription.id}`);

            // Check if this is a renewal (period dates changed and status is active)
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscription.id);
            if (localSubscription) {
                const currentPeriodStart = new Date((subscription as any).current_period_start * 1000);
                const isRenewal = subscription.status === 'active' &&
                    localSubscription.currentPeriodStart &&
                    currentPeriodStart.getTime() > localSubscription.currentPeriodStart.getTime();

                if (isRenewal) {
                    await this.handleSubscriptionRenewal(subscription);
                    return;
                }

                // Check if this is a cancellation
                if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
                    await this.handleSubscriptionCancellation(subscription);
                    return;
                }
            }

            // For other updates, sync the subscription data
            await this.syncSubscriptionFromStripe(subscription.id);

            console.log(`Successfully processed subscription update for ${subscription.id}`);
        } catch (error) {
            console.error('Error handling subscription updated:', error);
            throw error;
        }
    }

    /**
     * Handle subscription deleted/canceled events
     * Requirements: 5.2, 5.3, 5.5
     */
    private static async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
        try {
            console.log(`Handling subscription deleted: ${subscription.id}`);

            // Use the dedicated cancellation handler
            await this.handleSubscriptionCancellation(subscription);

            console.log(`Successfully processed subscription deletion for ${subscription.id}`);
        } catch (error) {
            console.error('Error handling subscription deleted:', error);
            throw error;
        }
    }

    /**
     * Handle payment succeeded events
     * Requirements: 5.2, 5.4
     */
    private static async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
        try {
            console.log(`Handling payment succeeded: ${invoice.id}`);

            if (!(invoice as any).subscription) {
                console.log('Invoice not associated with a subscription, skipping');
                return;
            }

            const subscriptionId = (invoice as any).subscription as string;

            // Find local subscription by Stripe subscription ID
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscriptionId);
            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${subscriptionId}`);
                return;
            }

            // Update subscription to active status if payment succeeded
            await SubscriptionService.updateSubscriptionByUserId(localSubscription.userId, {
                status: SUBSCRIPTION_CONFIG.STATUS.ACTIVE,
                currentPeriodStart: new Date(invoice.period_start * 1000),
                currentPeriodEnd: new Date(invoice.period_end * 1000),
            });

            console.log(`Successfully updated subscription to active for user ${localSubscription.userId}`);
        } catch (error) {
            console.error('Error handling payment succeeded:', error);
            throw error;
        }
    }

    /**
     * Handle payment failed events
     * Requirements: 5.2, 5.5
     */
    private static async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
        try {
            console.log(`Handling payment failed: ${invoice.id}`);

            if (!(invoice as any).subscription) {
                console.log('Invoice not associated with a subscription, skipping');
                return;
            }

            const subscriptionId = (invoice as any).subscription as string;

            // Find local subscription by Stripe subscription ID
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscriptionId);
            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${subscriptionId}`);
                return;
            }

            // Update subscription to past_due status if payment failed
            await SubscriptionService.updateSubscriptionByUserId(localSubscription.userId, {
                status: SUBSCRIPTION_CONFIG.STATUS.PAST_DUE,
            });

            console.log(`Successfully updated subscription to past_due for user ${localSubscription.userId}`);
        } catch (error) {
            console.error('Error handling payment failed:', error);
            throw error;
        }
    }

    /**
     * Handle checkout session completed events
     * Requirements: 5.2, 5.3
     */
    private static async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
        try {
            console.log(`Handling checkout completed: ${session.id}`);

            const userId = this.extractUserIdFromMetadata(session.metadata);
            if (!userId) {
                console.error('No user ID found in checkout session metadata');
                return;
            }

            // If this is a subscription checkout, the subscription.created event will handle the update
            if (session.mode === 'subscription' && session.subscription) {
                console.log('Subscription checkout completed, subscription.created event will handle the update');
                return;
            }

            // Handle one-time payment checkouts if needed in the future
            console.log('One-time payment checkout completed');
        } catch (error) {
            console.error('Error handling checkout completed:', error);
            throw error;
        }
    }

    /**
     * Handle customer created events
     * Requirements: 5.2
     */
    private static async handleCustomerCreated(customer: Stripe.Customer): Promise<void> {
        try {
            console.log(`Handling customer created: ${customer.id}`);

            const userId = this.extractUserIdFromMetadata(customer.metadata);
            if (!userId) {
                console.log('No user ID found in customer metadata, skipping');
                return;
            }

            // Update local subscription with customer ID if not already set
            const localSubscription = await SubscriptionService.getSubscriptionByUserId(userId);
            if (localSubscription && !localSubscription.stripeCustomerId) {
                await SubscriptionService.updateSubscriptionByUserId(userId, {
                    stripeCustomerId: customer.id,
                });
                console.log(`Updated subscription with customer ID for user ${userId}`);
            }
        } catch (error) {
            console.error('Error handling customer created:', error);
            throw error;
        }
    }

    /**
     * Handle customer updated events
     * Requirements: 5.2
     */
    private static async handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
        try {
            console.log(`Handling customer updated: ${customer.id}`);

            // Find local subscription by customer ID
            const localSubscription = await SubscriptionService.getSubscriptionByStripeCustomerId(customer.id);
            if (!localSubscription) {
                console.log(`Local subscription not found for customer ${customer.id}, skipping`);
                return;
            }

            // Customer updates don't typically require local subscription changes
            // but we could sync customer data if needed
            console.log(`Customer ${customer.id} updated, no local changes needed`);
        } catch (error) {
            console.error('Error handling customer updated:', error);
            throw error;
        }
    }

    /**
     * Handle trial will end events
     * Requirements: 5.2, 5.3
     */
    private static async handleTrialWillEnd(subscription: Stripe.Subscription): Promise<void> {
        try {
            console.log(`Handling trial will end: ${subscription.id}`);

            // Find local subscription
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscription.id);
            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${subscription.id}`);
                return;
            }

            // This is mainly for logging/notification purposes
            // The actual status change will happen when the trial ends
            console.log(`Trial ending soon for user ${localSubscription.userId}, subscription ${subscription.id}`);

            // Could trigger email notifications here if needed
        } catch (error) {
            console.error('Error handling trial will end:', error);
            throw error;
        }
    }

    /**
     * Handle upcoming invoice events
     * Requirements: 5.2, 5.4
     */
    private static async handleUpcomingInvoice(invoice: Stripe.Invoice): Promise<void> {
        try {
            console.log(`Handling upcoming invoice: ${invoice.id}`);

            if (!(invoice as any).subscription) {
                console.log('Invoice not associated with a subscription, skipping');
                return;
            }

            const subscriptionId = (invoice as any).subscription as string;
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscriptionId);

            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${subscriptionId}`);
                return;
            }

            // This is mainly for logging/notification purposes
            console.log(`Upcoming invoice for user ${localSubscription.userId}, amount: ${invoice.amount_due}`);

            // Could trigger email notifications or prepare for payment here if needed
        } catch (error) {
            console.error('Error handling upcoming invoice:', error);
            throw error;
        }
    }

    /**
     * Handle invoice created events
     * Requirements: 5.2, 5.4
     */
    private static async handleInvoiceCreated(invoice: Stripe.Invoice): Promise<void> {
        try {
            console.log(`Handling invoice created: ${invoice.id}`);

            if (!(invoice as any).subscription) {
                console.log('Invoice not associated with a subscription, skipping');
                return;
            }

            const subscriptionId = (invoice as any).subscription as string;
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscriptionId);

            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${subscriptionId}`);
                return;
            }

            // Log invoice creation for audit purposes
            console.log(`Invoice created for user ${localSubscription.userId}, amount: ${invoice.amount_due}, status: ${invoice.status}`);
        } catch (error) {
            console.error('Error handling invoice created:', error);
            throw error;
        }
    }

    /**
     * Synchronize subscription data from Stripe
     * Requirements: 5.2, 5.3, 5.5
     */
    static async syncSubscriptionFromStripe(stripeSubscriptionId: string): Promise<void> {
        try {
            console.log(`Syncing subscription data from Stripe: ${stripeSubscriptionId}`);

            // Retrieve subscription from Stripe
            const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

            // Find local subscription
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(stripeSubscriptionId);
            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${stripeSubscriptionId}`);
                return;
            }

            // Map Stripe status to local status
            const status = this.mapStripeStatusToLocal(stripeSubscription.status) as any;

            // Update local subscription with Stripe data
            await SubscriptionService.updateSubscriptionByUserId(localSubscription.userId, {
                status,
                currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
                currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            });

            console.log(`Successfully synced subscription data for user ${localSubscription.userId}`);
        } catch (error) {
            console.error('Error syncing subscription from Stripe:', error);
            throw error;
        }
    }

    /**
     * Handle subscription renewals
     * Requirements: 5.2, 5.3, 5.5
     */
    static async handleSubscriptionRenewal(subscription: Stripe.Subscription): Promise<void> {
        try {
            console.log(`Handling subscription renewal: ${subscription.id}`);

            // Find local subscription
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscription.id);
            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${subscription.id}`);
                return;
            }

            // Update subscription with new period dates and active status
            await SubscriptionService.updateSubscriptionByUserId(localSubscription.userId, {
                status: SUBSCRIPTION_CONFIG.STATUS.ACTIVE as any,
                currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                cancelAtPeriodEnd: false, // Reset cancellation flag on renewal
            });

            console.log(`Successfully processed renewal for user ${localSubscription.userId}`);
        } catch (error) {
            console.error('Error handling subscription renewal:', error);
            throw error;
        }
    }

    /**
     * Handle subscription cancellations with proper cleanup
     * Requirements: 5.2, 5.3, 5.5
     */
    static async handleSubscriptionCancellation(subscription: Stripe.Subscription): Promise<void> {
        try {
            console.log(`Handling subscription cancellation: ${subscription.id}`);

            // Find local subscription
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(subscription.id);
            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${subscription.id}`);
                return;
            }

            // Update subscription status based on cancellation type
            let status: any = SUBSCRIPTION_CONFIG.STATUS.CANCELED;

            // If subscription is canceled but still active until period end
            if (subscription.cancel_at_period_end && subscription.status === 'active') {
                status = SUBSCRIPTION_CONFIG.STATUS.ACTIVE;
            }

            await SubscriptionService.updateSubscriptionByUserId(localSubscription.userId, {
                status: status as any,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            });

            console.log(`Successfully processed cancellation for user ${localSubscription.userId}`);
        } catch (error) {
            console.error('Error handling subscription cancellation:', error);
            throw error;
        }
    }

    /**
     * Validate data consistency between Stripe and local database
     * Requirements: 5.2, 5.3, 5.5
     */
    static async validateDataConsistency(stripeSubscriptionId: string): Promise<boolean> {
        try {
            // Get data from both sources
            const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
            const localSubscription = await SubscriptionService.getSubscriptionByStripeSubscriptionId(stripeSubscriptionId);

            if (!localSubscription) {
                console.error(`Local subscription not found for Stripe subscription ${stripeSubscriptionId}`);
                return false;
            }

            // Check key fields for consistency
            const stripeStatus = this.mapStripeStatusToLocal(stripeSubscription.status);
            const stripePeriodStart = new Date((stripeSubscription as any).current_period_start * 1000);
            const stripePeriodEnd = new Date((stripeSubscription as any).current_period_end * 1000);

            const isConsistent =
                localSubscription.status === stripeStatus &&
                localSubscription.cancelAtPeriodEnd === stripeSubscription.cancel_at_period_end &&
                localSubscription.currentPeriodStart?.getTime() === stripePeriodStart.getTime() &&
                localSubscription.currentPeriodEnd?.getTime() === stripePeriodEnd.getTime();

            if (!isConsistent) {
                console.warn(`Data inconsistency detected for subscription ${stripeSubscriptionId}`);
                console.warn('Local:', {
                    status: localSubscription.status,
                    cancelAtPeriodEnd: localSubscription.cancelAtPeriodEnd,
                    currentPeriodStart: localSubscription.currentPeriodStart,
                    currentPeriodEnd: localSubscription.currentPeriodEnd
                });
                console.warn('Stripe:', {
                    status: stripeStatus,
                    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                    currentPeriodStart: stripePeriodStart,
                    currentPeriodEnd: stripePeriodEnd
                });
            }

            return isConsistent;
        } catch (error) {
            console.error('Error validating data consistency:', error);
            return false;
        }
    }

    /**
     * Fix data inconsistencies by syncing from Stripe
     * Requirements: 5.2, 5.3, 5.5
     */
    static async fixDataInconsistency(stripeSubscriptionId: string): Promise<void> {
        try {
            console.log(`Fixing data inconsistency for subscription ${stripeSubscriptionId}`);
            await this.syncSubscriptionFromStripe(stripeSubscriptionId);
            console.log(`Data inconsistency fixed for subscription ${stripeSubscriptionId}`);
        } catch (error) {
            console.error('Error fixing data inconsistency:', error);
            throw error;
        }
    }

    /**
     * Map Stripe subscription status to local status
     */
    private static mapStripeStatusToLocal(stripeStatus: string): string {
        switch (stripeStatus) {
            case 'trialing':
                return SUBSCRIPTION_CONFIG.STATUS.TRIALING;
            case 'active':
                return SUBSCRIPTION_CONFIG.STATUS.ACTIVE;
            case 'past_due':
                return SUBSCRIPTION_CONFIG.STATUS.PAST_DUE;
            case 'canceled':
                return SUBSCRIPTION_CONFIG.STATUS.CANCELED;
            case 'unpaid':
                return SUBSCRIPTION_CONFIG.STATUS.UNPAID;
            case 'incomplete':
                return SUBSCRIPTION_CONFIG.STATUS.INCOMPLETE;
            default:
                return SUBSCRIPTION_CONFIG.STATUS.ACTIVE;
        }
    }

    /**
     * Extract user ID from metadata
     */
    private static extractUserIdFromMetadata(metadata: Stripe.Metadata | null): number | null {
        if (!metadata || !metadata.userId) {
            return null;
        }

        const userId = parseInt(metadata.userId);
        return isNaN(userId) ? null : userId;
    }

    /**
     * Retry webhook processing with exponential backoff
     * Requirements: 5.2, 5.3, 5.4, 5.5
     */
    static async processWebhookWithRetry(event: Stripe.Event, maxRetries: number = 3): Promise<void> {
        let attempt = 0;
        let lastError: Error | null = null;

        while (attempt < maxRetries) {
            try {
                await this.processWebhookEvent(event);
                return; // Success, exit retry loop
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');
                attempt++;

                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
                    console.log(`Webhook processing failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.error(`Webhook processing failed after ${maxRetries} attempts:`, lastError);
                }
            }
        }

        // If we get here, all retries failed
        throw lastError || new Error('Webhook processing failed after all retries');
    }

    /**
     * Batch process multiple webhook events
     * Requirements: 5.2, 5.3, 5.4, 5.5
     */
    static async batchProcessWebhooks(events: Stripe.Event[]): Promise<{ success: number; failed: number; errors: Error[] }> {
        const results = {
            success: 0,
            failed: 0,
            errors: [] as Error[]
        };

        for (const event of events) {
            try {
                await this.processWebhookWithRetry(event);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push(error instanceof Error ? error : new Error('Unknown error'));
            }
        }

        return results;
    }
}