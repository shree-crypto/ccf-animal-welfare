# Territory Mapping Components

This directory contains components for the Interactive Territory Mapping System, which allows volunteers to visualize animal pack territories and locations on an interactive map.

## Components

### InteractiveMap

The main map component that integrates React Leaflet with OpenStreetMap.

**Features:**

- Displays territory boundaries as colored polygons
- Color-coded by pack size (gray=empty, green=1-3, yellow=4-6, orange=7-10, red=10+)
- Interactive territory selection
- Automatic bounds fitting
- Hover effects on territories
- Optional heatmap overlay

**Props:**

- `territories`: Array of Territory objects to display
- `center`: Map center coordinates (default: IIT Roorkee)
- `zoom`: Initial zoom level (default: 15)
- `showHeatmap`: Toggle heatmap visualization
- `onTerritoryClick`: Callback when territory is clicked

### PackInfo

Side panel that displays detailed information about a selected territory.

**Features:**

- Territory statistics (pack size, animal count)
- Last updated timestamp
- Assigned volunteers list
- Animals in territory with photos and status
- Smooth animations and transitions

**Props:**

- `territory`: Territory object to display
- `onClose`: Callback to close the panel

### TerritoryHeatmap

Heatmap overlay showing pack density visualization.

**Features:**

- Uses leaflet.heat plugin
- Color gradient from blue (low) to red (high)
- Intensity based on pack size
- Configurable radius and blur

**Props:**

- `territories`: Array of Territory objects
- `intensity`: Maximum intensity value (default: 0.5)
- `radius`: Heatmap point radius (default: 25)
- `blur`: Blur amount (default: 15)

### MapControls

Custom map control buttons for zoom and layer management.

**Features:**

- Zoom in/out buttons
- Fit to bounds button
- Layer toggle menu
- Accessible with ARIA labels

## Usage

```tsx
import { InteractiveMap } from '@/components/features/territories';
import { getTerritories } from '@/lib/db/territories';

export default function TerritoriesPage() {
  const [territories, setTerritories] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    getTerritories().then(setTerritories);
  }, []);

  return (
    <div className="h-screen">
      <InteractiveMap
        territories={territories}
        showHeatmap={showHeatmap}
        onTerritoryClick={territory => console.log(territory)}
      />
    </div>
  );
}
```

## Dependencies

- `leaflet`: Core mapping library
- `react-leaflet`: React bindings for Leaflet
- `leaflet.heat`: Heatmap plugin
- `@types/leaflet`: TypeScript definitions
- `@types/leaflet.heat`: TypeScript definitions for heatmap

## Styling

The components use Tailwind CSS for styling and include:

- Responsive design for mobile, tablet, and desktop
- Smooth transitions and hover effects
- Accessible color contrasts
- Loading states and error handling

## Map Configuration

The map uses OpenStreetMap tiles by default. The center is set to IIT Roorkee coordinates (29.8543, 77.8880).

To customize:

```tsx
<InteractiveMap
  center={[latitude, longitude]}
  zoom={15}
  territories={territories}
/>
```

## Requirements Addressed

This implementation addresses the following requirements:

- 2.1: Interactive map with territory boundaries
- 2.2: Heatmap visualization for pack density
- 2.3: Territory click interaction with pack info
- 2.4: Zoom and pan controls
- 2.5: Dynamic territory updates
- 9.3: Mobile-optimized touch interactions
