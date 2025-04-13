import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Function to create a checkout session
export const createCheckoutSession = async (priceId: string) => {
  try {
    console.log('Creating checkout session for price ID:', priceId);
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Checkout session creation failed:', errorData);
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const session = await response.json();
    console.log('Checkout session created:', session);
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Function to redirect to checkout
export const redirectToCheckout = async (priceId: string) => {
  try {
    const session = await createCheckoutSession(priceId);
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    
    console.log('Redirecting to checkout with session ID:', session.id);
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
}; 