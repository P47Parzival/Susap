import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // Type assertion to fix API version error
});

// This is your Stripe webhook secret for testing your endpoint locally
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No Stripe signature found' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle successful payment
        // Here you would update the user's subscription status in your database
        console.log('Payment successful for session:', session.id);
        
        // Example: Update user subscription status
        // await updateUserSubscription(session.customer as string, session.subscription as string);
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Handle subscription update
        console.log('Subscription updated:', subscription.id);
        
        // Example: Update user subscription details
        // await updateSubscriptionDetails(subscription.customer as string, subscription);
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Handle subscription cancellation
        console.log('Subscription cancelled:', subscription.id);
        
        // Example: Update user subscription status to cancelled
        // await cancelUserSubscription(subscription.customer as string);
        
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
} 