/**
 * Impact Dashboard Page
 * 
 * Dedicated page for viewing detailed impact metrics and trends
 * Requirements: 3.1, 3.5
 */

import { Metadata } from 'next';
import { ImpactDashboardWithTrends } from '@/components/features/impact';

export const metadata: Metadata = {
  title: 'Our Impact | CampusPaws',
  description: 'See the real-time impact we\'re making for campus animals at IIT Roorkee',
};

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <ImpactDashboardWithTrends />
      </div>
    </div>
  );
}
