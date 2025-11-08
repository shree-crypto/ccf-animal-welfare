/**
 * ImpactDashboardWithTrends Component
 * 
 * Enhanced dashboard with historical trend visualizations
 * Requirements: 3.4
 */

'use client';

import { useState } from 'react';
import { ImpactDashboard } from './ImpactDashboard';
import { TrendChart } from './TrendChart';
import { useImpactMetrics, useMetricTrend } from '@/hooks/useImpactMetrics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImpactDashboardWithTrendsProps {
  className?: string;
}

export function ImpactDashboardWithTrends({ className }: ImpactDashboardWithTrendsProps) {
  const { metrics, activities, loading, error, refetch } = useImpactMetrics();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Fetch trends for each metric
  const animalsRescuedTrend = useMetricTrend('animalsRescued', selectedPeriod, 30);
  const volunteersActiveTrend = useMetricTrend('volunteersActive', selectedPeriod, 30);
  const mealsProvidedTrend = useMetricTrend('mealsProvided', selectedPeriod, 30);
  const successfulAdoptionsTrend = useMetricTrend('successfulAdoptions', selectedPeriod, 30);

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load impact metrics. Please try again.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="ml-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-8', className)}>
      {/* Main Dashboard */}
      <ImpactDashboard
        metrics={metrics}
        activities={activities}
        showTrends={false}
        loading={loading}
      />

      {/* Trends Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historical Trends
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track our progress over time
            </p>
          </div>

          {/* Period Selector */}
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Trend Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <TrendChart
            trend={animalsRescuedTrend.trend || {
              metricName: 'Animals Rescued',
              period: selectedPeriod,
              data: [],
            }}
            title="Animals Rescued"
            loading={animalsRescuedTrend.loading}
          />

          <TrendChart
            trend={successfulAdoptionsTrend.trend || {
              metricName: 'Successful Adoptions',
              period: selectedPeriod,
              data: [],
            }}
            title="Successful Adoptions"
            loading={successfulAdoptionsTrend.loading}
          />

          <TrendChart
            trend={volunteersActiveTrend.trend || {
              metricName: 'Active Volunteers',
              period: selectedPeriod,
              data: [],
            }}
            title="Active Volunteers"
            loading={volunteersActiveTrend.loading}
          />

          <TrendChart
            trend={mealsProvidedTrend.trend || {
              metricName: 'Meals Provided',
              period: selectedPeriod,
              data: [],
            }}
            title="Meals Provided"
            loading={mealsProvidedTrend.loading}
          />
        </div>
      </div>

      {/* Insights Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Key Insights
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics && (
            <>
              {metrics.animalsRescued.trend === 'up' && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                      Rescue Rate Increasing
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      We've rescued {metrics.animalsRescued.percentageChange?.toFixed(1)}% more animals this period
                    </p>
                  </div>
                </div>
              )}

              {metrics.volunteersActive.trend === 'up' && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Growing Community
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Volunteer participation is up {metrics.volunteersActive.percentageChange?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {metrics.successfulAdoptions.trend === 'up' && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                      More Happy Endings
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      Adoptions increased by {metrics.successfulAdoptions.percentageChange?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
