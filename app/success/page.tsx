"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      setError("No session ID found");
      setIsLoading(false);
      return;
    }

    // Here you would typically verify the session with your backend
    // and update the user's subscription status
    
    // For now, we'll just simulate a successful verification
    const verifySession = async () => {
      try {
        // In a real implementation, you would call your backend API
        // to verify the session and update the user's subscription
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error verifying session:", err);
        setError("Failed to verify payment");
        setIsLoading(false);
      }
    };

    verifySession();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
        <Button onClick={() => router.push("/pricing")}>
          Return to Pricing
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="mb-6 text-gray-300">
          Thank you for your subscription. Your account has been upgraded.
        </p>
        <Button 
          className="w-full" 
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
} 