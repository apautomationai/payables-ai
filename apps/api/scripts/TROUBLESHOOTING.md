# Subscription Creation Troubleshooting Guide

## Quick Diagnosis

If you're seeing errors like "Failed to assign subscription to user X", run the diagnostic script:

```bash
cd apps/api
npx tsx scripts/check-subscription-status.ts 47
```

Replace `47` with the user ID that's failing.

## Common Issues and Solutions

### Issue 1: Duplicate Registration Orders

**Symptom**: Error message contains "unique constraint" or "duplicate key"

**Cause**: Multiple subscriptions trying to use the same registration order

**Solution**:
1. Run the diagnostic script to identify duplicates
2. Manually fix duplicates in the database:
```sql
-- Find duplicates
SELECT registration_order, COUNT(*) 
FROM subscriptions 
GROUP BY registration_order 
HAVING COUNT(*) > 1;

-- Delete duplicates (keep the first one)
DELETE FROM subscriptions 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM subscriptions 
    GROUP BY registration_order
);
```

### Issue 2: User Already Has Subscription

**Symptom**: Error when trying to create subscription for existing user

**Cause**: User already has a subscription record

**Solution**: The system now automatically detects this and returns the existing subscription. No action needed.

### Issue 3: Registration Counter Out of Sync

**Symptom**: Registration orders don't match user creation order

**Cause**: Counter was incremented but subscription creation failed

**Solution**:
1. Run the diagnostic script to see current counter value
2. Reset counter to match actual subscriptions:
```sql
-- Reset counter to highest registration order
UPDATE registration_counter 
SET current_count = (SELECT MAX(registration_order) FROM subscriptions);
```

### Issue 4: Missing Subscriptions for Existing Users

**Symptom**: Users created before fix don't have subscriptions

**Solution**: Run the migration script:
```bash
cd apps/api
npx tsx scripts/fix-missing-subscriptions.ts
```

## Prevention

The following safeguards are now in place:

1. **Duplicate Check**: System checks if registration order is already taken before inserting
2. **Existing Subscription Check**: System checks if user already has subscription before creating
3. **Automatic Recovery**: Subscription page automatically creates missing subscriptions
4. **Enhanced Logging**: All subscription operations are logged with emoji indicators

## Monitoring

Watch your logs for these indicators:

- 🔍 Diagnostic/checking operations
- 📊 Subscription creation started
- 📝 Assignment operations
- 💾 Database operations
- ✅ Success
- ⚠️ Warning (non-critical)
- ❌ Error (needs attention)
- 🔄 Recovery operations

## Manual Database Queries

### Check subscription status for a user
```sql
SELECT s.*, u.email 
FROM subscriptions s 
JOIN users u ON s.user_id = u.id 
WHERE u.id = 47;
```

### Find users without subscriptions
```sql
SELECT u.id, u.email, u.created_at 
FROM users u 
LEFT JOIN subscriptions s ON u.id = s.user_id 
WHERE s.id IS NULL;
```

### Check registration counter
```sql
SELECT * FROM registration_counter;
```

### View all subscriptions with tier distribution
```sql
SELECT tier, COUNT(*) as count 
FROM subscriptions 
GROUP BY tier 
ORDER BY tier;
```

## Getting Help

If issues persist:

1. Run the diagnostic script and save the output
2. Check application logs for error details
3. Run the manual database queries above
4. Check for any database constraints or triggers that might be interfering
