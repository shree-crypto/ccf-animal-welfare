/**
 * Theme types for CampusPaws theme switcher
 */

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

export interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  config: ThemeConfig;
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
      primary: '#09090b',
      secondary: '#71717a',
      accent: '#18181b',
    },
    effects: {
      gradients: false,
      animations: false,
      aceternity: false,
    },
  },
};
