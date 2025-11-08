/**
 * Impact Dashboard Types
 * 
 * Type definitions for the Live Impact Dashboard feature
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

export type TrendDirection = 'up' | 'down' | 'stable';

export interface MetricValue {
  total: number;
  current: number; // Current period (this month/week)
  trend: TrendDirection;
  percentageChange?: number;
}

export interface ImpactMetrics {
  id: string;
  animalsRescued: MetricValue;
  volunteersActive: MetricValue;
  mealsProvided: MetricValue;
  successfulAdoptions: MetricValue;
  lastUpdated: Date;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface TrendDataPoint {
  date: string; // ISO date string
  value: number;
  label?: string; // Optional label for display
}

export interface MetricTrend {
  metricName: string;
  period: 'daily' | 'weekly' | 'monthly';
  data: TrendDataPoint[];
}

export interface RecentActivity {
  id: string;
  type: 'donation' | 'adoption' | 'volunteer' | 'rescue';
  displayName: string; // First name only or "Anonymous"
  timestamp: Date;
  message?: string;
  $createdAt?: string;
}

// Form data for creating/updating metrics
export interface CreateImpactMetricsInput {
  animalsRescued: MetricValue;
  volunteersActive: MetricValue;
  mealsProvided: MetricValue;
  successfulAdoptions: MetricValue;
}

export interface UpdateImpactMetricsInput extends Partial<CreateImpactMetricsInput> {
  lastUpdated?: Date;
}

// Filter options for querying metrics
export interface ImpactMetricsFilters {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
