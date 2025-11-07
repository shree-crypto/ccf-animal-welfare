import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-purple-400/30" />
        </div>
        <p className="text-purple-700 dark:text-purple-300 font-medium text-lg">
          Loading our furry friends...
        </p>
      </div>
    </div>
  );
}
