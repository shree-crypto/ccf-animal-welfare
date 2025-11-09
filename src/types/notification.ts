import { Models } from 'appwrite';

export type NotificationType =
  | 'task_reminder'
  | 'task_assigned'
  | 'task_completed'
  | 'medical_alert'
  | 'medical_followup'
  | 'system_announcement'
  | 'volunteer_update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  recipientId: string; // User ID
  relatedEntityId?: string; // Task ID, Animal ID, Medical Record ID, etc.
  relatedEntityType?: 'task' | 'animal' | 'medical_record' | 'territory';
  read: boolean;
  readAt?: string;
  actionUrl?: string; // URL to navigate when notification is clicked
  createdAt: string;
  expiresAt?: string; // Optional expiration date for notifications
}

// Appwrite document type
export interface NotificationDocument
  extends Models.Document,
    Omit<Notification, 'id' | 'createdAt'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

// Notification subscription preferences
export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  medicalAlerts: boolean;
  volunteerUpdates: boolean;
  systemAnnouncements: boolean;
  dailyDigest: boolean;
  updatedAt: string;
}

export interface NotificationPreferencesDocument
  extends Models.Document,
    Omit<NotificationPreferences, 'id' | 'updatedAt'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
