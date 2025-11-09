/**
 * Query Configuration and Constants
 *
 * Centralized configuration for database query optimization including
 * pagination defaults, limits, and query patterns.
 */

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;

// Query limits for specific use cases
export const QUERY_LIMITS = {
  SEARCH_RESULTS: 50,
  DASHBOARD_ITEMS: 10,
  NOTIFICATION_BATCH: 20,
  MEDICAL_HISTORY: 50,
  TASK_LIST: 25,
  ANIMAL_GALLERY: 25,
  TERRITORY_LIST: 50,
} as const;

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 15, // 15 minutes
  LONG: 1000 * 60 * 60, // 1 hour
} as const;

/**
 * Normalize pagination parameters to ensure they're within acceptable bounds
 */
export function normalizePagination(options?: {
  limit?: number;
  offset?: number;
}): { limit: number; offset: number } {
  const limit = Math.min(
    Math.max(options?.limit || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );
  const offset = Math.max(options?.offset || PAGINATION.DEFAULT_OFFSET, 0);

  return { limit, offset };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  total: number,
  limit: number,
  offset: number
): {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
} {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasMore = offset + limit < total;

  return {
    total,
    limit,
    offset,
    hasMore,
    currentPage,
    totalPages,
  };
}
