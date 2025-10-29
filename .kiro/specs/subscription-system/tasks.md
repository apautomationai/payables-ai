# Implementation Plan

- [x] 1. Set up database schema and models
  - Create subscription table with proper indexes and constraints
  - Create registration counter table for sequential order assignment
  - Define Drizzle ORM models for subscriptions and registration counter
  - _Requirements: 1.1, 1.5_

- [x] 2. Implement core subscription service
  - [x] 2.1 Create subscription configuration constants
    - Define tier limits, pricing, and trial periods
    - Set up Stripe price IDs and environment variables
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 2.2 Implement tier determination logic
    - Write function to determine tier based on registration order
    - Implement trial period calculation for each tier
    - Create access control validation methods
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 2.3 Build subscription CRUD operations
    - Create subscription creation with tier assignment
    - Implement subscription status updates
    - Add subscription retrieval by user ID
    - _Requirements: 1.1, 1.5_

- [x] 3. Implement registration order service
  - [x] 3.1 Create registration counter management
    - Implement atomic counter increment for registration order
    - Add fallback logic for counter initialization
    - Handle concurrent registration scenarios
    - _Requirements: 1.1_

  - [x] 3.2 Integrate with user registration
    - Modify user service to assign subscription on registration
    - Ensure subscription creation doesn't break user signup
    - Add error handling for subscription assignment failures
    - _Requirements: 1.1_

- [x] 4. Build Stripe integration service
  - [x] 4.1 Implement Stripe customer management
    - Create Stripe customers for new subscriptions
    - Store and retrieve Stripe customer IDs
    - Handle customer creation errors gracefully
    - _Requirements: 2.4, 3.4, 5.1_

  - [x] 4.2 Create checkout session functionality
    - Build tier-specific checkout session creation
    - Configure proper trial periods in Stripe
    - Set up success and cancel URLs
    - _Requirements: 2.4, 3.4_

  - [x] 4.3 Implement customer portal integration
    - Create customer portal sessions for subscription management
    - Configure portal settings for subscription changes
    - Handle portal access errors
    - _Requirements: 5.1_

- [x] 5. Develop subscription API endpoints
  - [x] 5.1 Create subscription status endpoint
    - Return current subscription details and tier information
    - Include trial status and days remaining
    - Show payment requirements and access status
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 5.2 Build checkout session creation endpoint
    - Create Stripe checkout sessions for tier-appropriate pricing
    - Handle existing customers and new customer creation
    - Return checkout URL for frontend redirection
    - _Requirements: 2.4, 3.4_

  - [x] 5.3 Implement customer portal endpoint
    - Generate Stripe customer portal URLs
    - Validate user access to portal
    - Handle portal creation errors
    - _Requirements: 5.1_

- [x] 6. Create webhook handling system
  - [x] 6.1 Implement Stripe webhook processing
    - Validate webhook signatures for security
    - Handle subscription created/updated events
    - Process payment succeeded/failed events
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [x] 6.2 Build subscription status synchronization
    - Update local subscription status from Stripe events
    - Handle subscription cancellations and renewals
    - Maintain data consistency between Stripe and database
    - _Requirements: 5.2, 5.3, 5.5_

- [x] 7. Develop frontend subscription component
  - [x] 7.1 Create subscription tab for profile page
    - Build subscription information display component
    - Show tier, status, trial information, and pricing
    - Add loading and error states for API calls
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 7.2 Implement subscription management actions
    - Add subscribe button for users requiring payment
    - Create manage subscription button linking to Stripe portal
    - Handle checkout and portal redirection
    - _Requirements: 5.1, 2.4, 3.4_

  - [x] 7.3 Integrate subscription tab with profile page
    - Add subscription tab to existing profile tabs
    - Ensure proper authentication and data fetching
    - Style consistently with existing profile components
    - _Requirements: 4.1_

- [x] 8. Add access control middleware
  - [x] 8.1 Create subscription access validation
    - Build middleware to check subscription status on protected routes
    - Implement trial period validation
    - Add grace period handling for payment failures
    - _Requirements: 2.2, 3.2_

  - [x] 8.2 Integrate access control with existing routes
    - Apply subscription checks to relevant API endpoints
    - Ensure free tier users maintain access
    - Handle access denied scenarios gracefully
    - _Requirements: 2.2, 3.2_

- [ ]* 9. Testing and validation
  - [ ]* 9.1 Write unit tests for subscription logic
    - Test tier determination algorithms
    - Validate trial period calculations
    - Test access control validation
    - _Requirements: 1.2, 1.3, 1.4, 2.2, 3.2_

  - [ ]* 9.2 Create integration tests for Stripe workflows
    - Test checkout session creation and completion
    - Validate webhook processing and status updates
    - Test customer portal functionality
    - _Requirements: 2.4, 3.4, 5.1, 5.2, 5.3_

  - [ ]* 9.3 Add end-to-end subscription flow tests
    - Test complete user registration to payment flow
    - Validate subscription management through profile page
    - Test trial expiration and payment requirement scenarios
    - _Requirements: 1.1, 4.1, 5.1_