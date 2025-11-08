/**
 * Theme Utility Functions
 * 
 * Helper functions for working with themes in CampusPaws.
 * These utilities make it easier to apply theme-specific styles
 * and build theme-aware className strings.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ThemeVariant } from '@/types/theme';

/**
 * Combine class names with proper Tailwind CSS merging
 * This is the standard cn utility used throughout the app
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Apply theme-specific classes based on the current theme
 * 
 * @param theme - Current theme variant
 * @param customClasses - Classes to apply when theme is 'custom'
 * @param defaultClasses - Classes to apply when theme is 'default'
 * @param baseClasses - Classes to apply regardless of theme
 * @returns Combined className string
 * 
 * @example
 * const className = themeClasses(
 *   theme,
 *   'gradient-bg btn-gradient', // custom theme
 *   'bg-primary', // default theme
 *   'px-4 py-2 rounded' // base classes
 * );
 */
export function themeClasses(
  theme: ThemeVariant,
  customClasses: string = '',
  defaultClasses: string = '',
  baseClasses: string = ''
): string {
  return cn(
    baseClasses,
    theme === 'custom' ? customClasses : defaultClasses
  );
}

/**
 * Build a theme-aware className string with conditional classes
 * 
 * @param theme - Current theme variant
 * @param options - Object with base, custom, and default class options
 * @returns Combined className string
 * 
 * @example
 * const className = buildThemeClass(theme, {
 *   base: 'px-4 py-2 rounded',
 *   custom: 'gradient-bg hover:gradient-bg-hover',
 *   default: 'bg-primary hover:bg-primary-dark'
 * });
 */
export function buildThemeClass(
  theme: ThemeVariant,
  options: {
    base?: string;
    custom?: string;
    default?: string;
  }
): string {
  const { base = '', custom = '', default: defaultClass = '' } = options;
  return themeClasses(theme, custom, defaultClass, base);
}

/**
 * Check if a specific theme is active
 * 
 * @param currentTheme - Current theme variant
 * @param targetTheme - Theme to check against
 * @returns True if the target theme is active
 * 
 * @example
 * if (isThemeActive(theme, 'custom')) {
 *   // Render custom theme features
 * }
 */
export function isThemeActive(
  currentTheme: ThemeVariant,
  targetTheme: ThemeVariant
): boolean {
  return currentTheme === targetTheme;
}

/**
 * Get theme-specific value
 * 
 * @param theme - Current theme variant
 * @param customValue - Value to return for custom theme
 * @param defaultValue - Value to return for default theme
 * @returns Theme-specific value
 * 
 * @example
 * const buttonText = getThemeValue(
 *   theme,
 *   'Donate with Style',
 *   'Donate'
 * );
 */
export function getThemeValue<T>(
  theme: ThemeVariant,
  customValue: T,
  defaultValue: T
): T {
  return theme === 'custom' ? customValue : defaultValue;
}

/**
 * Apply theme classes to a button component
 * 
 * @param theme - Current theme variant
 * @param variant - Button variant (primary, secondary, accent)
 * @param baseClasses - Additional base classes
 * @returns Combined className string
 * 
 * @example
 * const className = themeButton(theme, 'primary', 'px-6 py-3');
 */
export function themeButton(
  theme: ThemeVariant,
  variant: 'primary' | 'secondary' | 'accent' = 'primary',
  baseClasses: string = ''
): string {
  const variantClasses = {
    custom: {
      primary: 'btn-gradient',
      secondary: 'gradient-bg-secondary',
      accent: 'btn-gradient-accent',
    },
    default: {
      primary: 'bg-primary hover:bg-primary/90',
      secondary: 'bg-secondary hover:bg-secondary/90',
      accent: 'bg-accent hover:bg-accent/90',
    },
  };

  return cn(
    baseClasses,
    variantClasses[theme][variant]
  );
}

/**
 * Apply theme classes to a card component
 * 
 * @param theme - Current theme variant
 * @param baseClasses - Additional base classes
 * @returns Combined className string
 * 
 * @example
 * const className = themeCard(theme, 'p-6 rounded-lg');
 */
export function themeCard(
  theme: ThemeVariant,
  baseClasses: string = ''
): string {
  return cn(
    baseClasses,
    theme === 'custom' ? 'card-gradient' : 'bg-card border border-border'
  );
}

/**
 * Apply theme classes to text with gradient effect
 * 
 * @param theme - Current theme variant
 * @param variant - Gradient variant (primary, accent)
 * @param baseClasses - Additional base classes
 * @returns Combined className string
 * 
 * @example
 * const className = themeText(theme, 'accent', 'text-4xl font-bold');
 */
export function themeText(
  theme: ThemeVariant,
  variant: 'primary' | 'accent' = 'primary',
  baseClasses: string = ''
): string {
  if (theme === 'default') {
    return cn(
      baseClasses,
      variant === 'primary' ? 'text-primary' : 'text-accent'
    );
  }

  return cn(
    baseClasses,
    variant === 'primary' ? 'gradient-text' : 'gradient-text-accent'
  );
}

/**
 * Apply theme classes to a background element
 * 
 * @param theme - Current theme variant
 * @param variant - Background variant (hero, primary, secondary)
 * @param baseClasses - Additional base classes
 * @returns Combined className string
 * 
 * @example
 * const className = themeBackground(theme, 'hero', 'min-h-screen');
 */
export function themeBackground(
  theme: ThemeVariant,
  variant: 'hero' | 'primary' | 'secondary' = 'primary',
  baseClasses: string = ''
): string {
  if (theme === 'default') {
    const defaultBgs = {
      hero: 'bg-background',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
    };
    return cn(baseClasses, defaultBgs[variant]);
  }

  const customBgs = {
    hero: 'gradient-bg-hero',
    primary: 'gradient-bg',
    secondary: 'gradient-bg-secondary',
  };
  return cn(baseClasses, customBgs[variant]);
}

/**
 * Check if Aceternity effects should be shown
 * 
 * @param theme - Current theme variant
 * @returns True if Aceternity effects should be shown
 * 
 * @example
 * {shouldShowAceternity(theme) && <AnimatedGradient />}
 */
export function shouldShowAceternity(theme: ThemeVariant): boolean {
  return theme === 'custom';
}

/**
 * Check if gradients should be used
 * 
 * @param theme - Current theme variant
 * @returns True if gradients should be used
 * 
 * @example
 * {shouldUseGradients(theme) && <div className="gradient-bg" />}
 */
export function shouldUseGradients(theme: ThemeVariant): boolean {
  return theme === 'custom';
}

/**
 * Get data attribute for Aceternity components
 * 
 * @param theme - Current theme variant
 * @returns Object with data-aceternity attribute
 * 
 * @example
 * <div {...getAceternityProps(theme)}>
 *   <AnimatedGradient />
 * </div>
 */
export function getAceternityProps(theme: ThemeVariant): {
  'data-aceternity': string;
} {
  return {
    'data-aceternity': theme === 'custom' ? 'true' : 'false',
  };
}

/**
 * Apply conditional theme classes based on a condition
 * 
 * @param theme - Current theme variant
 * @param condition - Condition to check
 * @param customClasses - Classes to apply when condition is true and theme is custom
 * @param defaultClasses - Classes to apply when condition is true and theme is default
 * @param baseClasses - Classes to apply regardless of condition
 * @returns Combined className string
 * 
 * @example
 * const className = conditionalThemeClasses(
 *   theme,
 *   isActive,
 *   'glow-primary',
 *   'ring-2 ring-primary',
 *   'px-4 py-2'
 * );
 */
export function conditionalThemeClasses(
  theme: ThemeVariant,
  condition: boolean,
  customClasses: string = '',
  defaultClasses: string = '',
  baseClasses: string = ''
): string {
  if (!condition) {
    return baseClasses;
  }
  return themeClasses(theme, customClasses, defaultClasses, baseClasses);
}
