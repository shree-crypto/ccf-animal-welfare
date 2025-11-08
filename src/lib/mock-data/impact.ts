/**
 * Mock Impact Dashboard Data
 * 
 * Mock data for development and testing of the Live Impact Dashboard
 * 
 * This data is currently used by default in useImpactMetrics hook
 * until the Appwrite backend is fully configured.
 * 
 * To switch to real backend:
 * 1. Set up Appwrite collections (see docs/IMPACT_DASHBOARD_SETUP.md)
 * 2. Change USE_MOCK_DATA to false in src/hooks/useImpactMetrics.ts
 */

import { ImpactMetrics, RecentActivity, MetricTrend } from '@/types/impact';

/**
 * Mock current impact metrics
 */
export const mockCurrentMetrics: ImpactMetrics = {
  id: 'mock-metrics-1',
  animalsRescued: {
    total: 247,
    current: 18, // This month
    trend: 'up',
    percentageChange: 12.5,
  },
  volunteersActive: {
    total: 89,
    current: 12, // This week
    trend: 'up',
    percentageChange: 8.3,
  },
  mealsProvided: {
    total: 3456,
    current: 234, // This week
    trend: 'stable',
    percentageChange: 0.5,
  },
  successfulAdoptions: {
    total: 156,
    current: 8, // This month
    trend: 'up',
    percentageChange: 14.2,
  },
  lastUpdated: new Date(),
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
};

/**
 * Mock recent activities for the ticker
 */
export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'activity-1',
    type: 'donation',
    displayName: 'Sarah M.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    message: 'donated ₹500',
    $createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'activity-2',
    type: 'adoption',
    displayName: 'Raj K.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    message: 'adopted Max',
    $createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'activity-3',
    type: 'volunteer',
    displayName: 'Priya S.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    message: 'joined as volunteer',
    $createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'activity-4',
    type: 'rescue',
    displayName: 'Anonymous',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    message: 'reported rescue case',
    $createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'activity-5',
    type: 'donation',
    displayName: 'Amit P.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    message: 'donated ₹1000',
    $createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'activity-6',
    type: 'adoption',
    displayName: 'Neha R.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    message: 'adopted Bella',
    $createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'activity-7',
    type: 'volunteer',
    displayName: 'Vikram T.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    message: 'completed feeding task',
    $createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'activity-8',
    type: 'donation',
    displayName: 'Anonymous',
    timestamp: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
    message: 'donated ₹250',
    $createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
];

/**
 * Generate mock trend data for the last 30 days
 */
export const generateMockTrendData = (
  metricName: string,
  baseValue: number,
  days: number = 30
): MetricTrend => {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic variation
    const variation = Math.random() * 0.3 - 0.15; // ±15%
    const value = Math.round(baseValue * (1 + variation));

    data.push({
      date: date.toISOString(),
      value: Math.max(0, value),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }

  return {
    metricName,
    period: 'daily',
    data,
  };
};

/**
 * Mock trend data for all metrics
 */
export const mockTrendData = {
  animalsRescued: generateMockTrendData('animalsRescued', 18, 30),
  volunteersActive: generateMockTrendData('volunteersActive', 12, 30),
  mealsProvided: generateMockTrendData('mealsProvided', 234, 30),
  successfulAdoptions: generateMockTrendData('successfulAdoptions', 8, 30),
};

/**
 * Mock historical metrics for the last 7 days
 */
export const mockHistoricalMetrics: ImpactMetrics[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));

  return {
    id: `mock-metrics-${i + 1}`,
    animalsRescued: {
      total: 247 - (6 - i) * 2,
      current: 15 + Math.floor(Math.random() * 5),
      trend: 'up',
      percentageChange: 10 + Math.random() * 5,
    },
    volunteersActive: {
      total: 89 - (6 - i),
      current: 10 + Math.floor(Math.random() * 4),
      trend: 'up',
      percentageChange: 5 + Math.random() * 5,
    },
    mealsProvided: {
      total: 3456 - (6 - i) * 30,
      current: 220 + Math.floor(Math.random() * 30),
      trend: 'stable',
      percentageChange: Math.random() * 2,
    },
    successfulAdoptions: {
      total: 156 - (6 - i),
      current: 6 + Math.floor(Math.random() * 3),
      trend: 'up',
      percentageChange: 12 + Math.random() * 5,
    },
    lastUpdated: date,
    $createdAt: date.toISOString(),
    $updatedAt: date.toISOString(),
  };
});
