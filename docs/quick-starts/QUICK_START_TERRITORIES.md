# Quick Start: Territory Mapping System

This guide will help you get started with the interactive territory mapping system.

## Overview

The territory mapping system provides:
- Interactive map of campus territories
- Pack location visualization
- Territory boundaries and heatmaps
- Animal distribution tracking
- Sighting reports
- Territory analytics

## Prerequisites

- Volunteer or Admin role
- Logged in to the application
- Territories and packs configured in database

## Accessing Territory Maps

1. Navigate to `/territories` from the dashboard
2. Or click "Territories" in the navigation menu
3. You'll see the interactive map interface

## Map Interface Overview

### Main Map

- Interactive OpenStreetMap
- Zoom and pan controls
- Territory boundaries displayed
- Pack markers with icons
- Heatmap overlay option

### Map Controls

- **Zoom In/Out**: +/- buttons or scroll wheel
- **Reset View**: Center on campus
- **Layer Toggle**: Switch between views
- **Heatmap Toggle**: Show/hide density overlay

### Pack Info Panel

- Selected pack details
- Pack members list
- Territory information
- Recent sightings
- Quick actions

## Viewing Territories

### Territory Boundaries

- Color-coded by pack
- Polygon overlays on map
- Click to select territory
- Shows territory name and area

### Pack Markers

- Icon markers for each pack
- Color matches territory
- Shows pack size
- Click for details

### Heatmap View

- Density visualization
- Shows animal concentration
- Color gradient (blue to red)
- Helps identify hotspots

## Pack Information

### Pack Details

When you click a pack marker:
- **Pack Name**: Identifier
- **Territory**: Associated area
- **Member Count**: Number of animals
- **Alpha**: Pack leader (if applicable)
- **Status**: Active, Monitoring, Relocated

### Pack Members

- List of all animals in pack
- Photos and names
- Age and health status
- Click to view animal profile

### Territory Stats

- Territory size (sq meters)
- Boundary coordinates
- Overlap with other territories
- Resource locations (food, water, shelter)

## Recording Sightings

### Adding a Sighting

1. Click location on map
2. Click "Report Sighting" button
3. Fill in sighting form:
   - Animal or pack
   - Date and time
   - Number of animals
   - Behavior observed
   - Notes
4. Click "Submit Sighting"

### Sighting Information

**Required:**
- Location (from map click)
- Date and time
- Animal or pack ID

**Optional:**
- Number of animals seen
- Behavior description
- Photos
- Observer name
- Weather conditions

### Viewing Sightings

- Sighting markers on map
- Filter by date range
- Filter by animal/pack
- Click marker for details
- Export sighting data

## Map Layers

### Base Layer

- OpenStreetMap tiles
- Campus buildings and roads
- Natural features
- Labels and landmarks

### Territory Layer

- Pack territories
- Boundary polygons
- Color-coded areas
- Territory names

### Heatmap Layer

- Animal density
- Sighting frequency
- Color gradient
- Adjustable intensity

### Marker Layer

- Pack locations
- Individual animals
- Sighting points
- Resource locations

## Map Controls

### Navigation

**Mouse:**
- Click and drag to pan
- Scroll wheel to zoom
- Double-click to zoom in

**Touch:**
- Swipe to pan
- Pinch to zoom
- Tap to select

**Keyboard:**
- Arrow keys to pan
- +/- to zoom
- Space to reset view

### Layer Controls

**Toggle Layers:**
- Territories on/off
- Heatmap on/off
- Markers on/off
- Labels on/off

**Adjust Opacity:**
- Territory transparency
- Heatmap intensity
- Marker size

### Search and Filter

**Search:**
- Find pack by name
- Find animal by name
- Find territory by area
- Search sightings

**Filter:**
- By pack status
- By date range
- By animal type
- By territory

## Territory Management (Admin)

### Creating Territories

1. Click "Add Territory" button
2. Draw boundary on map:
   - Click to add points
   - Double-click to finish
   - Drag points to adjust
3. Fill in territory details:
   - Name
   - Pack ID
   - Description
   - Status
4. Click "Save Territory"

### Editing Territories

1. Select territory on map
2. Click "Edit Territory"
3. Modify boundary or details
4. Click "Update Territory"

### Deleting Territories

1. Select territory
2. Click "Delete Territory"
3. Confirm deletion
4. Territory removed from map

## Pack Management (Admin)

### Creating Packs

1. Click "Add Pack" button
2. Fill in pack details:
   - Name
   - Territory
   - Alpha animal
   - Status
3. Add pack members
4. Click "Create Pack"

### Updating Packs

1. Click pack marker
2. Click "Edit Pack"
3. Update information:
   - Add/remove members
   - Change territory
   - Update status
4. Click "Save Changes"

### Pack Status

- **Active**: Normal pack activity
- **Monitoring**: Under observation
- **Relocated**: Moved to new area
- **Disbanded**: Pack no longer exists

## Territory Analytics

### Statistics

- Total territories
- Total packs
- Total animals in territories
- Average pack size
- Territory coverage

### Trends

- Pack movement over time
- Territory expansion/contraction
- Sighting frequency
- Seasonal patterns

### Reports

- Territory utilization
- Pack dynamics
- Resource distribution
- Conflict zones

## Heatmap Features

### Density Visualization

- Shows animal concentration
- Based on sighting data
- Updates in real-time
- Helps identify patterns

### Intensity Levels

- **Blue**: Low density
- **Green**: Medium density
- **Yellow**: High density
- **Red**: Very high density

### Adjusting Heatmap

- Radius slider
- Intensity slider
- Blur slider
- Opacity control

## Best Practices

### Recording Sightings

- Report sightings promptly
- Include accurate location
- Note behavior and context
- Add photos when possible
- Record time of day

### Territory Monitoring

- Regular patrols
- Document changes
- Update boundaries as needed
- Track pack movements
- Report conflicts

### Data Quality

- Verify sighting accuracy
- Remove duplicate entries
- Update outdated information
- Maintain consistent naming
- Regular data cleanup

## Troubleshooting

### Map Not Loading

- Check internet connection
- Refresh the page
- Clear browser cache
- Try different browser
- Check console for errors

### Territories Not Showing

- Verify territories exist in database
- Check layer toggle is on
- Zoom to appropriate level
- Refresh territory data
- Check permissions

### Can't Add Sighting

- Ensure location is selected
- Check all required fields
- Verify date/time is valid
- Check network connection
- Try again after refresh

### Heatmap Not Displaying

- Ensure sighting data exists
- Toggle heatmap layer on
- Adjust intensity settings
- Check date range filter
- Refresh the page

## Mobile Usage

- Responsive map interface
- Touch-friendly controls
- GPS location support
- Quick sighting reports
- Offline map caching (coming soon)

## Integration with Other Features

### Animals

- View animal's territory
- Track animal movements
- Link sightings to profiles
- Monitor pack membership

### Tasks

- Territory-based task assignment
- Patrol route planning
- Resource distribution
- Monitoring schedules

### Medical Records

- Territory-specific health trends
- Disease outbreak tracking
- Vaccination coverage
- Emergency response planning

## Advanced Features

### Custom Markers

- Add custom locations
- Mark resources (food, water)
- Identify hazards
- Note landmarks

### Route Planning

- Plan patrol routes
- Optimize feeding schedules
- Emergency access routes
- Volunteer assignments

### Data Export

- Export territory boundaries (GeoJSON)
- Export sighting data (CSV)
- Generate reports (PDF)
- Share with stakeholders

## Next Steps

- [Task Management](./QUICK_START_TASKS.md)
- [Animal Profiles](./QUICK_START_ADMIN_ANIMALS.md)
- [Medical Records](./QUICK_START_MEDICAL.md)

## Additional Resources

- [Territory Component Documentation](../src/components/features/territories/README.md)
- [Territory Data Models](../src/types/territory.ts)
- [Database Operations](../src/lib/db/territories.ts)
- [Territory Map Guide](./TERRITORY_MAP_GUIDE.md)
- [Seed Territories Script](../src/lib/db/seed-territories.ts)
