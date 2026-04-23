"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-black dark:text-white">Something went wrong!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered an unexpected error in the dashboard. Our team has been notified.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          className="bg-primary hover:bg-primary/90 flex gap-2 h-12 px-8 rounded-xl font-bold"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button 
            variant="outline"
            className="flex gap-2 h-12 px-8 rounded-xl font-bold border-gray-200 dark:border-white/10"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </Link>
      </div>
      
      {error.digest && (
        <p className="text-xs text-gray-400 font-mono">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
