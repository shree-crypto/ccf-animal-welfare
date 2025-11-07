'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Calendar, AlertCircle, Users, Megaphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from '@/lib/db/notifications';
import { NotificationPreferences } from '@/types/notification';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const NotificationPreferencesComponent: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const prefs = await getNotificationPreferences(user.$id);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof Omit<NotificationPreferences, 'id' | 'userId' | 'updatedAt'>) => {
    if (!user || !preferences) return;

    try {
      setSaving(true);
      const updated = await updateNotificationPreferences(user.$id, {
        [key]: !preferences[key],
      });
      setPreferences(updated);
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500">Unable to load notification preferences.</p>
      </div>
    );
  }

  const preferenceItems = [
    {
      key: 'emailNotifications' as const,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      key: 'pushNotifications' as const,
      icon: Smartphone,
      title: 'Push Notifications',
      description: 'Receive push notifications in your browser',
    },
    {
      key: 'taskReminders' as const,
      icon: Calendar,
      title: 'Task Reminders',
      description: 'Get reminders for upcoming tasks',
    },
    {
      key: 'medicalAlerts' as const,
      icon: AlertCircle,
      title: 'Medical Alerts',
      description: 'Receive urgent medical notifications',
    },
    {
      key: 'volunteerUpdates' as const,
      icon: Users,
      title: 'Volunteer Updates',
      description: 'Stay informed about volunteer activities',
    },
    {
      key: 'systemAnnouncements' as const,
      icon: Megaphone,
      title: 'System Announcements',
      description: 'Receive important system updates',
    },
    {
      key: 'dailyDigest' as const,
      icon: Bell,
      title: 'Daily Digest',
      description: 'Get a daily summary of activities',
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600" />
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage how you receive notifications and updates
        </p>
      </div>

      <div className="space-y-4">
        {preferenceItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <Label htmlFor={item.key} className="text-sm font-medium text-gray-900 cursor-pointer">
                  {item.title}
                </Label>
                <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
              </div>
              <Checkbox
                id={item.key}
                checked={preferences[item.key]}
                onCheckedChange={() => handleToggle(item.key)}
                disabled={saving}
                className="mt-1"
              />
            </div>
          );
        })}
      </div>

      {saving && (
        <div className="mt-4 text-sm text-blue-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Saving preferences...
        </div>
      )}
    </div>
  );
};

export default NotificationPreferencesComponent;
