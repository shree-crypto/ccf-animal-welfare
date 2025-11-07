'use client';

import { useMap } from 'react-leaflet';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { useState } from 'react';

export function MapControls() {
  const map = useMap();
  const [showLayerMenu, setShowLayerMenu] = useState(false);

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

  const toggleLayerMenu = () => {
    setShowLayerMenu(!showLayerMenu);
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>

        {/* Fit Bounds */}
        <button
          onClick={handleFitBounds}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Fit to view"
          aria-label="Fit to view"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>

        {/* Layer Control */}
        <button
          onClick={toggleLayerMenu}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Layers"
          aria-label="Toggle layers"
        >
          <Layers className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Layer Menu */}
      {showLayerMenu && (
        <div className="mt-2 bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Map Layers</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Territory Boundaries</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Heatmap</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Animal Markers</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
