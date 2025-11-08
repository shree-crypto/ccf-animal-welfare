/**
 * Theme Configuration Tests
 *
 * Tests for theme metadata and utilities
 */

import { describe, it, expect } from 'vitest';
import {
  themes,
  getThemeMetadata,
  hasThemeFeature,
  getAvailableThemes,
  type ThemeVariant,
} from '@/styles/themes';

describe('Theme Configuration', () => {
  describe('themes object', () => {
    it('should have default and custom themes', () => {
      expect(themes).toHaveProperty('default');
      expect(themes).toHaveProperty('custom');
    });

    it('should have correct default theme metadata', () => {
      const defaultTheme = themes.default;
      expect(defaultTheme.id).toBe('default');
      expect(defaultTheme.name).toBe('Clean Default');
      expect(defaultTheme.features.gradients).toBe(false);
      expect(defaultTheme.features.animations).toBe(false);
      expect(defaultTheme.features.aceternity).toBe(false);
    });

    it('should have correct custom theme metadata', () => {
      const customTheme = themes.custom;
      expect(customTheme.id).toBe('custom');
      expect(customTheme.name).toBe('CampusPaws');
      expect(customTheme.features.gradients).toBe(true);
      expect(customTheme.features.animations).toBe(true);
      expect(customTheme.features.aceternity).toBe(true);
    });
  });

  describe('getThemeMetadata', () => {
    it('should return correct metadata for default theme', () => {
      const metadata = getThemeMetadata('default');
      expect(metadata.id).toBe('default');
      expect(metadata.name).toBe('Clean Default');
    });

    it('should return correct metadata for custom theme', () => {
      const metadata = getThemeMetadata('custom');
      expect(metadata.id).toBe('custom');
      expect(metadata.name).toBe('CampusPaws');
    });
  });

  describe('hasThemeFeature', () => {
    it('should return false for default theme features', () => {
      expect(hasThemeFeature('default', 'gradients')).toBe(false);
      expect(hasThemeFeature('default', 'animations')).toBe(false);
      expect(hasThemeFeature('default', 'aceternity')).toBe(false);
    });

    it('should return true for custom theme features', () => {
      expect(hasThemeFeature('custom', 'gradients')).toBe(true);
      expect(hasThemeFeature('custom', 'animations')).toBe(true);
      expect(hasThemeFeature('custom', 'aceternity')).toBe(true);
    });
  });

  describe('getAvailableThemes', () => {
    it('should return array of theme variants', () => {
      const themes = getAvailableThemes();
      expect(themes).toEqual(['default', 'custom']);
    });

    it('should return correct number of themes', () => {
      const themes = getAvailableThemes();
      expect(themes).toHaveLength(2);
    });
  });

  describe('Theme Features', () => {
    it('default theme should have no visual effects', () => {
      const defaultTheme = themes.default;
      expect(defaultTheme.features.gradients).toBe(false);
      expect(defaultTheme.features.animations).toBe(false);
      expect(defaultTheme.features.aceternity).toBe(false);
    });

    it('custom theme should have all visual effects', () => {
      const customTheme = themes.custom;
      expect(customTheme.features.gradients).toBe(true);
      expect(customTheme.features.animations).toBe(true);
      expect(customTheme.features.aceternity).toBe(true);
    });
  });

  describe('Theme Descriptions', () => {
    it('should have meaningful descriptions', () => {
      expect(themes.default.description).toContain('shadcn/ui');
      expect(themes.custom.description).toContain('CampusPaws');
    });
  });
});
