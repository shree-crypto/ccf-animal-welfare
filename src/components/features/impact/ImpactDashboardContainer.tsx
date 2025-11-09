/**
 * ImpactDashboardContainer Component
 *
 * Container component that handles data fetching and real-time updates
 * Requirements: 3.3
 */

'use client';

import { ImpactDashboard } from './ImpactDashboard';
import { useImpactMetrics } from '@/hooks/useImpactMetrics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImpactDashboardContainerProps {
  showTrends?: boolean;
  className?: string;
}

export function ImpactDashboardContainer({
  showTrends = false,
  className,
}: ImpactDashboardContainerProps) {
  const { metrics, activities, loading, error, refetch } = useImpactMetrics();

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
    <ImpactDashboard
      metrics={metrics}
      activities={activities}
      showTrends={showTrends}
      loading={loading}
      className={className}
    />
  );
}
