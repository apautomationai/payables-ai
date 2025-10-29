// Script to help set up ngrok webhook
require('dotenv').config();

async function setupNgrokWebhook() {
  console.log('🌐 Setting up Webhook with ngrok\n');
  
  console.log('📋 Steps to set up webhook:');
  console.log('1. Install ngrok: https://ngrok.com/download');
  console.log('2. Run: ngrok http 5001');
  console.log('3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)');
  console.log('4. Go to Stripe Dashboard: https://dashboard.stripe.com/test/webhooks');
  console.log('5. Click "Add endpoint"');
  console.log('6. Endpoint URL: https://YOUR_NGROK_URL.ngrok.io/api/v1/subscription/webhook');
  console.log('7. Select these events:');
  console.log('   - customer.subscription.created');
  console.log('   - customer.subscription.updated');
  console.log('   - customer.subscription.deleted');
  console.log('   - invoice.payment_succeeded');
  console.log('   - invoice.payment_failed');
  console.log('   - checkout.session.completed');
  console.log('8. Click "Add endpoint"');
  console.log('9. Copy the webhook secret (starts with whsec_)');
  console.log('10. Update STRIPE_WEBHOOK_SECRET in your .env file');
  
  console.log('\n🔧 Alternative: Test with Stripe CLI');
  console.log('1. Install Stripe CLI: https://stripe.com/docs/stripe-cli');
  console.log('2. Run: stripe login');
  console.log('3. Run: stripe listen --forward-to localhost:5001/api/v1/subscription/webhook');
  console.log('4. Copy the webhook secret from the CLI output');
  console.log('5. Update STRIPE_WEBHOOK_SECRET in your .env file');
  
  console.log('\n📝 Current webhook endpoint in your API:');
  console.log('POST /api/v1/subscription/webhook');
  console.log('This endpoint is ready to receive Stripe webhooks.');
}

setupNgrokWebhook();