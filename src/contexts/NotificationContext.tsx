'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { client } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import { Notification } from '@/types/notification';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/lib/db/notifications';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        getUserNotifications(user.$id, { limit: 50 }),
        getUnreadCount(user.$id),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to notification changes
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.NOTIFICATIONS}.documents`,
      (response) => {
        const payload = response.payload as any;

        // Only process notifications for the current user
        if (payload.recipientId !== user.$id) return;

        if (
          response.events.includes(
            `databases.${DATABASE_ID}.collections.${COLLECTIONS.NOTIFICATIONS}.documents.*.create`
          )
        ) {
          // New notification created
          const newNotification: Notification = {
            id: payload.$id,
            type: payload.type,
            priority: payload.priority,
            title: payload.title,
            message: payload.message,
            recipientId: payload.recipientId,
            relatedEntityId: payload.relatedEntityId,
            relatedEntityType: payload.relatedEntityType,
            read: payload.read,
            readAt: payload.readAt,
            actionUrl: payload.actionUrl,
            createdAt: payload.$createdAt,
            expiresAt: payload.expiresAt,
          };

          setNotifications((prev) => [newNotification, ...prev]);
          if (!newNotification.read) {
            setUnreadCount((prev) => prev + 1);
          }
        } else if (
          response.events.includes(
            `databases.${DATABASE_ID}.collections.${COLLECTIONS.NOTIFICATIONS}.documents.*.update`
          )
        ) {
          // Notification updated
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === payload.$id
                ? {
                    ...notif,
                    read: payload.read,
                    readAt: payload.readAt,
                  }
                : notif
            )
          );

          // Update unread count
          if (payload.read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        } else if (
          response.events.includes(
            `databases.${DATABASE_ID}.collections.${COLLECTIONS.NOTIFICATIONS}.documents.*.delete`
          )
        ) {
          // Notification deleted
          setNotifications((prev) => prev.filter((notif) => notif.id !== payload.$id));
          if (!payload.read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, fetchNotifications]);

  // Mark notification as read
  const markNotificationAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      // Real-time subscription will handle the state update
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    if (!user) return;

    try {
      await markAllAsRead(user.$id);
      // Real-time subscription will handle the state updates
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshNotifications: fetchNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
