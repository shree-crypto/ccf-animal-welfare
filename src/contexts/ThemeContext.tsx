'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ThemeVariant, ThemeConfig, ThemeContextType, THEME_CONFIGS } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'campuspaws-theme';

/**
 * ThemeProvider manages theme state and persistence.
 * 
 * Features:
 * - Persists theme preference in localStorage
 * - Applies theme to document root via data-theme attribute
 * - Provides theme configuration based on selected variant
 * - Uses useMemo and useCallback for optimal performance
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeVariant>('custom');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeVariant | null;
    if (storedTheme && (storedTheme === 'custom' || storedTheme === 'default')) {
      setThemeState(storedTheme);
    }
    setMounted(true);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: ThemeVariant) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  const config = useMemo<ThemeConfig>(() => THEME_CONFIGS[theme], [theme]);

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      setTheme,
      config,
    }),
    [theme, setTheme, config]
  );

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 * 
 * @throws Error if used outside ThemeProvider
 * @returns ThemeContextType with current theme, setTheme function, and config
 * 
 * @example
 * const { theme, setTheme, config } = useTheme();
 * 
 * // Switch theme
 * setTheme('default');
 * 
 * // Check if gradients are enabled
 * if (config.effects.gradients) {
 *   // Render gradient background
 * }
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
