'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTerritories } from '@/hooks/useTerritories';
import { MapPin, Loader2, Info } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    ),
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
        <div className="absolute top-3 left-3 z-[60] bg-background/90 backdrop-blur-md rounded-lg shadow-md px-3 py-2 border border-border/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <h1 className="text-xs font-semibold text-foreground">
                Territory Map
              </h1>
              <p className="text-[10px] text-muted-foreground">
                {territories.length} territories
              </p>
            </div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-3 right-3 z-[60] flex flex-col gap-1.5">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`bg-background/90 backdrop-blur-md rounded-lg shadow-md px-2.5 py-1.5 text-[11px] font-medium transition-all border ${
              showHeatmap
                ? 'text-primary border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground border-border/50 hover:border-border'
            }`}
            aria-label="Toggle heatmap"
          >
            Heatmap
          </button>

          {/* Legend Toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="bg-background/90 backdrop-blur-md rounded-lg shadow-md p-1.5 text-muted-foreground hover:text-foreground transition-colors border border-border/50 hover:border-border"
            aria-label="Toggle legend"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Legend */}
        {showLegend && (
          <div className="absolute bottom-3 left-3 z-[60] bg-background/90 backdrop-blur-md rounded-lg shadow-md p-3 border border-border/50">
            <h3 className="text-[11px] font-semibold text-foreground mb-1.5">
              Pack Size
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-gray-400"></div>
                <span>Empty</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                <span>1-3</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500"></div>
                <span>4-6</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
                <span>7-10</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500"></div>
                <span>10+</span>
              </div>
            </div>
          </div>
        )}

        {/* Full-screen Map */}
        <div className="flex-1 w-full">
          {territories.length > 0 ? (
            <InteractiveMap
              territories={territories}
              showHeatmap={showHeatmap}
            />
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
