/**
 * RecentActivity Component
 * 
 * Displays a scrolling ticker of recent supporter activities
 * Requirements: 3.1, 3.2, 4.1
 */

'use client';

import { useEffect, useState } from 'react';
import { RecentActivity as RecentActivityType } from '@/types/impact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Home, Users, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  activities: RecentActivityType[];
  loading?: boolean;
  autoScroll?: boolean;
  className?: string;
}

export function RecentActivity({
  activities,
  loading = false,
  autoScroll = true,
  className,
}: RecentActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoScroll || activities.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [autoScroll, activities.length]);

  const getActivityIcon = (type: RecentActivityType['type']) => {
    switch (type) {
      case 'donation':
        return <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />;
      case 'adoption':
        return <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'volunteer':
        return <Users className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'rescue':
        return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    }
  };

  const getActivityColor = (type: RecentActivityType['type']) => {
    switch (type) {
      case 'donation':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'adoption':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'volunteer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rescue':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-8">
            No recent activities yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Live updates from our community
        </p>
      </CardHeader>
      <CardContent>
        {/* Featured activity (auto-scrolling) */}
        <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 transition-all duration-500">
          <div className="flex items-start gap-3">
            <div className="mt-1">{getActivityIcon(activities[currentIndex].type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {activities[currentIndex].displayName}
                </span>
                <Badge variant="secondary" className={getActivityColor(activities[currentIndex].type)}>
                  {activities[currentIndex].type}
                </Badge>
              </div>
              {activities[currentIndex].message && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {activities[currentIndex].message}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatTimestamp(activities[currentIndex].timestamp)}
              </p>
            </div>
          </div>
        </div>

        {/* Activity list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activities.slice(0, 5).map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-3 rounded-lg p-3 transition-colors',
                index === currentIndex
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900'
              )}
            >
              <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.displayName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                {activity.message && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {activity.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        {autoScroll && activities.length > 1 && (
          <div className="flex justify-center gap-1 mt-4">
            {activities.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'w-6 bg-blue-600 dark:bg-blue-400'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                )}
                aria-label={`Go to activity ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
