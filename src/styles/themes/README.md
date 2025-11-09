# Theme Configuration Files

This directory contains the CSS variable definitions for the CampusPaws theme system.

## Overview

The theme system allows users to switch between two distinct visual experiences:

1. **Default Theme** (`default.css`) - Clean, minimal shadcn/ui theme
2. **Custom Theme** (`custom.css`) - Full CampusPaws branding with gradients and effects

## File Structure

```
themes/
├── default.css      # Default theme CSS variables
├── custom.css       # Custom theme CSS variables
├── index.ts         # Theme metadata and utilities
└── README.md        # This file
```

## Theme Architecture

### How Themes Work

Themes are applied using the `data-theme` attribute on the root HTML element:

```html
<!-- Default theme -->
<html data-theme="default">
  <!-- Custom theme -->
  <html data-theme="custom"></html>
</html>
```

The ThemeContext (in `src/contexts/ThemeContext.tsx`) manages this attribute and persists the user's choice in localStorage.

### CSS Variable Scoping

Each theme defines its own set of CSS variables scoped to `[data-theme="..."]`:

```css
/* Default theme variables */
[data-theme='default'] {
  --primary: rgb(59 130 246);
  /* ... */
}

/* Custom theme variables */
[data-theme='custom'] {
  --primary: rgb(51 109 245);
  /* ... */
}
```

## Default Theme

**Purpose**: Provide a clean, minimal design for users who prefer simplicity.

**Features**:

- Neutral color palette (grays, subtle blues)
- No gradients
- Simple backgrounds
- Standard shadcn/ui styling
- Aceternity effects hidden

**Use Cases**:

- Users who prefer minimal design
- Better performance (no animations)
- Accessibility-focused experience
- Professional/corporate preference

## Custom Theme

**Purpose**: Showcase the full CampusPaws brand identity with vibrant colors and effects.

**Features**:

- Trust and Action color palette
- Gradient backgrounds and buttons
- Aceternity UI effects (AnimatedGradient, BackgroundBeams, Sparkles)
- Custom animations (shimmer, pulse, glow)
- Brand-specific styling

**Use Cases**:

- Default experience for most users
- Marketing and promotional pages
- Emotional engagement
- Brand identity showcase

## Color Palettes

### Default Theme Colors

```css
Primary:   #3B82F6 (Blue 500)
Secondary: #64748B (Slate 500)
Accent:    #6366F1 (Indigo 500)
Success:   #22C55E (Green 500)
Warning:   #EAB308 (Yellow 500)
Error:     #EF4444 (Red 500)
```

### Custom Theme Colors

```css
Primary (Trust Blue):     #336DF5
Secondary (Nature Green): #66AA33
Accent (Action Orange):   #F75F00
Success:                  #66AA33
Warning:                  #F75F00
Error:                    #DC2626
```

## Gradient Definitions (Custom Theme Only)

The custom theme includes several gradient utilities:

```css
.gradient-bg           /* Primary gradient background */
.gradient-bg-secondary /* Secondary gradient background */
.gradient-bg-accent    /* Accent gradient background */
.gradient-bg-hero      /* Animated hero gradient */
.gradient-text         /* Gradient text effect */
.gradient-border       /* Gradient border effect */
```

## Aceternity Effects

Aceternity components are controlled by the theme:

```css
/* Custom theme - show effects */
[data-theme='custom'] .aceternity-effect {
  display: block;
}

/* Default theme - hide effects */
[data-theme='default'] .aceternity-effect {
  display: none !important;
}
```

Components should use the `data-aceternity="true"` attribute or `.aceternity-effect` class to be theme-aware.

## Dark Mode Support

Both themes support dark mode through the `.dark` class:

```css
[data-theme='default'].dark {
  /* ... */
}
[data-theme='custom'].dark {
  /* ... */
}
```

Dark mode is independent of theme selection - users can use dark mode with either theme.

## Usage in Components

### Using Theme-Aware Styles

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'base-styles',
        theme === 'custom' && 'gradient-bg',
        theme === 'default' && 'bg-white'
      )}
    >
      {/* Content */}
    </div>
  );
}
```

### Conditional Aceternity Effects

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedGradient } from '@/components/ui/animated-gradient';

function Hero() {
  const { config } = useTheme();

  return (
    <div className="relative">
      {config.features.aceternity && <AnimatedGradient />}
      {/* Content */}
    </div>
  );
}
```

### Using Gradient Classes

```tsx
// Custom theme will show gradient, default theme will show solid color
<button className="btn-gradient">
  Click Me
</button>

// Or use conditional classes
<div className={cn(
  'card',
  theme === 'custom' && 'card-gradient'
)}>
  Card content
</div>
```

## Adding New Themes

To add a new theme:

1. Create a new CSS file (e.g., `minimal.css`)
2. Define variables scoped to `[data-theme="minimal"]`
3. Import in `globals.css`
4. Add metadata to `index.ts`
5. Update ThemeContext type definitions

## Performance Considerations

### Default Theme

- Smaller CSS bundle (no gradient/animation styles)
- Faster rendering (no complex effects)
- Better for low-end devices

### Custom Theme

- Larger CSS bundle (includes all effects)
- More GPU usage (animations, gradients)
- Best experience on modern devices

## Accessibility

Both themes maintain WCAG 2.1 Level AA compliance:

- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Keyboard navigation support
- Screen reader compatibility
- Respects `prefers-reduced-motion`

## Testing Themes

To test themes during development:

```tsx
// In your component or page
import { useTheme } from '@/contexts/ThemeContext';

function TestPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme('default')}>Default</button>
      <button onClick={() => setTheme('custom')}>Custom</button>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties required
- CSS `data-*` attribute selectors required
- No IE11 support

## Related Files

- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/types/theme.ts` - TypeScript type definitions
- `src/app/globals.css` - Global styles and theme imports
- `src/components/ui/theme-toggle.tsx` - Theme switcher component
