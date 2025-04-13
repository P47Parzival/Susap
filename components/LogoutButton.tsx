"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/sign-up");
        router.refresh();
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="destructive" 
      className="bg-red-600 hover:bg-red-700"
    >
      Logout
    </Button>
  );
} 