'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTerritories } from '@/hooks/useTerritories';
import { MapPin, Loader2, Info } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Dynamically import the map component with no SSR
const InteractiveMap = dynamic(
  () => import('@/components/features/territories').then(mod => ({ default: mod.InteractiveMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    )
  }
);

export default function TerritoriesPage() {
  const { territories, loading, error, refetch } = useTerritories();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            <p className="text-sm">{error.message}</p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 flex flex-col">
        {/* Minimal Floating Title */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-700" />
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Territory Map</h1>
              <p className="text-xs text-gray-600">{territories.length} territories</p>
            </div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 text-xs font-medium transition-colors ${
              showHeatmap
                ? 'text-blue-600 border-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Heatmap
          </button>

          {/* Legend Toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Toggle legend"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Legend */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Pack Size</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-gray-400"></div>
                <span>Empty</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>1-3</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span>4-6</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span>7-10</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>10+</span>
              </div>
            </div>
          </div>
        )}

        {/* Full-screen Map */}
        <div className="flex-1 w-full">
          {territories.length > 0 ? (
            <InteractiveMap territories={territories} showHeatmap={showHeatmap} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No territories found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
