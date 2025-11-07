'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Territory } from '@/types/territory';

interface TerritoryHeatmapProps {
  territories: Territory[];
  intensity?: number;
  radius?: number;
  blur?: number;
}

export function TerritoryHeatmap({
  territories,
  intensity = 0.5,
  radius = 25,
  blur = 15,
}: TerritoryHeatmapProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || territories.length === 0) return;

    // Create heatmap data points from territory centers with pack size as intensity
    const heatmapData: [number, number, number][] = territories.map((territory) => {
      // Calculate center of territory
      const lats = territory.boundaries.map((b) => b[0]);
      const lngs = territory.boundaries.map((b) => b[1]);
      const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

      // Use pack size as intensity (normalized)
      const normalizedIntensity = Math.min(territory.packSize / 10, 1);

      return [centerLat, centerLng, normalizedIntensity];
    });

    // Create heatmap layer
    const heatLayer = (L as any).heatLayer(heatmapData, {
      radius,
      blur,
      maxZoom: 17,
      max: intensity,
      gradient: {
        0.0: '#3b82f6', // blue
        0.3: '#22c55e', // green
        0.5: '#eab308', // yellow
        0.7: '#f97316', // orange
        1.0: '#ef4444', // red
      },
    });

    heatLayer.addTo(map);

    // Cleanup
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, territories, intensity, radius, blur]);

  return null;
}
