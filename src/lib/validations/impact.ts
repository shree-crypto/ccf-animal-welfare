/**
 * Impact Dashboard Validation Schemas
 *
 * Zod validation schemas for impact metrics and related data
 */

import { z } from 'zod';

// Trend direction enum
export const trendDirectionSchema = z.enum(['up', 'down', 'stable']);

// Metric value schema
export const metricValueSchema = z.object({
  total: z.number().min(0, 'Total must be non-negative'),
  current: z.number().min(0, 'Current value must be non-negative'),
  trend: trendDirectionSchema,
  percentageChange: z.number().optional(),
});

// Impact metrics schema
export const impactMetricsSchema = z.object({
  animalsRescued: metricValueSchema,
  volunteersActive: metricValueSchema,
  mealsProvided: metricValueSchema,
  successfulAdoptions: metricValueSchema,
  lastUpdated: z
    .date()
    .optional()
    .default(() => new Date()),
});

// Create impact metrics input
export const createImpactMetricsSchema = impactMetricsSchema;

// Update impact metrics input (all fields optional)
export const updateImpactMetricsSchema = impactMetricsSchema.partial();

// Trend data point schema
export const trendDataPointSchema = z.object({
  date: z.string().datetime(),
  value: z.number().min(0),
  label: z.string().optional(),
});

// Metric trend schema
export const metricTrendSchema = z.object({
  metricName: z.string().min(1, 'Metric name is required'),
  period: z.enum(['daily', 'weekly', 'monthly']),
  data: z.array(trendDataPointSchema),
});

// Recent activity schema
export const recentActivitySchema = z.object({
  type: z.enum(['donation', 'adoption', 'volunteer', 'rescue']),
  displayName: z.string().min(1, 'Display name is required').max(50),
  timestamp: z
    .date()
    .optional()
    .default(() => new Date()),
  message: z.string().max(200).optional(),
});

// Export inferred types
export type MetricValueFormData = z.infer<typeof metricValueSchema>;
export type ImpactMetricsFormData = z.infer<typeof impactMetricsSchema>;
export type TrendDataPointFormData = z.infer<typeof trendDataPointSchema>;
export type MetricTrendFormData = z.infer<typeof metricTrendSchema>;
export type RecentActivityFormData = z.infer<typeof recentActivitySchema>;
