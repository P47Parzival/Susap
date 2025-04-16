"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

const LoadingButton = ({ href, children, className, variant = "default" }: LoadingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(href);
  };

  return (
    <Button
      asChild
      variant={variant}
      className={className}
      disabled={isLoading}
      onClick={handleClick}
    >
      <Link href={href}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          children
        )}
      </Link>
    </Button>
  );
};

export default LoadingButton; 