import { z } from 'zod';

export const notificationTypeSchema = z.enum([
  'task_reminder',
  'task_assigned',
  'task_completed',
  'medical_alert',
  'medical_followup',
  'system_announcement',
  'volunteer_update',
]);

export const notificationPrioritySchema = z.enum([
  'low',
  'medium',
  'high',
  'urgent',
]);

export const createNotificationSchema = z.object({
  type: notificationTypeSchema,
  priority: notificationPrioritySchema,
  title: z.string().min(1, 'Title is required').max(200),
  message: z.string().min(1, 'Message is required').max(1000),
  recipientId: z.string().min(1, 'Recipient ID is required'),
  relatedEntityId: z.string().optional(),
  relatedEntityType: z
    .enum(['task', 'animal', 'medical_record', 'territory'])
    .optional(),
  read: z.boolean().default(false),
  readAt: z.string().optional(),
  actionUrl: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  read: z.boolean().optional(),
  readAt: z.string().optional(),
});

export const notificationPreferencesSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  taskReminders: z.boolean().default(true),
  medicalAlerts: z.boolean().default(true),
  volunteerUpdates: z.boolean().default(true),
  systemAnnouncements: z.boolean().default(true),
  dailyDigest: z.boolean().default(false),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type NotificationPreferencesInput = z.infer<
  typeof notificationPreferencesSchema
>;
