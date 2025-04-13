import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/actions/auth.action";
import PricingCards from "@/components/PricingCards";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">Susap</h2>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="bg-white/10 hover:bg-white/20">
            <Link href="/pricing">Review Pricing</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/10 hover:bg-white/20">
            <Link href="/profile">My Profile</Link>
          </Button>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
