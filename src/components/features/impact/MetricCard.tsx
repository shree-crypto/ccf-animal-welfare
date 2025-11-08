/**
 * MetricCard Component
 * 
 * Displays a single impact metric with trend indicator
 * Requirements: 3.1, 3.2
 */

'use client';

import { MetricValue } from '@/types/impact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface MetricCardProps {
  title: string;
  metric: MetricValue;
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  metric,
  icon,
  description,
  loading = false,
  className,
}: MetricCardProps) {
  const { config } = useTheme();
  
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('relative overflow-hidden transition-shadow hover:shadow-lg', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Current value */}
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {metric.current.toLocaleString()}
            </div>
            <Badge
              variant="secondary"
              className={cn('flex items-center gap-1', getTrendColor())}
            >
              {getTrendIcon()}
              {metric.percentageChange !== undefined && (
                <span className="text-xs font-semibold">
                  {metric.percentageChange > 0 ? '+' : ''}
                  {metric.percentageChange.toFixed(1)}%
                </span>
              )}
            </Badge>
          </div>

          {/* Total value */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: <span className="font-semibold">{metric.total.toLocaleString()}</span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>

      {/* Decorative gradient - only in custom theme */}
      {config.effects.gradients && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
      )}
    </Card>
  );
}
