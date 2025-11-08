/**
 * Impact Dashboard Database Operations
 * 
 * CRUD operations for impact metrics and recent activities
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import {
  ImpactMetrics,
  CreateImpactMetricsInput,
  UpdateImpactMetricsInput,
  RecentActivity,
  MetricTrend,
  TrendDataPoint,
  ImpactMetricsFilters,
} from '@/types/impact';
import {
  createImpactMetricsSchema,
  updateImpactMetricsSchema,
  recentActivitySchema,
} from '@/lib/validations/impact';
import { normalizePagination, calculatePaginationMeta, QUERY_LIMITS } from './query-config';

// Type for Appwrite document (using any to avoid type conflicts)
type ImpactMetricsDocument = any;
type RecentActivityDocument = any;

// Helper to convert Appwrite document to ImpactMetrics
const documentToImpactMetrics = (doc: ImpactMetricsDocument): ImpactMetrics => ({
  id: doc.$id,
  animalsRescued: doc.animalsRescued,
  volunteersActive: doc.volunteersActive,
  mealsProvided: doc.mealsProvided,
  successfulAdoptions: doc.successfulAdoptions,
  lastUpdated: new Date(doc.lastUpdated),
  $createdAt: doc.$createdAt,
  $updatedAt: doc.$updatedAt,
});

// Helper to convert Appwrite document to RecentActivity
const documentToRecentActivity = (doc: RecentActivityDocument): RecentActivity => ({
  id: doc.$id,
  type: doc.type,
  displayName: doc.displayName,
  timestamp: new Date(doc.timestamp),
  message: doc.message,
  $createdAt: doc.$createdAt,
});

/**
 * Get the current impact metrics
 * Returns the most recent metrics document
 */
export const getCurrentImpactMetrics = async (): Promise<ImpactMetrics | null> => {
  try {
    const response = await databases.listDocuments<ImpactMetricsDocument>(
      DATABASE_ID,
      COLLECTIONS.IMPACT_METRICS,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(1),
      ]
    );

    if (response.documents.length === 0) {
      return null;
    }

    return documentToImpactMetrics(response.documents[0]);
  } catch (error) {
    console.error('Error fetching current impact metrics:', error);
    return null;
  }
};

/**
 * Create new impact metrics
 * Used to update the dashboard with new data
 */
export const createImpactMetrics = async (
  data: CreateImpactMetricsInput
): Promise<ImpactMetrics> => {
  const validatedData = createImpactMetricsSchema.parse(data);

  const document = await databases.createDocument<ImpactMetricsDocument>(
    DATABASE_ID,
    COLLECTIONS.IMPACT_METRICS,
    ID.unique(),
    {
      ...validatedData,
      lastUpdated: new Date().toISOString(),
    }
  );

  return documentToImpactMetrics(document);
};

/**
 * Update existing impact metrics
 */
export const updateImpactMetrics = async (
  id: string,
  data: UpdateImpactMetricsInput
): Promise<ImpactMetrics> => {
  const validatedData = updateImpactMetricsSchema.parse(data);

  const document = await databases.updateDocument<ImpactMetricsDocument>(
    DATABASE_ID,
    COLLECTIONS.IMPACT_METRICS,
    id,
    {
      ...validatedData,
      lastUpdated: new Date().toISOString(),
    }
  );

  return documentToImpactMetrics(document);
};

/**
 * Get historical impact metrics for trend analysis
 * Returns metrics within the specified date range
 */
export const getHistoricalMetrics = async (
  filters?: ImpactMetricsFilters
): Promise<{
  metrics: ImpactMetrics[];
  total: number;
}> => {
  const queries: string[] = [];

  // Date range filters
  if (filters?.startDate) {
    queries.push(Query.greaterThanEqual('$createdAt', filters.startDate.toISOString()));
  }
  if (filters?.endDate) {
    queries.push(Query.lessThanEqual('$createdAt', filters.endDate.toISOString()));
  }

  // Ordering
  queries.push(Query.orderDesc('$createdAt'));

  // Pagination
  const { limit, offset } = normalizePagination({
    limit: filters?.limit || 30,
    offset: filters?.offset,
  });
  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  try {
    const response = await databases.listDocuments<ImpactMetricsDocument>(
      DATABASE_ID,
      COLLECTIONS.IMPACT_METRICS,
      queries
    );

    return {
      metrics: response.documents.map(documentToImpactMetrics),
      total: response.total,
    };
  } catch (error) {
    console.error('Error fetching historical metrics:', error);
    return {
      metrics: [],
      total: 0,
    };
  }
};

/**
 * Calculate trend data for a specific metric
 * Aggregates historical data into daily, weekly, or monthly trends
 */
export const calculateMetricTrend = async (
  metricName: keyof Pick<ImpactMetrics, 'animalsRescued' | 'volunteersActive' | 'mealsProvided' | 'successfulAdoptions'>,
  period: 'daily' | 'weekly' | 'monthly',
  days: number = 30
): Promise<MetricTrend> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { metrics } = await getHistoricalMetrics({
    startDate,
    limit: 100,
  });

  // Aggregate data based on period
  const dataPoints: TrendDataPoint[] = metrics.map(metric => ({
    date: metric.$createdAt || new Date().toISOString(),
    value: metric[metricName].current,
    label: new Date(metric.$createdAt || new Date()).toLocaleDateString(),
  }));

  return {
    metricName,
    period,
    data: dataPoints,
  };
};

/**
 * Get recent activities for the ticker
 */
export const getRecentActivities = async (limit: number = 10): Promise<RecentActivity[]> => {
  try {
    const response = await databases.listDocuments<RecentActivityDocument>(
      DATABASE_ID,
      COLLECTIONS.RECENT_ACTIVITIES,
      [
        Query.orderDesc('timestamp'),
        Query.limit(limit),
      ]
    );

    return response.documents.map(documentToRecentActivity);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

/**
 * Create a new recent activity
 */
export const createRecentActivity = async (
  data: Omit<RecentActivity, 'id' | 'timestamp'>
): Promise<RecentActivity> => {
  const validatedData = recentActivitySchema.parse(data);

  const document = await databases.createDocument<RecentActivityDocument>(
    DATABASE_ID,
    COLLECTIONS.RECENT_ACTIVITIES,
    ID.unique(),
    {
      ...validatedData,
      timestamp: new Date().toISOString(),
    }
  );

  return documentToRecentActivity(document);
};

/**
 * Delete old activities (cleanup function)
 * Keeps only the most recent activities
 */
export const cleanupOldActivities = async (keepCount: number = 100): Promise<void> => {
  try {
    const response = await databases.listDocuments<RecentActivityDocument>(
      DATABASE_ID,
      COLLECTIONS.RECENT_ACTIVITIES,
      [
        Query.orderDesc('timestamp'),
        Query.offset(keepCount),
        Query.limit(100),
      ]
    );

    // Delete old activities
    const deletePromises = response.documents.map(doc =>
      databases.deleteDocument(DATABASE_ID, COLLECTIONS.RECENT_ACTIVITIES, doc.$id)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error cleaning up old activities:', error);
  }
};
