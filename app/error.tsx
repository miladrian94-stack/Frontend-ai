'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <div className="p-6 rounded-full bg-red-500/10">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Something Went Wrong
        </h1>
        <p className="text-gray-400 mb-2">
          We encountered an unexpected error. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-gray-600 text-sm mb-8">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
