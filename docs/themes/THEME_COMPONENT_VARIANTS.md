# Theme Component Variants

This document describes the theme-aware variants for UI components in CampusPaws. All components automatically adapt their styling based on the active theme (custom or default).

## Overview

The theme system provides two distinct visual experiences:

- **Custom Theme**: Vibrant gradients, shadows, and animations for an engaging, modern look
- **Default Theme**: Clean, minimal styling with solid colors for a professional appearance

## Button Component

### Variants

#### `default` (Primary)

- **Custom Theme**: Blue gradient with hover shadow and lift effect
- **Default Theme**: Solid blue background with subtle hover darkening

```tsx
<Button>Primary Action</Button>
<Button variant="default">Primary Action</Button>
```

#### `secondary`

- **Custom Theme**: Green gradient with hover shadow and lift effect
- **Default Theme**: Solid gray background with subtle hover darkening

```tsx
<Button variant="secondary">Secondary Action</Button>
```

#### `accent`

- **Custom Theme**: Orange gradient with hover shadow and lift effect
- **Default Theme**: Solid indigo background with subtle hover darkening

```tsx
<Button variant="accent">Accent Action</Button>
```

#### `destructive`

- **Both Themes**: Red background (same styling in both themes)

```tsx
<Button variant="destructive">Delete</Button>
```

#### `outline`

- **Both Themes**: Transparent background with border (same styling in both themes)

```tsx
<Button variant="outline">Outline</Button>
```

#### `ghost`

- **Both Themes**: Transparent background, hover accent (same styling in both themes)

```tsx
<Button variant="ghost">Ghost</Button>
```

#### `link`

- **Both Themes**: Text-only with underline on hover (same styling in both themes)

```tsx
<Button variant="link">Link</Button>
```

### Sizes

All button variants support these sizes:

- `sm`: 40px height (close to minimum touch target)
- `default`: 44px height (recommended touch target)
- `lg`: 48px height (comfortable touch target)
- `icon`: 44x44px (square for icon buttons)

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Custom Theme Effects

In the custom theme, primary, secondary, and accent buttons feature:

- Gradient backgrounds (light to dark)
- Hover effects:
  - Darker gradient
  - Shadow with theme color
  - Slight upward translation (-2px)
- Smooth transitions (300ms)

### Default Theme Effects

In the default theme, buttons feature:

- Solid color backgrounds
- Hover effects:
  - Slightly darker background
  - No shadows or transforms
- Quick transitions (200ms)

## Card Component

### Variants

#### `default`

- **Custom Theme**: Gradient background with colored border and shadow
- **Default Theme**: White background with simple gray border

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

#### `elevated`

- **Custom Theme**: Subtle gradient with prominent shadow
- **Default Theme**: White background with larger shadow

```tsx
<Card variant="elevated">{/* Content */}</Card>
```

#### `outline`

- **Custom Theme**: Transparent background with gradient border
- **Default Theme**: Transparent background with solid border

```tsx
<Card variant="outline">{/* Content */}</Card>
```

#### `ghost`

- **Both Themes**: Completely transparent (no border or background)

```tsx
<Card variant="ghost">{/* Content */}</Card>
```

### Custom Theme Effects

In the custom theme, cards feature:

- Gradient backgrounds (blue to green tint)
- Colored borders with transparency
- Hover effects:
  - Stronger border color
  - Larger shadow
  - Upward translation (-4px for default, -2px for elevated)
- Smooth transitions (300ms)

### Default Theme Effects

In the default theme, cards feature:

- Solid white background (or dark gray in dark mode)
- Simple gray borders
- Hover effects:
  - Slightly darker border
  - Slightly larger shadow
  - No transforms
- Quick transitions (200ms)

## Badge Component

### Variants

#### `default` (Primary)

- **Custom Theme**: Blue gradient with shadow
- **Default Theme**: Solid blue background

```tsx
<Badge>Default</Badge>
<Badge variant="default">Default</Badge>
```

#### `secondary`

- **Custom Theme**: Green gradient with shadow
- **Default Theme**: Solid gray background

```tsx
<Badge variant="secondary">Secondary</Badge>
```

#### `accent`

- **Custom Theme**: Orange gradient with shadow
- **Default Theme**: Solid indigo background

```tsx
<Badge variant="accent">Accent</Badge>
```

#### `success`

- **Custom Theme**: Green gradient with shadow
- **Default Theme**: Solid green background

```tsx
<Badge variant="success">Success</Badge>
```

#### `warning`

- **Custom Theme**: Orange gradient with shadow
- **Default Theme**: Solid yellow background

```tsx
<Badge variant="warning">Warning</Badge>
```

#### `destructive`

- **Custom Theme**: Red gradient with shadow
- **Default Theme**: Solid red background

```tsx
<Badge variant="destructive">Destructive</Badge>
```

#### `outline`

- **Custom Theme**: Transparent with gradient border
- **Default Theme**: Transparent with solid border

```tsx
<Badge variant="outline">Outline</Badge>
```

### Custom Theme Effects

In the custom theme, badges feature:

- Gradient backgrounds
- Colored shadows
- Hover effects:
  - Stronger shadow
  - Slight scale increase (1.05)
- Smooth transitions (300ms)

### Default Theme Effects

In the default theme, badges feature:

- Solid color backgrounds
- No shadows
- Hover effects:
  - Slightly darker background
  - No scale or transforms
- No transitions

## Usage Examples

### Animal Card with Theme-Aware Components

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function AnimalCard({ animal }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{animal.name}</CardTitle>
          <Badge variant="success">Healthy</Badge>
        </div>
        <CardDescription>
          {animal.breed} • {animal.age} years old
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {animal.description}
        </p>
        <div className="flex gap-2">
          <Button variant="accent">Adopt Me</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Dashboard Metrics with Theme Variants

```tsx
function MetricCard({ title, value, change, status }) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant={status === 'up' ? 'success' : 'warning'}>
            {change}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
```

### Action Buttons with Different Priorities

```tsx
function ActionButtons() {
  return (
    <div className="flex gap-2">
      {/* Primary action - most prominent */}
      <Button variant="accent" size="lg">
        Donate Now
      </Button>

      {/* Secondary action */}
      <Button variant="secondary">Learn More</Button>

      {/* Tertiary action */}
      <Button variant="outline">Share</Button>
    </div>
  );
}
```

## Implementation Details

### CSS Classes

The theme variants are implemented using CSS classes defined in:

- `src/styles/themes/custom.css` - Custom theme styles
- `src/styles/themes/default.css` - Default theme styles

These classes are automatically applied based on the `data-theme` attribute on the document root.

### Component Variants

Components use `class-variance-authority` (CVA) to define variants:

```tsx
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'btn-gradient text-primary-foreground',
      secondary: 'btn-gradient-secondary text-secondary-foreground',
      // ...
    },
  },
});
```

### Theme-Specific Styling

CSS classes are scoped to themes using data attributes:

```css
/* Custom theme */
[data-theme='custom'] .btn-gradient {
  background: var(--gradient-primary);
  /* ... */
}

/* Default theme */
[data-theme='default'] .btn-gradient {
  background: rgb(var(--color-primary-default));
  /* ... */
}
```

## Accessibility

All component variants maintain accessibility standards:

- **Color Contrast**: All text maintains WCAG AA contrast ratios (4.5:1 minimum)
- **Touch Targets**: Buttons maintain minimum 44x44px touch targets
- **Focus Indicators**: All interactive elements have visible focus rings
- **Keyboard Navigation**: All components are fully keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML

## Performance

Theme variants are optimized for performance:

- **CSS Variables**: Colors defined as CSS variables for instant theme switching
- **No JavaScript**: Theme styling is pure CSS, no runtime JavaScript overhead
- **Smooth Transitions**: Transitions are GPU-accelerated using `transform` and `opacity`
- **Minimal Repaints**: Theme changes only update CSS variables, not DOM structure

## Testing

To test component variants:

1. **Visual Testing**: Use the `ComponentVariantsDemo` component
2. **Theme Switching**: Toggle between themes to see variants adapt
3. **Responsive Testing**: Test on different screen sizes
4. **Accessibility Testing**: Use screen readers and keyboard navigation

```tsx
import { ComponentVariantsDemo } from '@/components/features/theme/ComponentVariantsDemo';

// In your test page
<ComponentVariantsDemo />;
```

## Best Practices

### When to Use Each Variant

**Buttons:**

- `default`: Primary actions (submit, save, create)
- `secondary`: Secondary actions (cancel, back, view)
- `accent`: Call-to-action buttons (donate, adopt, volunteer)
- `destructive`: Dangerous actions (delete, remove)
- `outline`: Tertiary actions (share, export)
- `ghost`: Subtle actions (close, minimize)
- `link`: Navigation links

**Cards:**

- `default`: Standard content cards
- `elevated`: Important or featured content
- `outline`: Secondary or grouped content
- `ghost`: Minimal content containers

**Badges:**

- `default`: General labels
- `secondary`: Categories or types
- `accent`: Important highlights
- `success`: Positive status (healthy, completed)
- `warning`: Attention needed (pending, needs care)
- `destructive`: Critical status (urgent, critical)
- `outline`: Subtle labels

### Combining Variants

Components work well together:

```tsx
<Card variant="elevated">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Featured Animal</CardTitle>
      <Badge variant="accent">New</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <Button variant="accent" size="lg">
      Adopt Now
    </Button>
  </CardContent>
</Card>
```

## Migration Guide

If you have existing components using the old button/card/badge components:

1. **No changes required**: Existing code will use the `default` variant automatically
2. **Add variants**: Optionally add `variant` props to customize appearance
3. **Test themes**: Switch between themes to ensure components look good in both

```tsx
// Before (still works)
<Button>Click Me</Button>

// After (with variant)
<Button variant="accent">Click Me</Button>
```

## Future Enhancements

Potential future additions:

- Additional color variants (info, muted)
- Size variants for cards and badges
- Animation variants (pulse, bounce)
- Custom gradient directions
- Theme-specific icons

## Related Documentation

- [Theme Context Implementation](./THEME_CONTEXT_IMPLEMENTATION.md)
- [Theme Configuration](./THEME_CONFIGURATION_COMPLETE.md)
- [Theme Switcher Component](./THEME_SWITCHER_COMPONENT.md)
- [Design System](./GuideDocs/DesignSystem.md)
