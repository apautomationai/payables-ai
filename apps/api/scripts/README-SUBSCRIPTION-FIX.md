# Subscription Creation Fix

## Problem
Users registering with registration counts less than `PROMOTIONAL_MAX` or `FREE_MAX` were not getting subscription records created in the database. This caused errors when they tried to access the subscription page after login.

## Root Cause
The subscription creation was failing silently during user registration. The error was being caught and swallowed in the Google OAuth authentication flow, allowing users to be created without subscription records.

## Solution

### 1. Enhanced Error Logging
Added comprehensive logging throughout the subscription creation flow:
- `passport.ts`: Now logs subscription assignment errors with full details
- `registration.service.ts`: Logs registration order and subscription creation success/failure
- `subscription.service.ts`: Logs tier determination, subscription data, and database insertion

### 2. Recovery Mechanism
Added automatic recovery in the subscription controller:
- When a user without a subscription tries to access the subscription page, the system now attempts to create one automatically
- This prevents the "Subscription not found" error and fixes the issue on-the-fly

### 3. Migration Script
Created `fix-missing-subscriptions.ts` to fix existing users who don't have subscriptions.

## How to Use

### Fix Existing Users
Run the migration script to fix users who are already missing subscriptions:

```bash
cd apps/api
npx tsx scripts/fix-missing-subscriptions.ts
```

### Monitor New Registrations
The enhanced logging will now show detailed information about subscription creation:
- Check your application logs for messages starting with 📊, ✅, or ❌
- Any failures will be logged with full error details

### Verify the Fix
1. Register a new user via Google OAuth
2. Check the logs for subscription creation messages
3. Login and navigate to the subscription page
4. The page should load without errors

## Technical Details

### Subscription Creation Flow (New Users)
1. User authenticates via Google OAuth
2. New user record is created in the database
3. `RegistrationService.assignSubscriptionToUser()` is called
4. Registration order is atomically incremented
5. Tier is determined based on registration order:
   - Orders 1-10: Free tier (active status)
   - Orders 11-20: Promotional tier (incomplete status)
   - Orders 21+: Standard tier (incomplete status)
6. Subscription record is created in the database

### Recovery Flow (Existing Users)
1. User tries to access subscription page
2. System checks for existing subscription
3. If not found, calls `assignSubscriptionToExistingUser()` which:
   - Counts how many users were created before this user (by user ID)
   - Uses that count as the registration order (preserves original tier assignment)
   - Creates subscription without incrementing the global counter
4. Returns the subscription data or error

**Key Difference**: Recovery uses user position in database (by ID) rather than incrementing the global counter, preventing duplicate registration orders.

## Configuration
Tier limits are configured in `apps/api/config/subscription.config.ts`:
```typescript
TIER_LIMITS: {
    FREE_MAX: 10,
    PROMOTIONAL_MAX: 20
}
```

## Monitoring
Watch for these log messages:
- `📝 Assigning subscription to user` - Subscription assignment started
- `📊 Creating subscription for user` - Subscription creation in progress
- `✅ Successfully created subscription` - Success
- `❌ Failed to assign subscription` - Error (investigate immediately)
- `⚠️ Subscription not found for user, attempting to create one` - Recovery triggered
