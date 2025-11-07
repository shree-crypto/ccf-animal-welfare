'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import NotificationPreferences from '@/components/features/notifications/NotificationPreferences';
import { Bell } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function NotificationsPage() {
  const { loading } = useRequireAuth('volunteer');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage how you receive notifications and stay updated with CCF activities
          </p>
        </div>

        {/* Notification Preferences Component */}
        <NotificationPreferences />

        {/* Information Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Notifications</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Real-time Updates:</strong> Notifications appear instantly in the notification
              center without requiring a page refresh.
            </p>
            <p>
              <strong>Email Notifications:</strong> When enabled, you'll receive emails for important
              updates based on your preferences.
            </p>
            <p>
              <strong>Daily Digest:</strong> Get a summary of your tasks and alerts delivered to your
              inbox each morning.
            </p>
            <p>
              <strong>Priority Levels:</strong> Urgent notifications (like medical emergencies) will
              always be highlighted regardless of your settings.
            </p>
          </div>
        </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
