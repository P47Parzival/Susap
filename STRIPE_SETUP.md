# Stripe Payment Integration Setup

This document provides instructions on how to set up the Stripe payment integration for the Susap AI Mock Interview platform.

## Prerequisites

- A Stripe account (you can sign up at [stripe.com](https://stripe.com))
- Node.js and npm installed
- Access to your project's environment variables

## Setup Steps

### 1. Create a Stripe Account

If you don't already have a Stripe account, create one at [stripe.com](https://stripe.com).

### 2. Get Your API Keys

1. Log in to your Stripe Dashboard
2. Go to Developers > API keys
3. Copy your **Publishable key** and **Secret key**
4. Add them to your `.env.local` file:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   ```

### 3. Create Products and Prices

1. Go to Products in your Stripe Dashboard
2. Create two products:
   - **Better Agent** (₹399/month)
   - **Advance Agent** (₹699/month)
3. For each product, create a recurring price with the appropriate amount
4. Copy the Price IDs and add them to your `.env.local` file:
   ```
   NEXT_PUBLIC_STRIPE_BETTER_AGENT_PRICE_ID=price_your_better_agent_price_id
   NEXT_PUBLIC_STRIPE_ADVANCE_AGENT_PRICE_ID=price_your_advance_agent_price_id
   ```

### 4. Set Up Webhooks

1. Go to Developers > Webhooks in your Stripe Dashboard
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe`
4. Select the following events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the Webhook Signing Secret and add it to your `.env.local` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

### 5. Local Development

For local development, you can use the Stripe CLI to forward webhooks to your local environment:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run the following command:
   ```
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. The CLI will provide a webhook signing secret. Use this for local testing.

### 6. Testing the Integration

1. Start your development server
2. Navigate to the pricing page
3. Click on a subscription plan
4. You should be redirected to the Stripe Checkout page
5. Use Stripe's test card numbers for testing:
   - `4242 4242 4242 4242` (successful payment)
   - `4000 0000 0000 9995` (failed payment)

## Troubleshooting

- **Checkout not working**: Verify your API keys and price IDs
- **Webhooks not receiving events**: Check your webhook URL and signing secret
- **Payment processing errors**: Check the Stripe Dashboard for error logs

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/accept-a-payment)
- [Stripe Webhooks](https://stripe.com/docs/webhooks) 