/**
 * useImpactMetrics Hook
 * 
 * Custom hook for fetching and subscribing to real-time impact metrics
 * Requirements: 3.3
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { client } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import { ImpactMetrics, RecentActivity } from '@/types/impact';
import {
  getCurrentImpactMetrics,
  getRecentActivities,
} from '@/lib/db/impact';

interface UseImpactMetricsReturn {
  metrics: ImpactMetrics | null;
  activities: RecentActivity[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and subscribe to real-time impact metrics
 */
export function useImpactMetrics(): UseImpactMetricsReturn {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, activitiesData] = await Promise.all([
        getCurrentImpactMetrics(),
        getRecentActivities(10),
      ]);

      setMetrics(metricsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error fetching impact metrics:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to real-time updates for metrics
  useEffect(() => {
    const unsubscribeMetrics = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.IMPACT_METRICS}.documents`,
      (response) => {
        const payload = response.payload as any;

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          // New metrics created
          const newMetrics: ImpactMetrics = {
            id: payload.$id,
            animalsRescued: payload.animalsRescued,
            volunteersActive: payload.volunteersActive,
            mealsProvided: payload.mealsProvided,
            successfulAdoptions: payload.successfulAdoptions,
            lastUpdated: new Date(payload.lastUpdated),
            $createdAt: payload.$createdAt,
            $updatedAt: payload.$updatedAt,
          };
          setMetrics(newMetrics);
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          // Metrics updated
          const updatedMetrics: ImpactMetrics = {
            id: payload.$id,
            animalsRescued: payload.animalsRescued,
            volunteersActive: payload.volunteersActive,
            mealsProvided: payload.mealsProvided,
            successfulAdoptions: payload.successfulAdoptions,
            lastUpdated: new Date(payload.lastUpdated),
            $createdAt: payload.$createdAt,
            $updatedAt: payload.$updatedAt,
          };
          setMetrics(updatedMetrics);
        }
      }
    );

    return () => {
      unsubscribeMetrics();
    };
  }, []);

  // Subscribe to real-time updates for activities
  useEffect(() => {
    const unsubscribeActivities = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.RECENT_ACTIVITIES}.documents`,
      (response) => {
        const payload = response.payload as any;

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          // New activity created
          const newActivity: RecentActivity = {
            id: payload.$id,
            type: payload.type,
            displayName: payload.displayName,
            timestamp: new Date(payload.timestamp),
            message: payload.message,
            $createdAt: payload.$createdAt,
          };

          // Add to the beginning of the list and keep only the latest 10
          setActivities(prev => [newActivity, ...prev].slice(0, 10));
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          // Activity deleted
          setActivities(prev => prev.filter(activity => activity.id !== payload.$id));
        }
      }
    );

    return () => {
      unsubscribeActivities();
    };
  }, []);

  return {
    metrics,
    activities,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook to fetch and subscribe to a specific metric's trend data
 */
export function useMetricTrend(
  metricName: keyof Pick<ImpactMetrics, 'animalsRescued' | 'volunteersActive' | 'mealsProvided' | 'successfulAdoptions'>,
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  days: number = 30
) {
  const [trend, setTrend] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);
        setError(null);

        // Import dynamically to avoid circular dependencies
        const { calculateMetricTrend } = await import('@/lib/db/impact');
        const trendData = await calculateMetricTrend(metricName, period, days);
        setTrend(trendData);
      } catch (err) {
        console.error('Error fetching metric trend:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch trend'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, [metricName, period, days]);

  return { trend, loading, error };
}
