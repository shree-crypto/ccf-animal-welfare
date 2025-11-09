'use client';

import { useTheme } from '@/contexts/ThemeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * ThemeDemo Component
 *
 * Demonstrates the visual differences between default and custom themes.
 * Shows color palettes, gradients, and effects for each theme.
 */
export function ThemeDemo() {
  const { theme, config } = useTheme();

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Theme Configuration Demo</h2>
        <p className="text-muted-foreground">
          Current theme: <Badge variant="outline">{config.name}</Badge>
        </p>
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>
            {theme === 'default'
              ? 'Neutral colors with subtle blues'
              : 'Trust and Action color palette'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Primary</p>
              <div className="h-20 rounded-lg bg-primary" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Secondary</p>
              <div className="h-20 rounded-lg bg-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Accent</p>
              <div className="h-20 rounded-lg bg-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>
            {theme === 'default'
              ? 'Simple solid color buttons'
              : 'Gradient buttons with hover effects'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="btn-gradient">Primary Button</Button>
            <Button className="btn-gradient-accent">Accent Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Gradients (Custom Theme Only) */}
      {config.effects.gradients && (
        <Card>
          <CardHeader>
            <CardTitle>Gradient Effects</CardTitle>
            <CardDescription>Available only in custom theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 rounded-lg gradient-bg flex items-center justify-center text-white font-bold">
                Primary Gradient
              </div>
              <div className="h-32 rounded-lg gradient-bg-secondary flex items-center justify-center text-white font-bold">
                Secondary Gradient
              </div>
              <div className="h-32 rounded-lg gradient-bg-accent flex items-center justify-center text-white font-bold">
                Accent Gradient
              </div>
              <div className="h-32 rounded-lg gradient-bg-hero flex items-center justify-center text-white font-bold">
                Animated Hero
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Card Styles</CardTitle>
          <CardDescription>
            {theme === 'default'
              ? 'Simple bordered cards'
              : 'Gradient cards with hover effects'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="card-gradient p-6 rounded-lg">
              <h3 className="font-bold mb-2">Card Title</h3>
              <p className="text-sm text-muted-foreground">
                This card adapts to the current theme
              </p>
            </div>
            <div className="card-gradient p-6 rounded-lg">
              <h3 className="font-bold mb-2">Another Card</h3>
              <p className="text-sm text-muted-foreground">
                Hover to see the effect
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Effects (Custom Theme Only) */}
      {config.effects.gradients && (
        <Card>
          <CardHeader>
            <CardTitle>Text Effects</CardTitle>
            <CardDescription>
              Gradient text available in custom theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold gradient-text">
                Gradient Text Effect
              </h2>
              <h2 className="text-4xl font-bold gradient-text-accent">
                Accent Gradient Text
              </h2>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Features</CardTitle>
          <CardDescription>What's enabled in {config.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Gradients</span>
              <Badge
                variant={config.effects.gradients ? 'default' : 'secondary'}
              >
                {config.effects.gradients ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Animations</span>
              <Badge
                variant={config.effects.animations ? 'default' : 'secondary'}
              >
                {config.effects.animations ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Aceternity Effects</span>
              <Badge
                variant={config.effects.aceternity ? 'default' : 'secondary'}
              >
                {config.effects.aceternity ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Status Colors</CardTitle>
          <CardDescription>Consistent across both themes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Success</p>
              <div className="h-16 rounded-lg bg-status-success" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Warning</p>
              <div className="h-16 rounded-lg bg-status-warning" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Error</p>
              <div className="h-16 rounded-lg bg-status-error" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Info</p>
              <div className="h-16 rounded-lg bg-status-info" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
