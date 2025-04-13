import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Price IDs for different plans
const PRICE_IDS = {
  betterAgent: process.env.NEXT_PUBLIC_STRIPE_BETTER_AGENT_PRICE_ID!,
  advanceAgent: process.env.NEXT_PUBLIC_STRIPE_ADVANCE_AGENT_PRICE_ID!,
};

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();
    console.log('Received priceId:', priceId);
    console.log('Available price IDs:', PRICE_IDS);

    // Validate price ID
    if (!priceId) {
      console.error('No price ID provided');
      return NextResponse.json(
        { error: 'No price ID provided' },
        { status: 400 }
      );
    }

    if (!Object.values(PRICE_IDS).includes(priceId)) {
      console.error('Invalid price ID:', priceId);
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    });

    console.log('Checkout session created:', session.id);
    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 