'use client';

import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  AlertCircle,
  Calendar,
  Activity,
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification, NotificationPriority } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'task_reminder':
      case 'task_assigned':
      case 'task_completed':
        return <Calendar className="h-5 w-5" />;
      case 'medical_alert':
      case 'medical_followup':
        return <AlertCircle className="h-5 w-5" />;
      case 'volunteer_update':
      case 'system_announcement':
        return <Activity className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    filter === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    filter === 'unread'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        'p-4 hover:bg-gray-50 transition-colors cursor-pointer',
                        !notification.read && 'bg-blue-50/50'
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={cn(
                            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border',
                            getPriorityColor(notification.priority)
                          )}
                        >
                          {getNotificationIcon(notification)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={cn(
                                'text-sm font-medium text-gray-900',
                                !notification.read && 'font-semibold'
                              )}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Mark as Read Button */}
                      {!notification.read && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            markNotificationAsRead(notification.id);
                          }}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
