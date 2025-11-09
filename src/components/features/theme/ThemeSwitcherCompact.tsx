'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Palette, Sparkles } from 'lucide-react';
import { ThemeVariant, THEME_CONFIGS } from '@/types/theme';

/**
 * ThemeSwitcherCompact Component
 *
 * Compact icon-only theme switcher for header/navigation.
 * Shows current theme icon and opens dropdown on click.
 *
 * Features:
 * - Icon-only display (saves space in header)
 * - Visual theme preview icons
 * - Dropdown with theme names and descriptions
 * - Accessible with proper ARIA labels
 */
export function ThemeSwitcherCompact() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value as ThemeVariant);
  };

  const getThemeIcon = (variant: ThemeVariant, className?: string) => {
    if (variant === 'custom') {
      return <Sparkles className={className || 'h-5 w-5'} />;
    }
    return <Palette className={className || 'h-5 w-5'} />;
  };

  const currentConfig = THEME_CONFIGS[theme];

  return (
    <Select value={theme} onValueChange={handleThemeChange}>
      <SelectTrigger className="h-9 w-9 p-0 border-0 bg-transparent hover:bg-accent">
        <span className="sr-only">Current theme: {currentConfig.name}. Click to change theme.</span>
        {getThemeIcon(theme)}
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(THEME_CONFIGS).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-3">
              {getThemeIcon(config.variant, 'h-4 w-4')}
              <div className="flex flex-col">
                <span className="font-medium">{config.name}</span>
                <span className="text-xs text-muted-foreground">
                  {config.description}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
