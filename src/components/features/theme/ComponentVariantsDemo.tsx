'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * ComponentVariantsDemo
 *
 * Demonstrates all theme variants for Button, Card, and Badge components.
 * Shows how components adapt between custom and default themes.
 */
export function ComponentVariantsDemo() {
  const { theme } = useTheme();

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Component Theme Variants</h1>
        <p className="text-muted-foreground">
          Current theme: <span className="font-semibold">{theme}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {theme === 'custom'
            ? 'Custom theme shows gradients, shadows, and vibrant colors'
            : 'Default theme shows clean, minimal styling'}
        </p>
      </div>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>
            Buttons with different variants and sizes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Default Variant
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Secondary Variant
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="secondary">Default</Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Accent Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Accent Variant
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="accent" size="sm">
                Small
              </Button>
              <Button variant="accent">Default</Button>
              <Button variant="accent" size="lg">
                Large
              </Button>
              <Button variant="accent" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Other Variants */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Other Variants
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Card Variants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Default Card */}
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                Standard card with theme-aware styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card uses the default variant. In custom theme, it has
                gradients and shadows. In default theme, it has simple borders.
              </p>
            </CardContent>
          </Card>

          {/* Elevated Card */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Card with more prominent shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card has a more prominent shadow effect to stand out from
                the page.
              </p>
            </CardContent>
          </Card>

          {/* Outline Card */}
          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
              <CardDescription>Border only, no background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card has only a border with transparent background.
              </p>
            </CardContent>
          </Card>

          {/* Ghost Card */}
          <Card variant="ghost">
            <CardHeader>
              <CardTitle>Ghost Card</CardTitle>
              <CardDescription>No border or background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card has no border or background, just content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Badge Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Variants</CardTitle>
          <CardDescription>
            Badges with different variants and colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Badges */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Status Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Use Cases
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">Animal Status:</span>
                <Badge variant="success">Healthy</Badge>
                <Badge variant="warning">Needs Attention</Badge>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Task Priority:</span>
                <Badge variant="destructive">High</Badge>
                <Badge variant="accent">Medium</Badge>
                <Badge>Low</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Categories:</span>
                <Badge variant="secondary">Dog</Badge>
                <Badge variant="secondary">Cat</Badge>
                <Badge variant="outline">Other</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Example */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Example</CardTitle>
          <CardDescription>
            A complete example combining all components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Max - Golden Retriever</h3>
              <p className="text-sm text-muted-foreground">
                3 years old • Territory A
              </p>
            </div>
            <Badge variant="success">Healthy</Badge>
          </div>

          <p className="text-sm">
            Max is a friendly golden retriever who loves to play fetch. He's
            been with us for 2 years and is looking for a loving home.
          </p>

          <div className="flex gap-2">
            <Button variant="accent">Adopt Me</Button>
            <Button variant="secondary">Learn More</Button>
            <Button variant="outline">Share</Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Comparison */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Theme Comparison</CardTitle>
          <CardDescription>
            How components differ between themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Custom Theme</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Gradient backgrounds on buttons</li>
                  <li>Hover effects with shadows and transforms</li>
                  <li>Vibrant, colorful badges</li>
                  <li>Cards with gradient borders and shadows</li>
                  <li>Smooth animations and transitions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Default Theme</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Solid color backgrounds</li>
                  <li>Subtle hover effects</li>
                  <li>Muted, professional badges</li>
                  <li>Simple borders and shadows</li>
                  <li>Clean, minimal styling</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
