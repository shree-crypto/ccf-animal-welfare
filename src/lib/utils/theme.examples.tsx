/**
 * Theme Utility Examples
 *
 * This file demonstrates how to use the theme utility functions
 * in various components throughout the CampusPaws application.
 */

import { useTheme } from '@/contexts/ThemeContext';
import {
  themeClasses,
  buildThemeClass,
  themeButton,
  themeCard,
  themeText,
  themeBackground,
  shouldShowAceternity,
  getAceternityProps,
  conditionalThemeClasses,
} from './theme';

/**
 * Example 1: Basic Button with Theme-Aware Styling
 */
export function ThemedButton() {
  const { theme } = useTheme();

  return (
    <button
      className={themeButton(
        theme,
        'primary',
        'px-6 py-3 rounded-lg text-white font-bold transition-all'
      )}
    >
      Donate Now
    </button>
  );
}

/**
 * Example 2: Card with Theme-Specific Styling
 */
export function ThemedCard() {
  const { theme } = useTheme();

  return (
    <div className={themeCard(theme, 'p-6 rounded-lg shadow-lg')}>
      <h3 className="text-xl font-bold mb-2">Animal Profile</h3>
      <p className="text-muted-foreground">Details about the animal...</p>
    </div>
  );
}

/**
 * Example 3: Heading with Gradient Text
 */
export function ThemedHeading() {
  const { theme } = useTheme();

  return (
    <h1 className={themeText(theme, 'primary', 'text-4xl font-bold mb-4')}>
      Welcome to CampusPaws
    </h1>
  );
}

/**
 * Example 4: Hero Section with Background
 */
export function ThemedHero() {
  const { theme } = useTheme();

  return (
    <section
      className={themeBackground(
        theme,
        'hero',
        'min-h-screen flex items-center justify-center'
      )}
    >
      <div className="text-center">
        <h1 className={themeText(theme, 'primary', 'text-5xl font-bold mb-4')}>
          Save Lives Together
        </h1>
        <p className="text-lg mb-8">Join our mission to help campus animals</p>
        <button
          className={themeButton(
            theme,
            'accent',
            'px-8 py-4 rounded-lg text-white font-bold'
          )}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

/**
 * Example 5: Conditional Aceternity Effects
 */
export function ThemedWithEffects() {
  const { theme } = useTheme();

  return (
    <div className="relative">
      {/* Only show Aceternity effects in custom theme */}
      {shouldShowAceternity(theme) && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Aceternity component would go here */}
          <div className="animated-gradient-bg opacity-20" />
        </div>
      )}

      <div className="relative z-10">
        <h2>Content with optional effects</h2>
      </div>
    </div>
  );
}

/**
 * Example 6: Using buildThemeClass for Complex Styling
 */
export function ComplexThemedComponent() {
  const { theme } = useTheme();

  const containerClass = buildThemeClass(theme, {
    base: 'p-8 rounded-xl shadow-2xl transition-all duration-300',
    custom: 'card-gradient hover:scale-105 glow-primary',
    default: 'bg-card border border-border hover:shadow-xl',
  });

  return (
    <div className={containerClass}>
      <h3 className="text-2xl font-bold mb-4">Featured Animal</h3>
      <p>This card adapts to the current theme</p>
    </div>
  );
}

/**
 * Example 7: Conditional Theme Classes Based on State
 */
export function ThemedActiveButton({ isActive }: { isActive: boolean }) {
  const { theme } = useTheme();

  const buttonClass = conditionalThemeClasses(
    theme,
    isActive,
    'glow-primary pulse-glow', // custom theme active
    'ring-2 ring-primary', // default theme active
    'px-4 py-2 rounded-lg transition-all' // base classes
  );

  return (
    <button className={buttonClass}>{isActive ? 'Active' : 'Inactive'}</button>
  );
}

/**
 * Example 8: Multiple Buttons with Different Variants
 */
export function ThemedButtonGroup() {
  const { theme } = useTheme();

  return (
    <div className="flex gap-4">
      <button className={themeButton(theme, 'primary', 'px-6 py-3 rounded-lg')}>
        Primary Action
      </button>
      <button
        className={themeButton(theme, 'secondary', 'px-6 py-3 rounded-lg')}
      >
        Secondary Action
      </button>
      <button className={themeButton(theme, 'accent', 'px-6 py-3 rounded-lg')}>
        Accent Action
      </button>
    </div>
  );
}

/**
 * Example 9: Using themeClasses for Simple Conditional Styling
 */
export function SimpleThemedElement() {
  const { theme } = useTheme();

  return (
    <div
      className={themeClasses(
        theme,
        'gradient-border shimmer', // custom theme
        'border-2 border-primary', // default theme
        'p-4 rounded-lg' // base classes
      )}
    >
      <p>This element has theme-specific borders</p>
    </div>
  );
}

/**
 * Example 10: Data Attributes for Aceternity Components
 */
export function ThemedAceternityWrapper() {
  const { theme } = useTheme();

  return (
    <div {...getAceternityProps(theme)} className="relative">
      {/* This div will have data-aceternity="true" or "false" */}
      {/* CSS can target [data-aceternity="true"] for styling */}
      <div className="aceternity-effect">{/* Aceternity component */}</div>
      <div className="content">Regular content</div>
    </div>
  );
}

/**
 * Example 11: Complete Page with Theme-Aware Components
 */
export function ThemedPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={themeBackground(theme, 'hero', 'py-20 px-4')}>
        <div className="container mx-auto text-center">
          <h1
            className={themeText(theme, 'primary', 'text-5xl font-bold mb-6')}
          >
            Make a Difference
          </h1>
          <p className="text-xl mb-8">Every contribution helps save lives</p>
          <button
            className={themeButton(
              theme,
              'accent',
              'px-8 py-4 rounded-lg text-white font-bold text-lg'
            )}
          >
            Donate Today
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={themeCard(theme, 'p-6 rounded-lg')}>
                <h3 className="text-xl font-bold mb-4">Feature {i}</h3>
                <p className="text-muted-foreground">
                  Description of feature {i}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aceternity Effects (Custom Theme Only) */}
      {shouldShowAceternity(theme) && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="animated-gradient-bg opacity-10" />
        </div>
      )}
    </div>
  );
}
