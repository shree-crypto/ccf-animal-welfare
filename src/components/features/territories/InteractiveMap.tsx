'use client';

import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Territory } from '@/types/territory';
import { PackInfo } from '@/components/features/territories/PackInfo';
import { MapControls } from '@/components/features/territories/MapControls';
import { TerritoryHeatmap } from '@/components/features/territories/TerritoryHeatmap';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface InteractiveMapProps {
  territories: Territory[];
  center?: [number, number];
  zoom?: number;
  showHeatmap?: boolean;
  onTerritoryClick?: (territory: Territory) => void;
}

// Component to handle map events and selected territory
function MapEventHandler({
  territories,
  onTerritorySelect,
}: {
  territories: Territory[];
  onTerritorySelect: (territory: Territory | null) => void;
}) {
  useMapEvents({
    click: () => {
      onTerritorySelect(null);
    },
  });

  return null;
}

// Component to fit map bounds to territories
function FitBounds({ territories }: { territories: Territory[] }) {
  const map = useMap();

  useEffect(() => {
    if (territories.length > 0) {
      const allPoints = territories.flatMap(t => t.boundaries);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints as [number, number][]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [territories, map]);

  return null;
}

export function InteractiveMap({
  territories,
  center = [29.8543, 77.888], // IIT Roorkee coordinates
  zoom = 15,
  showHeatmap = false,
  onTerritoryClick,
}: InteractiveMapProps) {
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('🗺️ Map mounted with', territories.length, 'territories');
  }, [territories.length]);

  const handleTerritoryClick = (territory: Territory) => {
    setSelectedTerritory(territory);
    onTerritoryClick?.(territory);
  };

  const handleClosePackInfo = () => {
    setSelectedTerritory(null);
  };

  // Get color based on pack size - more subtle colors
  const getTerritoryColor = (packSize: number): string => {
    if (packSize === 0) return '#9ca3af'; // gray-400
    if (packSize <= 3) return '#34d399'; // green-400
    if (packSize <= 6) return '#fbbf24'; // yellow-400
    if (packSize <= 10) return '#fb923c'; // orange-400
    return '#f87171'; // red-400
  };

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (territories.length === 0) {
    console.warn('⚠️ No territories to display on map');
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full z-0"
        scrollWheelZoom={true}
        style={{ minHeight: '500px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds territories={territories} />
        <MapEventHandler
          territories={territories}
          onTerritorySelect={setSelectedTerritory}
        />

        {/* Territory polygons */}
        {territories.map(territory => (
          <Polygon
            key={territory.id}
            positions={territory.boundaries as [number, number][]}
            pathOptions={{
              color: getTerritoryColor(territory.packSize),
              fillColor: getTerritoryColor(territory.packSize),
              fillOpacity: 0.2,
              weight: 1.5,
            }}
            eventHandlers={{
              click: e => {
                L.DomEvent.stopPropagation(e);
                handleTerritoryClick(territory);
              },
              mouseover: e => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.4,
                  weight: 2,
                });
              },
              mouseout: e => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.2,
                  weight: 1.5,
                });
              },
            }}
          />
        ))}

        {/* Heatmap overlay */}
        {showHeatmap && <TerritoryHeatmap territories={territories} />}

        {/* Map controls */}
        <MapControls />
      </MapContainer>

      {/* Pack info panel */}
      {selectedTerritory && (
        <PackInfo territory={selectedTerritory} onClose={handleClosePackInfo} />
      )}
    </div>
  );
}
