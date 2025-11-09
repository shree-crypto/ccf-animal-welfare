import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Default: Subtle in default theme, vibrant gradient in custom theme
        default: 'badge-default border-transparent text-primary-foreground',
        // Secondary: Subtle in default theme, vibrant gradient in custom theme
        secondary:
          'badge-secondary border-transparent text-secondary-foreground',
        // Accent: Vibrant in custom theme
        accent: 'badge-accent border-transparent text-accent-foreground',
        // Success: Green badge
        success: 'badge-success border-transparent text-white',
        // Warning: Orange/yellow badge
        warning: 'badge-warning border-transparent text-white',
        // Destructive: Red badge
        destructive:
          'badge-destructive border-transparent text-destructive-foreground',
        // Outline: Border only
        outline: 'text-foreground border-border bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
