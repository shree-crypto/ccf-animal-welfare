/**
 * TrendChart Component
 * 
 * Displays historical trend data for metrics
 * Requirements: 3.4
 * 
 * Note: This component uses Recharts for visualization.
 * Install with: npm install recharts
 */

'use client';

import { MetricTrend } from '@/types/impact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  trend: MetricTrend;
  title?: string;
  loading?: boolean;
  className?: string;
}

export function TrendChart({ trend, title, loading = false, className }: TrendChartProps) {
  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="text-lg">{title || 'Trend'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simple SVG-based chart (fallback if Recharts is not installed)
  const maxValue = Math.max(...trend.data.map(d => d.value));
  const minValue = Math.min(...trend.data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = trend.data.map((point, index) => {
    const x = (index / (trend.data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {title || `${trend.metricName} Trend`}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {trend.period} view • Last {trend.data.length} data points
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 w-full">
          {/* SVG Chart */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            {/* Grid lines */}
            <line
              x1="0"
              y1="25"
              x2="100"
              y2="25"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-gray-300 dark:text-gray-700"
            />
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-gray-300 dark:text-gray-700"
            />
            <line
              x1="0"
              y1="75"
              x2="100"
              y2="75"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-gray-300 dark:text-gray-700"
            />

            {/* Area fill */}
            <polygon
              points={`0,100 ${points} 100,100`}
              fill="url(#gradient)"
              opacity="0.3"
            />

            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Value labels */}
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{maxValue.toLocaleString()}</span>
            <span>{Math.round((maxValue + minValue) / 2).toLocaleString()}</span>
            <span>{minValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Date range */}
        <div className="mt-4 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{trend.data[0]?.label || 'Start'}</span>
          <span>{trend.data[trend.data.length - 1]?.label || 'End'}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * TrendChart with Recharts (Enhanced Version)
 * 
 * Uncomment and use this version after installing Recharts:
 * npm install recharts
 */

/*
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

export function TrendChart({ trend, title, loading = false, className }: TrendChartProps) {
  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="text-lg">{title || 'Trend'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = trend.data.map(point => ({
    date: point.label || new Date(point.date).toLocaleDateString(),
    value: point.value,
  }));

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {title || `${trend.metricName} Trend`}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {trend.period} view • Last {trend.data.length} data points
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
*/
