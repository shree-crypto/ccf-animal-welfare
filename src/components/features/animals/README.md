# Animal Gallery Components

This directory contains the public-facing animal gallery interface components for the CCF Animal Welfare website.

## Components

### AnimalCard

A beautiful, animated card component that displays animal summary information with hover effects.

**Features:**

- Profile image with fallback
- Animal name, breed/type, and age
- Location and current feeder information
- Status badge (healthy, needs attention, under treatment)
- Smooth hover animations and transitions
- Responsive design

### AnimalGrid

A responsive grid layout for displaying multiple animal cards.

**Features:**

- Responsive masonry-style grid (1 column mobile, 2 tablet, 3 desktop)
- Staggered animation on load
- Empty state handling
- Optimized for performance

### FilterBar

An interactive filter and search interface for the animal gallery.

**Features:**

- Real-time search by animal name, breed, or location
- Filter by animal type (all, dogs, cats)
- Animated filter buttons
- Mobile-responsive design

### PhotoCarousel

An advanced photo carousel with fullscreen support for animal detail pages.

**Features:**

- Smooth transitions between photos
- Thumbnail navigation strip
- Fullscreen modal view
- Keyboard navigation (arrow keys, escape)
- Touch-friendly controls
- Photo counter display
- Responsive design

## Pages

### /animals

Main animal gallery page with filtering and search functionality.

**Features:**

- Hero section with call-to-action
- Search and filter controls
- Responsive animal grid
- Loading states
- Results counter

### /animals/[id]

Detailed animal profile page with comprehensive information.

**Features:**

- Photo carousel with all animal images
- Detailed animal information card
- Medical history summary
- Status indicators
- Back navigation
- Error handling for missing animals
- Responsive layout (2-column on desktop, stacked on mobile)

## Usage

```tsx
import { AnimalCard, AnimalGrid, FilterBar, PhotoCarousel } from '@/components/features/animals';

// Display a single animal card
<AnimalCard animal={animalData} index={0} />

// Display a grid of animals
<AnimalGrid animals={animalsArray} />

// Add filtering controls
<FilterBar
  searchValue={search}
  selectedType={type}
  onSearchChange={setSearch}
  onTypeFilter={setType}
/>

// Display photo carousel
<PhotoCarousel photos={photoUrls} animalName="Buddy" />
```

## Styling

All components use:

- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn/ui base components
- Responsive design patterns
- Dark mode support

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Screen reader friendly
- High contrast mode compatible
- Touch-optimized for mobile devices
