# Theme Switcher Usage Guide

## Overview

The CampusPaws theme switcher allows users to toggle between two distinct visual themes:

- **Custom Theme**: The vibrant CampusPaws branding with gradients, animations, and Aceternity effects
- **Default Theme**: A clean, minimal shadcn/ui theme with standard styling

This guide covers how to use the theme switcher, add new themes, and customize existing themes.

## Table of Contents

1. [Using the Theme Switcher](#using-the-theme-switcher)
2. [Theme Architecture](#theme-architecture)
3. [Adding New Themes](#adding-new-themes)
4. [Customizing Themes](#customizing-themes)
5. [Theme-Aware Components](#theme-aware-components)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Using the Theme Switcher

### For End Users

The theme switcher is located in the header navigation. Click the dropdown to see available themes:

1. **Custom Theme** (Default)
   - Colorful gradients and animations
   - Aceternity UI effects (sparkles, beams, animated gradients)
   - Vibrant CampusPaws branding

2. **Default Theme**
   - Clean, minimal design
   - Standard shadcn/ui styling
   - No decorative effects

Your theme preference is automatically saved and persists across page reloads.

### For Developers

#### Basic Usage

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, config } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('default')}>Switch to Default</button>
    </div>
  );
}
```

#### Conditional Rendering

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedGradient } from '@/components/ui/animated-gradient';

function Hero() {
  const { config } = useTheme();

  return (
    <div className="relative">
      {/* Only show in custom theme */}
      {config.effects.aceternity && <AnimatedGradient />}

      <h1>Welcome to CampusPaws</h1>
    </div>
  );
}
```

#### Theme-Aware Styling

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

function Card({ children }) {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'rounded-lg p-6',
        theme === 'custom' &&
          'bg-gradient-to-br from-primary/10 to-secondary/10',
        theme === 'default' && 'bg-card border'
      )}
    >
      {children}
    </div>
  );
}
```

---

## Theme Architecture

### File Structure

```
src/
├── contexts/
│   └── ThemeContext.tsx          # Theme provider and hook
├── types/
│   └── theme.ts                  # Theme types and configurations
├── styles/
│   └── themes/
│       ├── custom.css            # Custom theme CSS variables
│       ├── default.css           # Default theme CSS variables
│       └── index.ts              # Theme exports
└── components/
    └── features/
        └── theme/
            ├── ThemeSwitcher.tsx # Theme switcher component
            └── ThemeSwitcherCompact.tsx
```

### Theme Configuration

Themes are defined in `src/types/theme.ts`:

```typescript
export type ThemeVariant = 'custom' | 'default';

export interface ThemeConfig {
  variant: ThemeVariant;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    gradients: boolean;
    animations: boolean;
    aceternity: boolean;
  };
}

export const THEME_CONFIGS: Record<ThemeVariant, ThemeConfig> = {
  custom: {
    variant: 'custom',
    name: 'CampusPaws Custom',
    description: 'Vibrant theme with gradients and animations',
    colors: {
      primary: '#336DF5',
      secondary: '#66AA33',
      accent: '#F75F00',
    },
    effects: {
      gradients: true,
      animations: true,
      aceternity: true,
    },
  },
  default: {
    variant: 'default',
    name: 'Clean Default',
    description: 'Minimal shadcn/ui theme',
    colors: {
      primary: 'hsl(222.2 47.4% 11.2%)',
      secondary: 'hsl(210 40% 96.1%)',
      accent: 'hsl(210 40% 96.1%)',
    },
    effects: {
      gradients: false,
      animations: false,
      aceternity: false,
    },
  },
};
```

### CSS Variables

Each theme defines CSS variables in its own file:

**Custom Theme** (`src/styles/themes/custom.css`):

```css
[data-theme='custom'] {
  --primary: 210 100% 60%;
  --secondary: 100 40% 53%;
  --accent: 20 100% 48%;

  /* Gradient definitions */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

**Default Theme** (`src/styles/themes/default.css`):

```css
[data-theme='default'] {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;

  /* No gradients */
}
```

### Theme Context

The `ThemeContext` manages theme state and persistence:

```typescript
interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  config: ThemeConfig;
}
```

**Features:**

- Persists theme preference in localStorage
- Applies `data-theme` attribute to document root
- Provides theme configuration
- Optimized with useMemo and useCallback

---

## Adding New Themes

### Step 1: Define Theme Configuration

Add your theme to `src/types/theme.ts`:

```typescript
export type ThemeVariant = 'custom' | 'default' | 'dark' | 'high-contrast';

export const THEME_CONFIGS: Record<ThemeVariant, ThemeConfig> = {
  // ... existing themes
  'high-contrast': {
    variant: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum accessibility with high contrast colors',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#FFFF00',
    },
    effects: {
      gradients: false,
      animations: false,
      aceternity: false,
    },
  },
};
```

### Step 2: Create CSS Variables

Create `src/styles/themes/high-contrast.css`:

```css
[data-theme='high-contrast'] {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;

  --primary: 0 0% 0%;
  --primary-foreground: 0 0% 100%;

  --secondary: 0 0% 100%;
  --secondary-foreground: 0 0% 0%;

  --accent: 60 100% 50%;
  --accent-foreground: 0 0% 0%;

  /* High contrast borders */
  --border: 0 0% 0%;
  --input: 0 0% 0%;
  --ring: 0 0% 0%;

  /* No shadows for clarity */
  --shadow: none;
}
```

### Step 3: Import CSS

Add to `src/styles/themes/index.ts`:

```typescript
import './custom.css';
import './default.css';
import './high-contrast.css'; // Add this line
```

### Step 4: Update Theme Switcher (Optional)

Add custom icon for your theme in `ThemeSwitcher.tsx`:

```typescript
const getThemeIcon = (variant: ThemeVariant) => {
  switch (variant) {
    case 'custom':
      return <Sparkles className="h-4 w-4 text-primary" />;
    case 'high-contrast':
      return <Eye className="h-4 w-4" />;
    default:
      return <Palette className="h-4 w-4 text-muted-foreground" />;
  }
};
```

### Step 5: Test Your Theme

1. Switch to your new theme using the theme switcher
2. Verify all pages render correctly
3. Check color contrast ratios (use browser DevTools)
4. Test with screen readers if applicable
5. Verify persistence across page reloads

---

## Customizing Themes

### Modifying Colors

Edit the CSS variables in the theme file:

```css
[data-theme='custom'] {
  /* Change primary color */
  --primary: 210 100% 60%; /* Blue */

  /* Change to green */
  --primary: 142 76% 36%; /* Green */
}
```

### Adding Gradients

Define gradient variables:

```css
[data-theme='custom'] {
  --gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-card: linear-gradient(
    to bottom right,
    var(--primary),
    var(--secondary)
  );
}
```

Use in components:

```tsx
<div className="bg-[var(--gradient-hero)]">Hero content</div>
```

### Customizing Effects

Control effects via theme configuration:

```typescript
effects: {
  gradients: true,      // Enable/disable gradients
  animations: true,     // Enable/disable animations
  aceternity: true,     // Enable/disable Aceternity components
}
```

### Per-Component Customization

Create theme-specific component variants:

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-button-styles', {
  variants: {
    theme: {
      custom: 'bg-gradient-to-r from-primary to-secondary',
      default: 'bg-primary text-primary-foreground',
    },
  },
});
```

---

## Theme-Aware Components

### Conditional Rendering Pattern

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { config } = useTheme();

  return (
    <div>
      {/* Always rendered */}
      <h1>Title</h1>

      {/* Only in custom theme */}
      {config.effects.aceternity && <AnimatedGradient />}

      {/* Only in default theme */}
      {!config.effects.gradients && <SimpleBorder />}
    </div>
  );
}
```

### Styling Pattern

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

function Card({ children }) {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        // Base styles (always applied)
        'rounded-lg p-6',

        // Theme-specific styles
        theme === 'custom' && [
          'bg-gradient-to-br from-primary/10 to-secondary/10',
          'shadow-lg hover:shadow-xl transition-shadow',
        ],
        theme === 'default' && [
          'bg-card border border-border',
          'hover:border-primary/50 transition-colors',
        ]
      )}
    >
      {children}
    </div>
  );
}
```

### Utility Helper

Use the theme utility from `src/lib/utils/theme.ts`:

```tsx
import { getThemeClasses } from '@/lib/utils/theme';

function Button({ variant = 'default' }) {
  const classes = getThemeClasses({
    custom: 'bg-gradient-to-r from-primary to-secondary',
    default: 'bg-primary',
  });

  return <button className={classes}>Click me</button>;
}
```

---

## Best Practices

### 1. Always Use Theme Context

❌ **Don't** hardcode theme checks:

```tsx
const theme = localStorage.getItem('campuspaws-theme');
```

✅ **Do** use the theme hook:

```tsx
const { theme, config } = useTheme();
```

### 2. Provide Fallbacks

❌ **Don't** assume effects are always available:

```tsx
<AnimatedGradient />
```

✅ **Do** check configuration:

```tsx
{
  config.effects.aceternity && <AnimatedGradient />;
}
```

### 3. Use CSS Variables

❌ **Don't** hardcode colors:

```tsx
<div style={{ background: '#336DF5' }}>
```

✅ **Do** use CSS variables:

```tsx
<div className="bg-primary">
```

### 4. Test Both Themes

Always test your components in both themes:

```tsx
// In your test file
describe('MyComponent', () => {
  it('renders correctly in custom theme', () => {
    render(
      <ThemeProvider>
        <MyComponent />
      </ThemeProvider>
    );
  });

  it('renders correctly in default theme', () => {
    localStorage.setItem('campuspaws-theme', 'default');
    render(
      <ThemeProvider>
        <MyComponent />
      </ThemeProvider>
    );
  });
});
```

### 5. Optimize Performance

Use memoization for expensive theme-dependent calculations:

```tsx
const themeStyles = useMemo(() => {
  return theme === 'custom' ? computeExpensiveGradient() : 'bg-primary';
}, [theme]);
```

### 6. Maintain Accessibility

Ensure sufficient contrast in all themes:

```css
/* Check contrast ratios */
--foreground: 0 0% 0%; /* Black text */
--background: 0 0% 100%; /* White background */
/* Contrast ratio: 21:1 (Excellent) */
```

Use tools like:

- Chrome DevTools Lighthouse
- WAVE browser extension
- axe DevTools

---

## Troubleshooting

### Theme Not Persisting

**Problem**: Theme resets on page reload

**Solution**: Check localStorage is working:

```tsx
// In browser console
localStorage.getItem('campuspaws-theme');
```

If null, check if localStorage is blocked (private browsing, browser settings).

### Flash of Unstyled Content (FOUC)

**Problem**: Brief flash of wrong theme on page load

**Solution**: The ThemeProvider prevents this by not rendering until mounted:

```tsx
if (!mounted) {
  return null; // Prevents FOUC
}
```

If still occurring, check that ThemeProvider is high in component tree.

### Styles Not Applying

**Problem**: Theme-specific styles not working

**Solution**:

1. Check `data-theme` attribute on `<html>`:

   ```tsx
   document.documentElement.getAttribute('data-theme');
   ```

2. Verify CSS is imported in `globals.css`:

   ```css
   @import './themes/index.css';
   ```

3. Check CSS selector specificity:

   ```css
   /* More specific */
   [data-theme='custom'] .my-class {
   }

   /* Less specific */
   .my-class {
   }
   ```

### Theme Hook Error

**Problem**: "useTheme must be used within a ThemeProvider"

**Solution**: Wrap your app with ThemeProvider:

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### Dark Mode Conflicts

**Problem**: Theme switcher conflicts with dark mode

**Solution**: Both can coexist. The theme uses `data-theme` attribute, dark mode uses `dark` class:

```tsx
// Both work together
<html data-theme="custom" class="dark">
```

CSS:

```css
/* Theme-specific */
[data-theme='custom'] {
}

/* Dark mode */
.dark {
}

/* Both */
[data-theme='custom'].dark {
}
```

---

## Additional Resources

- [Theme Types Definition](../src/types/theme.ts)
- [Theme Context Implementation](../src/contexts/ThemeContext.tsx)
- [Theme Switcher Component](../src/components/features/theme/ThemeSwitcher.tsx)
- [Theme CSS Variables](../src/styles/themes/)
- [Theme Utility Functions](../src/lib/utils/theme.ts)

## Support

For questions or issues:

1. Check this documentation
2. Review existing theme implementations
3. Check the [Troubleshooting](#troubleshooting) section
4. Contact the development team

---

**Last Updated**: November 2025  
**Version**: 1.0.0
