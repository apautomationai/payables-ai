export interface SubscriptionStatus {
    tier: 'free' | 'promotional' | 'standard';
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
    registrationOrder: number;
    trialStart?: string;
    trialEnd?: string;
    daysRemaining?: number;
    monthlyPrice: number;
    requiresPaymentSetup: boolean;  // true if user needs to add payment method to start trial
    hasPaymentMethod: boolean;      // true if payment method is on file
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}

export interface CheckoutSession {
    sessionId: string;
    url: string;
}

export interface CustomerPortal {
    url: string;
}