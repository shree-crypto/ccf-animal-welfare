/**
 * Environment detection utilities
 */

/**
 * Check if the application is running in development mode
 *
 * This checks:
 * 1. NODE_ENV === 'development'
 * 2. Optional override via NEXT_PUBLIC_SHOW_DEV_CREDENTIALS environment variable
 *
 * @returns true if in development mode or explicitly enabled
 */
export function isDevelopmentMode(): boolean {
  // Check if explicitly disabled via environment variable
  if (process.env.NEXT_PUBLIC_SHOW_DEV_CREDENTIALS === 'false') {
    return false;
  }

  // Check if explicitly enabled via environment variable (for staging/testing)
  if (process.env.NEXT_PUBLIC_SHOW_DEV_CREDENTIALS === 'true') {
    return true;
  }

  // Default: only show in development
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if the application is running in production mode
 *
 * @returns true if in production mode
 */
export function isProductionMode(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get the current environment name
 *
 * @returns 'development', 'production', or 'test'
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  return (
    (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
    'development'
  );
}
