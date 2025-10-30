export const SUBSCRIPTION_CONFIG = {
    TIERS: {
        FREE: 'free',
        PROMOTIONAL: 'promotional',
        STANDARD: 'standard'
    } as const,

    TIER_LIMITS: {
        FREE_MAX: 1,
        PROMOTIONAL_MAX: 3
    } as const,

    PRICING: {
        PROMOTIONAL_MONTHLY: 19900, // $199.00 in cents
        STANDARD_MONTHLY: 29900     // $299.00 in cents
    } as const,

    TRIALS: {
        PROMOTIONAL_DAYS: 90,  // 3 months
        STANDARD_DAYS: 30      // 30 days
    } as const,

    STRIPE_PRICE_IDS: {
        PROMOTIONAL: process.env.STRIPE_PROMOTIONAL_PRICE_ID || '',
        STANDARD: process.env.STRIPE_STANDARD_PRICE_ID || ''
    } as const,

    STATUS: {
        ACTIVE: 'active',
        TRIALING: 'trialing',
        PAST_DUE: 'past_due',
        CANCELED: 'canceled',
        UNPAID: 'unpaid',
        INCOMPLETE: 'incomplete'
    } as const
} as const;

export type SubscriptionTier = typeof SUBSCRIPTION_CONFIG.TIERS[keyof typeof SUBSCRIPTION_CONFIG.TIERS];
export type SubscriptionStatus = typeof SUBSCRIPTION_CONFIG.STATUS[keyof typeof SUBSCRIPTION_CONFIG.STATUS];