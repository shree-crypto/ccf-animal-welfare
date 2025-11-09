'use client';

import { useTheme } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Palette, Sparkles } from 'lucide-react';
import { ThemeVariant, THEME_CONFIGS } from '@/types/theme';

/**
 * ThemeSwitcher Component
 *
 * Dropdown component for switching between custom and default themes.
 * Shows current theme with icon and allows selection from available themes.
 *
 * Features:
 * - Visual theme preview icons (colorful for custom, minimal for default)
 * - Shows current theme name
 * - Dropdown with all available themes
 * - Persists selection via ThemeContext
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value as ThemeVariant);
  };

  const getThemeIcon = (variant: ThemeVariant) => {
    if (variant === 'custom') {
      return <Sparkles className="h-4 w-4 text-primary" />;
    }
    return <Palette className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Select value={theme} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-[180px]" aria-label="Select theme">
        <div className="flex items-center gap-2">
          {getThemeIcon(theme)}
          <SelectValue placeholder="Select theme" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(THEME_CONFIGS).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              {getThemeIcon(config.variant)}
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
