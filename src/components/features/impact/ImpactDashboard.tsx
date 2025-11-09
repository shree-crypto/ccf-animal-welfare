/**
 * ImpactDashboard Component
 *
 * Main container for the Live Impact Dashboard
 * Displays real-time metrics, trends, and recent activities
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

'use client';

import { useEffect, useState } from 'react';
import {
  ImpactMetrics,
  RecentActivity as RecentActivityType,
} from '@/types/impact';
import { MetricCard } from './MetricCard';
import { TrendChart } from './TrendChart';
import { RecentActivity } from './RecentActivity';
import { Heart, Users, Utensils, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface ImpactDashboardProps {
  metrics?: ImpactMetrics | null;
  activities?: RecentActivityType[];
  showTrends?: boolean;
  loading?: boolean;
  className?: string;
}

export function ImpactDashboard({
  metrics,
  activities = [],
  showTrends = false,
  loading = false,
  className,
}: ImpactDashboardProps) {
  const { config } = useTheme();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (metrics?.lastUpdated) {
      setLastUpdated(metrics.lastUpdated);
    }
  }, [metrics]);

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';

    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    return lastUpdated.toLocaleDateString();
  };

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
          Our Impact in Real-Time
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          See the difference we're making together for campus animals
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Last updated: {formatLastUpdated()}
          </p>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Animals Rescued"
          metric={
            metrics?.animalsRescued || {
              total: 0,
              current: 0,
              trend: 'stable',
            }
          }
          icon={<Heart className="h-5 w-5" />}
          description="This month"
          loading={loading}
        />

        <MetricCard
          title="Active Volunteers"
          metric={
            metrics?.volunteersActive || {
              total: 0,
              current: 0,
              trend: 'stable',
            }
          }
          icon={<Users className="h-5 w-5" />}
          description="This week"
          loading={loading}
        />

        <MetricCard
          title="Meals Provided"
          metric={
            metrics?.mealsProvided || {
              total: 0,
              current: 0,
              trend: 'stable',
            }
          }
          icon={<Utensils className="h-5 w-5" />}
          description="This week"
          loading={loading}
        />

        <MetricCard
          title="Successful Adoptions"
          metric={
            metrics?.successfulAdoptions || {
              total: 0,
              current: 0,
              trend: 'stable',
            }
          }
          icon={<Home className="h-5 w-5" />}
          description="This month"
          loading={loading}
        />
      </div>

      {/* Trends Section (optional) */}
      {showTrends && (
        <div className="grid gap-4 md:grid-cols-2">
          <TrendChart
            trend={{
              metricName: 'Animals Rescued',
              period: 'daily',
              data: [],
            }}
            title="Rescue Trend"
            loading={loading}
          />
          <TrendChart
            trend={{
              metricName: 'Adoptions',
              period: 'daily',
              data: [],
            }}
            title="Adoption Trend"
            loading={loading}
          />
        </div>
      )}

      {/* Recent Activity */}
      <RecentActivity
        activities={activities}
        loading={loading}
        autoScroll={true}
      />

      {/* Call to Action */}
      <div className={cn(
        "text-center py-8 px-4 rounded-lg",
        config.effects.gradients
          ? "bg-blue-50/50 dark:bg-blue-950/30"
          : "bg-muted"
      )}>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Be Part of the Change
        </h3>
        <p className="text-muted-foreground mb-4">
          Every contribution makes a difference in the lives of campus animals
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/donate"
            className={cn(
              'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors',
              config.effects.gradients
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            Donate Now
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
          >
            Become a Volunteer
          </a>
        </div>
      </div>
    </div>
  );
}
