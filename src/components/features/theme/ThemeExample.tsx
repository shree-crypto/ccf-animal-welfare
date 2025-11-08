'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Example component demonstrating theme context usage
 * This shows how to access theme state and configuration
 */
export function ThemeExample() {
  const { theme, config, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Context Example</CardTitle>
        <CardDescription>
          Current theme: {config.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Theme Variant:</p>
          <p className="text-sm text-muted-foreground">{theme}</p>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Effects Enabled:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Gradients: {config.effects.gradients ? '✓' : '✗'}</li>
            <li>Animations: {config.effects.animations ? '✓' : '✗'}</li>
            <li>Aceternity: {config.effects.aceternity ? '✓' : '✗'}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Colors:</p>
          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded border"
              style={{ backgroundColor: config.colors.primary }}
              title="Primary"
            />
            <div
              className="w-12 h-12 rounded border"
              style={{ backgroundColor: config.colors.secondary }}
              title="Secondary"
            />
            <div
              className="w-12 h-12 rounded border"
              style={{ backgroundColor: config.colors.accent }}
              title="Accent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTheme('custom')}
            className="px-4 py-2 rounded bg-primary text-primary-foreground"
            disabled={theme === 'custom'}
          >
            Custom Theme
          </button>
          <button
            onClick={() => setTheme('default')}
            className="px-4 py-2 rounded bg-secondary text-secondary-foreground"
            disabled={theme === 'default'}
          >
            Default Theme
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
