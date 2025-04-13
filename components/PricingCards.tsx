"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { redirectToCheckout } from "@/lib/stripe";
import { Loader2 } from "lucide-react";

const PricingCards = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    try {
      setLoading(plan);
      
      // Map plan names to price IDs
      const priceIdMap: Record<string, string> = {
        betterAgent: process.env.NEXT_PUBLIC_STRIPE_BETTER_AGENT_PRICE_ID!,
        advanceAgent: process.env.NEXT_PUBLIC_STRIPE_ADVANCE_AGENT_PRICE_ID!,
      };
      
      const priceId = priceIdMap[plan];
      console.log('Selected plan:', plan);
      console.log('Price ID:', priceId);
      
      if (!priceId) {
        console.error(`No price ID found for plan: ${plan}`);
        return;
      }
      
      await redirectToCheckout(priceId);
    } catch (error) {
      console.error(`Error subscribing to ${plan}:`, error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-8 rounded-lg max-w-5xl w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">₹0</div>
              <ul className="space-y-2">
                <li>✓ Basic interview practice</li>
                <li>✓ Limited sessions per month</li>
                <li>✓ Standard response time</li>
                <li>✓ Basic feedback</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Get Started</Button>
            </CardFooter>
          </Card>

          {/* Better Agent Plan */}
          <Card className="flex flex-col border-primary">
            <CardHeader>
              <CardTitle>Better Agent</CardTitle>
              <CardDescription>For serious candidates</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">$4.99</div>
              <ul className="space-y-2">
                <li>✓ Advanced interview practice</li>
                <li>✓ Unlimited sessions</li>
                <li>✓ Faster response time</li>
                <li>✓ Detailed feedback</li>
                <li>✓ Industry-specific questions</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe('betterAgent')}
                disabled={loading === 'betterAgent'}
              >
                {loading === 'betterAgent' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Advance Agent Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Advance Agent</CardTitle>
              <CardDescription>For professionals</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">$8.99</div>
              <ul className="space-y-2">
                <li>✓ Premium interview practice</li>
                <li>✓ Unlimited sessions</li>
                <li>✓ Instant response time</li>
                <li>✓ Comprehensive feedback</li>
                <li>✓ Custom question sets</li>
                <li>✓ Priority support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleSubscribe('advanceAgent')}
                disabled={loading === 'advanceAgent'}
              >
                {loading === 'advanceAgent' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingCards; 