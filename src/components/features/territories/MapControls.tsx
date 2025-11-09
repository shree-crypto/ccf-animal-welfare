'use client';

import { useMap } from 'react-leaflet';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export function MapControls() {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleFitBounds = () => {
    const bounds = map.getBounds();
    map.fitBounds(bounds);
  };

  return (
    <div
      className="leaflet-top leaflet-left"
      style={{ top: '80px', left: '16px' }}
    >
      <div className="flex flex-col gap-2">
        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-gray-700" />
        </button>

        {/* Fit Bounds */}
        <button
          onClick={handleFitBounds}
          className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Fit to view"
          aria-label="Fit to view"
        >
          <Maximize2 className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
