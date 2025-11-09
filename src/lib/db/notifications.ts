import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import {
  Notification,
  NotificationDocument,
  NotificationPreferences,
  NotificationPreferencesDocument,
  NotificationType,
  NotificationPriority,
} from '@/types/notification';
import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationPreferencesSchema,
  CreateNotificationInput,
} from '@/lib/validations/notification';
import {
  normalizePagination,
  calculatePaginationMeta,
  QUERY_LIMITS,
} from './query-config';

// Helper to convert Appwrite document to Notification
const documentToNotification = (doc: NotificationDocument): Notification => ({
  id: doc.$id,
  type: doc.type,
  priority: doc.priority,
  title: doc.title,
  message: doc.message,
  recipientId: doc.recipientId,
  relatedEntityId: doc.relatedEntityId,
  relatedEntityType: doc.relatedEntityType,
  read: doc.read,
  readAt: doc.readAt,
  actionUrl: doc.actionUrl,
  createdAt: doc.$createdAt,
  expiresAt: doc.expiresAt,
});

// Helper to convert Appwrite document to NotificationPreferences
const documentToPreferences = (
  doc: NotificationPreferencesDocument
): NotificationPreferences => ({
  id: doc.$id,
  userId: doc.userId,
  emailNotifications: doc.emailNotifications,
  pushNotifications: doc.pushNotifications,
  taskReminders: doc.taskReminders,
  medicalAlerts: doc.medicalAlerts,
  volunteerUpdates: doc.volunteerUpdates,
  systemAnnouncements: doc.systemAnnouncements,
  dailyDigest: doc.dailyDigest,
  updatedAt: doc.$updatedAt,
});

// Create a new notification
export const createNotification = async (
  data: CreateNotificationInput
): Promise<Notification> => {
  // Validate data
  const validatedData = createNotificationSchema.parse(data);

  const document = await databases.createDocument<NotificationDocument>(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    ID.unique(),
    validatedData
  );

  return documentToNotification(document);
};

// Get a notification by ID
export const getNotificationById = async (
  id: string
): Promise<Notification | null> => {
  try {
    const document = await databases.getDocument<NotificationDocument>(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      id
    );
    return documentToNotification(document);
  } catch (error) {
    console.error('Error fetching notification:', error);
    return null;
  }
};

// Get notifications for a user
// Uses indexes:
// - recipientId_read_createdAt (recipientId ASC, read ASC, $createdAt DESC)
// - recipientId_type_createdAt (recipientId ASC, type ASC, $createdAt DESC)
// - recipientId_priority_read (recipientId ASC, priority DESC, read ASC)
export const getUserNotifications = async (
  userId: string,
  filters?: {
    type?: NotificationType;
    priority?: NotificationPriority;
    read?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<{
  notifications: Notification[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const queries: string[] = [Query.equal('recipientId', userId)];

  // Add filters in order that matches compound indexes
  // Index: recipientId_read_createdAt
  if (filters?.read !== undefined) {
    queries.push(Query.equal('read', filters.read));
  }
  // Index: recipientId_type_createdAt
  else if (filters?.type) {
    queries.push(Query.equal('type', filters.type));
  }
  // Index: recipientId_priority_read
  else if (filters?.priority) {
    queries.push(Query.equal('priority', filters.priority));
  }

  // Order by creation date descending (most recent first)
  queries.push(Query.orderDesc('$createdAt'));

  // Apply normalized pagination
  const { limit, offset } = normalizePagination({
    limit: filters?.limit || QUERY_LIMITS.NOTIFICATION_BATCH,
    offset: filters?.offset,
  });
  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  const response = await databases.listDocuments<NotificationDocument>(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    queries
  );

  const pagination = calculatePaginationMeta(response.total, limit, offset);

  return {
    notifications: response.documents.map(documentToNotification),
    total: response.total,
    pagination,
  };
};

// Get unread notification count for a user
export const getUnreadCount = async (userId: string): Promise<number> => {
  const response = await databases.listDocuments<NotificationDocument>(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    [
      Query.equal('recipientId', userId),
      Query.equal('read', false),
      Query.limit(1),
    ]
  );

  return response.total;
};

// Mark notification as read
export const markAsRead = async (id: string): Promise<Notification> => {
  const validatedData = updateNotificationSchema.parse({
    read: true,
    readAt: new Date().toISOString(),
  });

  const document = await databases.updateDocument<NotificationDocument>(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    id,
    validatedData
  );

  return documentToNotification(document);
};

// Mark all notifications as read for a user
export const markAllAsRead = async (userId: string): Promise<void> => {
  // Fetch in batches to avoid overwhelming the system
  const result = await getUserNotifications(userId, {
    read: false,
    limit: QUERY_LIMITS.NOTIFICATION_BATCH,
  });

  await Promise.all(
    result.notifications.map(notification => markAsRead(notification.id))
  );
};

// Delete a notification
export const deleteNotification = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, id);
};

// Delete expired notifications
// Uses index: expiresAt (expiresAt ASC)
export const deleteExpiredNotifications = async (): Promise<void> => {
  const now = new Date().toISOString();

  // Process in batches to avoid overwhelming the system
  const response = await databases.listDocuments<NotificationDocument>(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    [
      Query.lessThan('expiresAt', now),
      Query.limit(QUERY_LIMITS.NOTIFICATION_BATCH),
    ]
  );

  await Promise.all(response.documents.map(doc => deleteNotification(doc.$id)));
};

// Get or create notification preferences for a user
export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences> => {
  try {
    const response =
      await databases.listDocuments<NotificationPreferencesDocument>(
        DATABASE_ID,
        COLLECTIONS.NOTIFICATION_PREFERENCES,
        [Query.equal('userId', userId), Query.limit(1)]
      );

    if (response.documents.length > 0) {
      return documentToPreferences(response.documents[0]);
    }

    // Create default preferences if none exist
    return createNotificationPreferences(userId);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    // Return default preferences
    return createNotificationPreferences(userId);
  }
};

// Create notification preferences
export const createNotificationPreferences = async (
  userId: string,
  preferences?: Partial<
    Omit<NotificationPreferences, 'id' | 'userId' | 'updatedAt'>
  >
): Promise<NotificationPreferences> => {
  const validatedData = notificationPreferencesSchema.parse({
    userId,
    ...preferences,
  });

  const document =
    await databases.createDocument<NotificationPreferencesDocument>(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATION_PREFERENCES,
      ID.unique(),
      validatedData
    );

  return documentToPreferences(document);
};

// Update notification preferences
export const updateNotificationPreferences = async (
  userId: string,
  preferences: Partial<
    Omit<NotificationPreferences, 'id' | 'userId' | 'updatedAt'>
  >
): Promise<NotificationPreferences> => {
  const existing = await getNotificationPreferences(userId);

  const document =
    await databases.updateDocument<NotificationPreferencesDocument>(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATION_PREFERENCES,
      existing.id,
      preferences
    );

  return documentToPreferences(document);
};

// Helper function to create task-related notifications
export const createTaskNotification = async (
  type: 'task_reminder' | 'task_assigned' | 'task_completed',
  taskId: string,
  recipientId: string,
  taskTitle: string,
  priority: NotificationPriority = 'medium'
): Promise<Notification> => {
  const titles = {
    task_reminder: 'Task Reminder',
    task_assigned: 'New Task Assigned',
    task_completed: 'Task Completed',
  };

  const messages = {
    task_reminder: `Reminder: "${taskTitle}" is scheduled soon`,
    task_assigned: `You have been assigned to: "${taskTitle}"`,
    task_completed: `Task "${taskTitle}" has been completed`,
  };

  return createNotification({
    type,
    priority,
    title: titles[type],
    message: messages[type],
    recipientId,
    relatedEntityId: taskId,
    relatedEntityType: 'task',
    actionUrl: `/tasks?taskId=${taskId}`,
    read: false,
  });
};

// Helper function to create medical-related notifications
export const createMedicalNotification = async (
  type: 'medical_alert' | 'medical_followup',
  animalId: string,
  recipientId: string,
  animalName: string,
  message: string,
  priority: NotificationPriority = 'high'
): Promise<Notification> => {
  const titles = {
    medical_alert: 'Medical Alert',
    medical_followup: 'Medical Follow-up Required',
  };

  return createNotification({
    type,
    priority,
    title: titles[type],
    message: `${animalName}: ${message}`,
    recipientId,
    relatedEntityId: animalId,
    relatedEntityType: 'animal',
    actionUrl: `/animals/${animalId}`,
    read: false,
  });
};
