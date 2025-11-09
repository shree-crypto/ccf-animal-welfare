'use client';

import { useState } from 'react';
import { AlertTriangle, Eye, EyeOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DevModeBannerProps {
  onToggleCredentials: (show: boolean) => void;
  showCredentials: boolean;
}

export function DevModeBanner({ onToggleCredentials, showCredentials }: DevModeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 text-sm font-medium"
        aria-label="Show development mode banner"
      >
        <AlertTriangle className="h-4 w-4" />
        Dev Mode
      </button>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full flex-shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base">Development Mode</h3>
              <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                Using mock authentication. Credentials are for testing only.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onToggleCredentials(!showCredentials)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-2",
                showCredentials
                  ? "bg-white/20 hover:bg-white/30"
                  : "bg-white/10 hover:bg-white/20"
              )}
              aria-label={showCredentials ? "Hide credentials" : "Show credentials"}
            >
              {showCredentials ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Hide</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Show</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
