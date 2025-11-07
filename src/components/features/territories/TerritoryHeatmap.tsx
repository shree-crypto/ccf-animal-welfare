'use client';

import { useEffect } from 'react';
import { useMap, CircleMarker } from 'react-leaflet';
import { Territory } from '@/types/territory';

interface TerritoryHeatmapProps {
  territories: Territory[];
  intensity?: number;
  radius?: number;
  blur?: number;
}

export function TerritoryHeatmap({
  territories,
}: TerritoryHeatmapProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || territories.length === 0) return;

    console.log('🗺️ Heatmap: Rendering circles for', territories.length, 'territories');
  }, [map, territories]);

  // Get color based on pack size
  const getHeatColor = (packSize: number): string => {
    if (packSize === 0) return '#3b82f6'; // blue
    if (packSize <= 3) return '#22c55e'; // green
    if (packSize <= 6) return '#eab308'; // yellow
    if (packSize <= 10) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // Get radius based on pack size
  const getHeatRadius = (packSize: number): number => {
    return Math.max(20, packSize * 5);
  };

  return (
    <>
      {territories.map((territory) => {
        // Calculate center of territory
        const lats = territory.boundaries.map((b) => b[0]);
        const lngs = territory.boundaries.map((b) => b[1]);
        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

        return (
          <CircleMarker
            key={`heat-${territory.id}`}
            center={[centerLat, centerLng]}
            radius={getHeatRadius(territory.packSize)}
            pathOptions={{
              fillColor: getHeatColor(territory.packSize),
              fillOpacity: 0.4,
              color: getHeatColor(territory.packSize),
              weight: 1,
              opacity: 0.6,
            }}
          />
        );
      })}
    </>
  );
}
