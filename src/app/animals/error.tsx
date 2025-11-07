'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Animals page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-200 to-pink-200 dark:from-red-900/30 dark:to-pink-900/30">
          <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-md">
            We couldn't load the animals. This might be a temporary issue.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          >
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-2 border-purple-300 dark:border-purple-700"
          >
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-2xl">
            <summary className="cursor-pointer text-sm font-medium text-red-900 dark:text-red-300">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs text-red-800 dark:text-red-400 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
