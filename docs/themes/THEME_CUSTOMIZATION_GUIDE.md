# Theme Customization Guide

Quick reference for customizing CampusPaws themes.

## Quick Start

### Change Theme Colors

Edit `src/styles/themes/custom.css` or `default.css`:

```css
[data-theme='custom'] {
  /* Primary color (main brand color) */
  --primary: 210 100% 60%;
  
  /* Secondary color (accents, highlights) */
  --secondary: 100 40% 53%;
  
  /* Accent color (CTAs, important actions) */
  --accent: 20 100% 48%;
}
```

### Add Custom Gradient

```css
[data-theme='custom'] {
  --gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-card: linear-gradient(to right, var(--primary), var(--secondary));
}
```

Use in components:

```tsx
<div className="bg-[var(--gradient-hero)]">
  Content
</div>
```

### Create Theme-Aware Component

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      'base-styles',
      theme === 'custom' && 'custom-styles',
      theme === 'default' && 'default-styles'
    )}>
      Content
    </div>
  );
}
```

### Conditional Effects

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedGradient } from '@/components/ui/animated-gradient';

export function Hero() {
  const { config } = useTheme();
  
  return (
    <div className="relative">
      {/* Only show in custom theme */}
      {config.effects.aceternity && <AnimatedGradient />}
      
      <h1>Hero Title</h1>
    </div>
  );
}
```

## Color System

### HSL Format

CampusPaws uses HSL (Hue, Saturation, Lightness) for colors:

```css
--primary: 210 100% 60%;
/*         ↑   ↑    ↑
           H   S    L
           Hue Sat  Light
*/
```

**Hue** (0-360): Color wheel position
- 0/360: Red
- 120: Green
- 240: Blue

**Saturation** (0-100%): Color intensity
- 0%: Gray
- 100%: Full color

**Lightness** (0-100%): Brightness
- 0%: Black
- 50%: Pure color
- 100%: White

### Color Variables

```css
/* Background colors */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;

/* UI colors */
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;

--popover: 0 0% 100%;
--popover-foreground: 222.2 84% 4.9%;

/* Brand colors */
--primary: 210 100% 60%;
--primary-foreground: 210 40% 98%;

--secondary: 100 40% 53%;
--secondary-foreground: 222.2 47.4% 11.2%;

--accent: 20 100% 48%;
--accent-foreground: 210 40% 98%;

/* Semantic colors */
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;

--success: 142 76% 36%;
--success-foreground: 210 40% 98%;

--warning: 38 92% 50%;
--warning-foreground: 222.2 47.4% 11.2%;

/* Borders and inputs */
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 222.2 84% 4.9%;

/* Radius */
--radius: 0.5rem;
```

## Gradient System

### Predefined Gradients

```css
[data-theme='custom'] {
  /* Hero gradients */
  --gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-hero-alt: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  
  /* Card gradients */
  --gradient-card: linear-gradient(to bottom right, 
    hsl(var(--primary) / 0.1), 
    hsl(var(--secondary) / 0.1)
  );
  
  /* Button gradients */
  --gradient-button: linear-gradient(to right, 
    hsl(var(--primary)), 
    hsl(var(--secondary))
  );
  
  /* Accent gradients */
  --gradient-accent: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}
```

### Using Gradients

```tsx
// Via CSS variable
<div className="bg-[var(--gradient-hero)]">

// Via Tailwind
<div className="bg-gradient-to-r from-primary to-secondary">

// Via inline style
<div style={{ background: 'var(--gradient-card)' }}>
```

## Component Patterns

### Button Variants

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemedButton({ children, ...props }) {
  const { theme } = useTheme();
  
  return (
    <Button
      className={cn(
        theme === 'custom' && 'bg-gradient-to-r from-primary to-secondary',
        theme === 'default' && 'bg-primary'
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Card Variants

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ThemedCard({ children, className, ...props }) {
  const { theme } = useTheme();
  
  return (
    <Card
      className={cn(
        theme === 'custom' && [
          'bg-gradient-to-br from-primary/10 to-secondary/10',
          'border-primary/20',
          'shadow-lg hover:shadow-xl transition-shadow',
        ],
        theme === 'default' && [
          'bg-card border',
          'hover:border-primary/50 transition-colors',
        ],
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
```

### Badge Variants

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ThemedBadge({ children, variant = 'default', ...props }) {
  const { theme } = useTheme();
  
  return (
    <Badge
      className={cn(
        theme === 'custom' && variant === 'default' && [
          'bg-gradient-to-r from-primary/80 to-secondary/80',
          'text-white',
        ],
        theme === 'default' && variant === 'default' && [
          'bg-secondary text-secondary-foreground',
        ]
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
```

## Effect Controls

### Theme Configuration

Edit `src/types/theme.ts`:

```typescript
export const THEME_CONFIGS: Record<ThemeVariant, ThemeConfig> = {
  custom: {
    variant: 'custom',
    name: 'CampusPaws Custom',
    description: 'Vibrant theme with gradients and animations',
    colors: { /* ... */ },
    effects: {
      gradients: true,      // Enable gradients
      animations: true,     // Enable animations
      aceternity: true,     // Enable Aceternity components
    },
  },
  default: {
    variant: 'default',
    name: 'Clean Default',
    description: 'Minimal shadcn/ui theme',
    colors: { /* ... */ },
    effects: {
      gradients: false,     // Disable gradients
      animations: false,    // Disable animations
      aceternity: false,    // Disable Aceternity components
    },
  },
};
```

### Using Effect Controls

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Sparkles } from '@/components/ui/sparkles';

export function Hero() {
  const { config } = useTheme();
  
  return (
    <div className="relative">
      {/* Aceternity effects - only in custom theme */}
      {config.effects.aceternity && (
        <>
          <AnimatedGradient />
          <BackgroundBeams />
          <Sparkles />
        </>
      )}
      
      {/* Gradient background - only if enabled */}
      <div className={cn(
        'hero-content',
        config.effects.gradients && 'bg-[var(--gradient-hero)]'
      )}>
        <h1>Hero Title</h1>
      </div>
    </div>
  );
}
```

## Utility Functions

### Theme Class Helper

```tsx
import { useTheme } from '@/contexts/ThemeContext';

export function useThemeClasses(classes: Record<string, string>) {
  const { theme } = useTheme();
  return classes[theme] || '';
}

// Usage
function MyComponent() {
  const themeClasses = useThemeClasses({
    custom: 'bg-gradient-to-r from-primary to-secondary',
    default: 'bg-primary',
  });
  
  return <div className={themeClasses}>Content</div>;
}
```

### Conditional Theme Styles

```tsx
import { cn } from '@/lib/utils';

export function getThemeStyles(
  theme: ThemeVariant,
  customStyles: string,
  defaultStyles: string
) {
  return cn(
    theme === 'custom' && customStyles,
    theme === 'default' && defaultStyles
  );
}

// Usage
const styles = getThemeStyles(
  theme,
  'bg-gradient-to-r from-primary to-secondary',
  'bg-primary'
);
```

## Testing Themes

### Test Both Themes

```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';

describe('MyComponent', () => {
  it('renders in custom theme', () => {
    render(
      <ThemeProvider>
        <MyComponent />
      </ThemeProvider>
    );
    // Assertions
  });
  
  it('renders in default theme', () => {
    localStorage.setItem('campuspaws-theme', 'default');
    render(
      <ThemeProvider>
        <MyComponent />
      </ThemeProvider>
    );
    // Assertions
  });
});
```

### Visual Testing

1. Switch to each theme using theme switcher
2. Navigate through all pages
3. Check responsive behavior
4. Verify animations and effects
5. Test dark mode compatibility

## Common Customizations

### Change Primary Color

```css
[data-theme='custom'] {
  /* From blue to green */
  --primary: 142 76% 36%;
  --primary-foreground: 210 40% 98%;
}
```

### Adjust Border Radius

```css
[data-theme='custom'] {
  /* More rounded */
  --radius: 1rem;
  
  /* Less rounded */
  --radius: 0.25rem;
  
  /* No rounding */
  --radius: 0;
}
```

### Modify Shadows

```css
[data-theme='custom'] {
  /* Softer shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* No shadows */
  --shadow-sm: none;
  --shadow: none;
  --shadow-lg: none;
}
```

### Custom Font

```css
[data-theme='custom'] {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-heading: 'Playfair Display', serif;
}
```

## Accessibility

### Contrast Ratios

Ensure sufficient contrast (WCAG AA: 4.5:1 for normal text):

```css
/* Good contrast */
--foreground: 0 0% 0%;      /* Black */
--background: 0 0% 100%;    /* White */
/* Ratio: 21:1 */

/* Poor contrast */
--foreground: 0 0% 60%;     /* Gray */
--background: 0 0% 70%;     /* Light gray */
/* Ratio: 1.5:1 - Too low! */
```

### Test Tools

- Chrome DevTools Lighthouse
- WAVE browser extension
- axe DevTools
- Contrast Checker: https://webaim.org/resources/contrastchecker/

## Resources

- [Full Theme Guide](./THEME_SWITCHER_GUIDE.md)
- [Theme Types](../src/types/theme.ts)
- [Theme Context](../src/contexts/ThemeContext.tsx)
- [CSS Variables](../src/styles/themes/)
- [Tailwind Config](../tailwind.config.ts)

---

**Quick Tips:**
- Use CSS variables for colors
- Test both themes
- Check accessibility
- Maintain consistency
- Document changes
