/**
 * Theme Configuration Index
 *
 * This file exports theme metadata and utilities for the CampusPaws theme system.
 * The actual CSS variables are defined in default.css and custom.css.
 */

export type ThemeVariant = 'default' | 'custom';

export interface ThemeMetadata {
  id: ThemeVariant;
  name: string;
  description: string;
  features: {
    gradients: boolean;
    animations: boolean;
    aceternity: boolean;
  };
}

/**
 * Available themes with their metadata
 */
export const themes: Record<ThemeVariant, ThemeMetadata> = {
  default: {
    id: 'default',
    name: 'Clean Default',
    description:
      'Minimal shadcn/ui theme with neutral colors and simple styling',
    features: {
      gradients: false,
      animations: false,
      aceternity: false,
    },
  },
  custom: {
    id: 'custom',
    name: 'CampusPaws',
    description:
      'Full CampusPaws branding with gradients and Aceternity effects',
    features: {
      gradients: true,
      animations: true,
      aceternity: true,
    },
  },
};

/**
 * Get theme metadata by variant
 */
export function getThemeMetadata(variant: ThemeVariant): ThemeMetadata {
  return themes[variant];
}

/**
 * Check if a theme has a specific feature
 */
export function hasThemeFeature(
  variant: ThemeVariant,
  feature: keyof ThemeMetadata['features']
): boolean {
  return themes[variant].features[feature];
}

/**
 * Get all available theme variants
 */
export function getAvailableThemes(): ThemeVariant[] {
  return Object.keys(themes) as ThemeVariant[];
}
