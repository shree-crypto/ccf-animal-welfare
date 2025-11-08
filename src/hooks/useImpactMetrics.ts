/**
 * useImpactMetrics Hook
 * 
 * Custom hook for fetching and subscribing to real-time impact metrics
 * Requirements: 3.3
 * 
 * Note: Currently using mock data. Set USE_MOCK_DATA to false to use Appwrite backend.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { ImpactMetrics, RecentActivity } from '@/types/impact';
import {
  mockCurrentMetrics,
  mockRecentActivities,
} from '@/lib/mock-data/impact';

// Toggle this to switch between mock data and real Appwrite backend
const USE_MOCK_DATA = true;

interface UseImpactMetricsReturn {
  metrics: ImpactMetrics | null;
  activities: RecentActivity[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and subscribe to real-time impact metrics
 * Currently using mock data for development
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

      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setMetrics(mockCurrentMetrics);
        setActivities(mockRecentActivities);
      } else {
        // Real Appwrite implementation (uncomment when backend is ready)
        /*
        const { getCurrentImpactMetrics, getRecentActivities } = await import('@/lib/db/impact');
        const [metricsData, activitiesData] = await Promise.all([
          getCurrentImpactMetrics(),
          getRecentActivities(10),
        ]);
        setMetrics(metricsData);
        setActivities(activitiesData);
        */
        throw new Error('Appwrite backend not configured. Set USE_MOCK_DATA to true.');
      }
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

  // Simulate real-time updates with mock data
  useEffect(() => {
    if (!USE_MOCK_DATA) {
      // Real Appwrite Realtime implementation (uncomment when backend is ready)
      /*
      const { client } = await import('@/lib/appwrite');
      const { DATABASE_ID, COLLECTIONS } = await import('@/lib/constants/database');
      
      const unsubscribeMetrics = client.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTIONS.IMPACT_METRICS}.documents`,
        (response) => {
          const payload = response.payload as any;
          if (response.events.includes('databases.*.collections.*.documents.*.create') ||
              response.events.includes('databases.*.collections.*.documents.*.update')) {
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
          }
        }
      );

      const unsubscribeActivities = client.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTIONS.RECENT_ACTIVITIES}.documents`,
        (response) => {
          const payload = response.payload as any;
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            const newActivity: RecentActivity = {
              id: payload.$id,
              type: payload.type,
              displayName: payload.displayName,
              timestamp: new Date(payload.timestamp),
              message: payload.message,
              $createdAt: payload.$createdAt,
            };
            setActivities(prev => [newActivity, ...prev].slice(0, 10));
          } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
            setActivities(prev => prev.filter(activity => activity.id !== payload.$id));
          }
        }
      );

      return () => {
        unsubscribeMetrics();
        unsubscribeActivities();
      };
      */
    }

    // Mock real-time updates: simulate new activity every 30 seconds
    const interval = setInterval(() => {
      const activityTypes: Array<'donation' | 'adoption' | 'volunteer' | 'rescue'> = [
        'donation',
        'adoption',
        'volunteer',
        'rescue',
      ];
      const names = ['Priya S.', 'Amit K.', 'Neha R.', 'Raj M.', 'Sarah T.', 'Anonymous'];
      const messages = [
        'donated ₹500',
        'adopted a dog',
        'joined as volunteer',
        'reported rescue case',
      ];

      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const newActivity: RecentActivity = {
        id: `activity-${Date.now()}`,
        type: randomType,
        displayName: randomName,
        timestamp: new Date(),
        message: randomMessage,
        $createdAt: new Date().toISOString(),
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
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
 * Currently using mock data for development
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

        if (USE_MOCK_DATA) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Import mock trend data
          const { generateMockTrendData } = await import('@/lib/mock-data/impact');
          
          // Generate trend data based on metric name
          const baseValues: Record<string, number> = {
            animalsRescued: 18,
            volunteersActive: 12,
            mealsProvided: 234,
            successfulAdoptions: 8,
          };
          
          const trendData = generateMockTrendData(
            metricName,
            baseValues[metricName] || 10,
            days
          );
          
          setTrend(trendData);
        } else {
          // Real Appwrite implementation (uncomment when backend is ready)
          /*
          const { calculateMetricTrend } = await import('@/lib/db/impact');
          const trendData = await calculateMetricTrend(metricName, period, days);
          setTrend(trendData);
          */
          throw new Error('Appwrite backend not configured. Set USE_MOCK_DATA to true.');
        }
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
