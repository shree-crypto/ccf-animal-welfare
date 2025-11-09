'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTerritories } from '@/hooks/useTerritories';
import { MapPin, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Dynamically import the map component with no SSR
const InteractiveMap = dynamic(
  () =>
    import('@/components/features/territories').then(mod => ({
      default: mod.InteractiveMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    ),
  }
);

export default function TerritoriesPage() {
  const { territories, loading, error, refetch } = useTerritories();
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading territory map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            <p className="font-medium">{error.message}</p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Territory Map
                  </h1>
                  <p className="text-sm text-gray-600">
                    Interactive map showing animal pack territories and
                    locations
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={e => setShowHeatmap(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Show Heatmap</span>
                </label>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">{territories.length}</span>{' '}
                  territories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {territories.length > 0 ? (
            <InteractiveMap
              territories={territories}
              showHeatmap={showHeatmap}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  No territories found
                </p>
                <p className="text-gray-500 text-sm">
                  Territories will appear here once they are added to the
                  system.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-medium text-gray-700">Pack Size:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-400"></div>
                <span className="text-gray-600">Empty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-gray-600">1-3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span className="text-gray-600">4-6</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span className="text-gray-600">7-10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-gray-600">10+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
