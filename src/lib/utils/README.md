# Theme Utility Functions

This directory contains utility functions for working with themes in CampusPaws.

## Overview

The theme utilities provide a consistent way to apply theme-specific styling throughout the application. They make it easy to create components that adapt to both the "Custom" (CampusPaws branding) and "Default" (clean shadcn/ui) themes.

## Files

- **`theme.ts`**: Core theme utility functions
- **`theme.examples.tsx`**: Comprehensive examples of using theme utilities
- **`README.md`**: This documentation file

## Core Functions

### `themeClasses(theme, customClasses, defaultClasses, baseClasses)`

Apply theme-specific classes based on the current theme.

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { themeClasses } from '@/lib/utils/theme';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div
      className={themeClasses(
        theme,
        'gradient-bg shimmer',      // custom theme
        'bg-primary',                // default theme
        'px-4 py-2 rounded'          // base classes
      )}
    >
      Content
    </div>
  );
}
```

### `buildThemeClass(theme, options)`

Build a theme-aware className string with an options object.

```tsx
const className = buildThemeClass(theme, {
  base: 'px-4 py-2 rounded',
  custom: 'gradient-bg hover:gradient-bg-hover',
  default: 'bg-primary hover:bg-primary-dark'
});
```

### `themeButton(theme, variant, baseClasses)`

Apply theme classes to button components.

```tsx
<button
  className={themeButton(
    theme,
    'primary',              // 'primary' | 'secondary' | 'accent'
    'px-6 py-3 rounded-lg'  // additional classes
  )}
>
  Click Me
</button>
```

**Variants:**
- `primary`: Main action buttons (blue gradient in custom, solid blue in default)
- `secondary`: Secondary actions (green gradient in custom, solid green in default)
- `accent`: Call-to-action buttons (orange gradient in custom, solid orange in default)

### `themeCard(theme, baseClasses)`

Apply theme classes to card components.

```tsx
<div className={themeCard(theme, 'p-6 rounded-lg shadow-lg')}>
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### `themeText(theme, variant, baseClasses)`

Apply theme classes to text with gradient effects.

```tsx
<h1 className={themeText(theme, 'primary', 'text-4xl font-bold')}>
  Gradient Heading
</h1>
```

**Variants:**
- `primary`: Blue gradient in custom theme, solid blue in default
- `accent`: Orange gradient in custom theme, solid orange in default

### `themeBackground(theme, variant, baseClasses)`

Apply theme classes to background elements.

```tsx
<section
  className={themeBackground(
    theme,
    'hero',                    // 'hero' | 'primary' | 'secondary'
    'min-h-screen py-20'       // additional classes
  )}
>
  Content
</section>
```

**Variants:**
- `hero`: Animated multi-color gradient in custom, plain background in default
- `primary`: Blue gradient in custom, solid blue in default
- `secondary`: Green gradient in custom, solid green in default

### `shouldShowAceternity(theme)`

Check if Aceternity effects should be shown.

```tsx
{shouldShowAceternity(theme) && (
  <AnimatedGradient />
)}
```

### `shouldUseGradients(theme)`

Check if gradients should be used.

```tsx
{shouldUseGradients(theme) && (
  <div className="gradient-bg" />
)}
```

### `getAceternityProps(theme)`

Get data attribute for Aceternity components.

```tsx
<div {...getAceternityProps(theme)}>
  <AnimatedGradient />
</div>
```

This adds `data-aceternity="true"` or `data-aceternity="false"` to the element, which can be targeted by CSS.

### `conditionalThemeClasses(theme, condition, customClasses, defaultClasses, baseClasses)`

Apply conditional theme classes based on a condition.

```tsx
const className = conditionalThemeClasses(
  theme,
  isActive,
  'glow-primary pulse-glow',  // custom theme when active
  'ring-2 ring-primary',       // default theme when active
  'px-4 py-2 rounded'          // base classes
);
```

## Helper Functions

### `isThemeActive(currentTheme, targetTheme)`

Check if a specific theme is active.

```tsx
if (isThemeActive(theme, 'custom')) {
  // Custom theme is active
}
```

### `getThemeValue(theme, customValue, defaultValue)`

Get theme-specific value.

```tsx
const buttonText = getThemeValue(
  theme,
  'Donate with Style',  // custom theme
  'Donate'              // default theme
);
```

## Usage Patterns

### Pattern 1: Simple Component

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { themeButton } from '@/lib/utils/theme';

export function DonateButton() {
  const { theme } = useTheme();
  
  return (
    <button className={themeButton(theme, 'accent', 'px-8 py-4 rounded-lg')}>
      Donate Now
    </button>
  );
}
```

### Pattern 2: Complex Component with Multiple Theme Elements

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { themeCard, themeText, themeButton } from '@/lib/utils/theme';

export function AnimalCard({ animal }) {
  const { theme } = useTheme();
  
  return (
    <div className={themeCard(theme, 'p-6 rounded-lg')}>
      <h3 className={themeText(theme, 'primary', 'text-2xl font-bold mb-2')}>
        {animal.name}
      </h3>
      <p className="text-muted-foreground mb-4">{animal.description}</p>
      <button className={themeButton(theme, 'primary', 'px-4 py-2 rounded')}>
        Learn More
      </button>
    </div>
  );
}
```

### Pattern 3: Conditional Aceternity Effects

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { shouldShowAceternity } from '@/lib/utils/theme';
import { AnimatedGradient } from '@/components/ui/animated-gradient';

export function HeroSection() {
  const { theme } = useTheme();
  
  return (
    <section className="relative min-h-screen">
      {shouldShowAceternity(theme) && (
        <div className="absolute inset-0 pointer-events-none">
          <AnimatedGradient />
        </div>
      )}
      
      <div className="relative z-10">
        <h1>Hero Content</h1>
      </div>
    </section>
  );
}
```

### Pattern 4: Using buildThemeClass for Complex Styling

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { buildThemeClass } from '@/lib/utils/theme';

export function FeatureCard({ isHighlighted }) {
  const { theme } = useTheme();
  
  const cardClass = buildThemeClass(theme, {
    base: 'p-6 rounded-xl transition-all duration-300',
    custom: isHighlighted 
      ? 'card-gradient glow-primary scale-105' 
      : 'card-gradient hover:scale-105',
    default: isHighlighted
      ? 'bg-card border-2 border-primary shadow-xl'
      : 'bg-card border border-border hover:shadow-lg',
  });
  
  return (
    <div className={cardClass}>
      <h3>Feature Title</h3>
      <p>Feature description</p>
    </div>
  );
}
```

## Best Practices

1. **Always use theme utilities for theme-specific styling**: Don't hardcode theme-specific classes directly in components.

2. **Keep base classes separate**: Use the `baseClasses` parameter for styles that apply to all themes.

3. **Use semantic variants**: Use `primary`, `secondary`, and `accent` variants consistently across the app.

4. **Conditional rendering for Aceternity**: Always check `shouldShowAceternity()` before rendering Aceternity components.

5. **Combine with cn() for additional classes**: You can combine theme utilities with the `cn()` function for more complex scenarios.

```tsx
import { cn } from '@/lib/utils';
import { themeButton } from '@/lib/utils/theme';

const className = cn(
  themeButton(theme, 'primary'),
  isLoading && 'opacity-50 cursor-not-allowed',
  className // Allow prop override
);
```

## CSS Classes Reference

### Custom Theme Classes

These classes are defined in `src/styles/themes/custom.css`:

**Gradients:**
- `gradient-bg` - Primary gradient background
- `gradient-bg-secondary` - Secondary gradient background
- `gradient-bg-accent` - Accent gradient background
- `gradient-bg-hero` - Animated hero gradient
- `gradient-text` - Primary gradient text
- `gradient-text-accent` - Accent gradient text
- `gradient-border` - Gradient border

**Buttons:**
- `btn-gradient` - Primary gradient button
- `btn-gradient-accent` - Accent gradient button

**Cards:**
- `card-gradient` - Gradient card with hover effects

**Effects:**
- `glow-primary` - Primary color glow effect
- `glow-accent` - Accent color glow effect
- `glow-success` - Success color glow effect
- `shimmer` - Shimmer animation effect
- `pulse-glow` - Pulsing glow animation
- `animated-gradient-bg` - Animated gradient background

**Colors:**
- `bg-trust-blue`, `text-trust-blue`, `border-trust-blue`
- `bg-nature-green`, `text-nature-green`, `border-nature-green`
- `bg-action-orange`, `text-action-orange`, `border-action-orange`

### Default Theme Classes

The default theme uses standard Tailwind and shadcn/ui classes:

- `bg-primary`, `bg-secondary`, `bg-accent`
- `text-primary`, `text-secondary`, `text-accent`
- `border-primary`, `border-secondary`, `border-accent`
- `bg-card`, `border-border`

## Examples

See `theme.examples.tsx` for comprehensive examples of using all theme utilities.

## Migration Guide

If you have existing components with hardcoded theme-specific styles, here's how to migrate them:

### Before:
```tsx
<button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-lg">
  Click Me
</button>
```

### After:
```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { themeButton } from '@/lib/utils/theme';

function MyButton() {
  const { theme } = useTheme();
  return (
    <button className={themeButton(theme, 'primary', 'px-6 py-3 rounded-lg')}>
      Click Me
    </button>
  );
}
```

## Testing

When testing components that use theme utilities, make sure to wrap them in a `ThemeProvider`:

```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';

test('renders with custom theme', () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
});
```

## Contributing

When adding new theme utilities:

1. Add the function to `theme.ts`
2. Add JSDoc comments with examples
3. Add usage examples to `theme.examples.tsx`
4. Update this README with documentation
5. Add corresponding CSS classes to theme files if needed
