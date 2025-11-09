/**
 * Impact Dashboard Page
 *
 * Dedicated page for viewing detailed impact metrics and trends
 * Requirements: 3.1, 3.5
 */

'use client';

import { Metadata } from 'next';
import { ImpactDashboardWithTrends } from '@/components/features/impact';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function ImpactPage() {
  const { config } = useTheme();

  return (
    <div
      className={cn(
        'min-h-screen',
        config.effects.gradients
          ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900'
          : 'bg-background'
      )}
    >
      <div className="container mx-auto px-4 py-12">
        <ImpactDashboardWithTrends />
      </div>
    </div>
  );
}
