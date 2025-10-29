# Subscription System Design

## Overview

The subscription system implements a tiered pricing model with automatic tier assignment based on user registration order. It integrates with Stripe for payment processing and provides a clean separation between user data and subscription data through dedicated schemas.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Stripe API    │
│                 │    │                 │    │                 │
│ Profile Page    │◄──►│ Subscription    │◄──►│ Checkout &      │
│ Subscription    │    │ Controller      │    │ Customer Portal │
│ Tab             │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │                 │
                       │ Users Table     │
                       │ Subscriptions   │
                       │ Table           │
                       └─────────────────┘
```

### Component Interaction Flow

1. **User Registration**: User signs up → Registration service assigns order → Subscription service creates subscription record (no payment required initially)
2. **Subscription Display**: Profile page → Subscription API → Database → Display tier info and trial requirements
3. **Trial Setup Flow**: User clicks subscribe → Stripe checkout with trial → Payment method stored → Trial starts → Webhook updates status
4. **Trial Management**: User manages subscription → Stripe customer portal → Webhook syncs changes
5. **Trial Expiration**: Trial ends → Stripe automatically charges → Webhook updates billing status

## Components and Interfaces

### Database Schema

#### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  registration_order INTEGER UNIQUE NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'promotional', 'standard')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid')),
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE UNIQUE INDEX idx_subscriptions_registration_order ON subscriptions(registration_order);
```

#### Registration Counter Table
```sql
CREATE TABLE registration_counter (
  id SERIAL PRIMARY KEY,
  current_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO registration_counter (current_count) VALUES (0);
```

### API Endpoints

#### Subscription Controller
```typescript
interface SubscriptionController {
  // GET /api/v1/subscription/status
  getSubscriptionStatus(req: AuthenticatedRequest, res: Response): Promise<void>
  
  // POST /api/v1/subscription/create-checkout
  createCheckoutSession(req: AuthenticatedRequest, res: Response): Promise<void>
  
  // POST /api/v1/subscription/create-portal
  createCustomerPortal(req: AuthenticatedRequest, res: Response): Promise<void>
  
  // POST /api/v1/subscription/webhook
  handleStripeWebhook(req: Request, res: Response): Promise<void>
}
```

#### API Response Formats
```typescript
interface SubscriptionStatus {
  tier: 'free' | 'promotional' | 'standard'
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete'
  registrationOrder: number
  trialStart?: string
  trialEnd?: string
  daysRemaining?: number
  monthlyPrice: number
  requiresPaymentSetup: boolean  // true if user needs to add payment method to start trial
  hasPaymentMethod: boolean      // true if payment method is on file
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

interface CheckoutSession {
  sessionId: string
  url: string
}

interface CustomerPortal {
  url: string
}
```

### Service Layer

#### Subscription Service
```typescript
interface SubscriptionService {
  // Core subscription management
  createSubscription(userId: number, registrationOrder: number): Promise<Subscription>
  getSubscriptionByUserId(userId: number): Promise<Subscription | null>
  updateSubscriptionStatus(subscriptionId: number, status: string): Promise<void>
  
  // Tier logic
  determineTier(registrationOrder: number): 'free' | 'promotional' | 'standard'
  calculateTrialEnd(tier: string, startDate: Date): Date | null
  hasActiveAccess(subscription: Subscription): boolean
  
  // Stripe integration
  createStripeCustomer(userId: number): Promise<string>
  createCheckoutSession(subscription: Subscription): Promise<string>
  createCustomerPortalSession(customerId: string): Promise<string>
}
```

#### Registration Service
```typescript
interface RegistrationService {
  getNextRegistrationOrder(): Promise<number>
  assignSubscriptionToUser(userId: number): Promise<void>
}
```

### Frontend Components

#### Subscription Tab Component
```typescript
interface SubscriptionTabProps {
  // No props needed - fetches data internally
}

interface SubscriptionTabState {
  subscription: SubscriptionStatus | null
  loading: boolean
  error: string | null
}
```

## Data Models

### Subscription Model (Drizzle ORM)
```typescript
export const subscriptionsTable = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  registrationOrder: integer('registration_order').notNull().unique(),
  tier: varchar('tier', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
```

### Configuration
```typescript
export const SUBSCRIPTION_CONFIG = {
  TIERS: {
    FREE: 'free',
    PROMOTIONAL: 'promotional', 
    STANDARD: 'standard'
  },
  TIER_LIMITS: {
    FREE_MAX: 10,
    PROMOTIONAL_MAX: 20
  },
  PRICING: {
    PROMOTIONAL_MONTHLY: 19900, // $199.00 in cents
    STANDARD_MONTHLY: 29900     // $299.00 in cents
  },
  TRIALS: {
    PROMOTIONAL_DAYS: 90,  // 3 months
    STANDARD_DAYS: 30      // 30 days
  }
} as const
```

## Error Handling

### Error Types
- `SubscriptionNotFoundError`: When user subscription doesn't exist
- `InvalidTierError`: When tier assignment fails
- `StripeError`: When Stripe API calls fail
- `PaymentRequiredError`: When access is denied due to payment

### Error Responses
```typescript
interface ErrorResponse {
  error: string
  message: string
  code?: string
}
```

### Retry Logic
- Stripe API calls: 3 retries with exponential backoff
- Webhook processing: 5 retries with dead letter queue
- Database operations: 2 retries for transient failures

## Testing Strategy

### Unit Tests
- Subscription service tier determination logic
- Trial period calculations
- Access control validation
- Stripe integration mocking

### Integration Tests
- Full subscription creation flow
- Webhook processing end-to-end
- Payment flow with Stripe test mode
- Database transaction integrity

### API Tests
- All subscription endpoints
- Authentication and authorization
- Error handling scenarios
- Webhook signature validation

### Frontend Tests
- Subscription tab component rendering
- Loading and error states
- User interaction flows
- API integration mocking

## Security Considerations

### Authentication
- All subscription endpoints require valid JWT
- User can only access their own subscription data
- Webhook endpoints validate Stripe signatures

### Data Protection
- Stripe customer IDs encrypted at rest
- PCI compliance through Stripe hosted pages
- No sensitive payment data stored locally

### Access Control
- Subscription status checked on protected routes
- Trial expiration enforced server-side
- Grace period for payment failures

## Performance Considerations

### Database Optimization
- Indexed foreign keys and lookup columns
- Efficient queries for subscription status checks
- Connection pooling for high concurrency

### Caching Strategy
- Subscription status cached for 5 minutes
- Stripe price data cached for 1 hour
- Registration counter cached with invalidation

### Monitoring
- Subscription creation success rates
- Payment failure rates and reasons
- API response times and error rates
- Webhook processing delays