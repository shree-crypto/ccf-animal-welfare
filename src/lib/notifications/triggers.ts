// Notification trigger functions
// These functions should be called when certain events occur to create notifications

import {
  createTaskNotification,
  createMedicalNotification,
  createNotification,
} from '@/lib/db/notifications';
import { Task } from '@/types/task';
import { MedicalRecord } from '@/types/medical';
import { AnimalProfile } from '@/types/animal';

/**
 * Trigger notification when a task is assigned to a volunteer
 */
export const triggerTaskAssignedNotification = async (
  task: Task,
  volunteerId: string
): Promise<void> => {
  try {
    await createTaskNotification(
      'task_assigned',
      task.id,
      volunteerId,
      task.title,
      task.priority
    );
  } catch (error) {
    console.error('Error creating task assigned notification:', error);
  }
};

/**
 * Trigger notification when a task is completed
 */
export const triggerTaskCompletedNotification = async (
  task: Task,
  recipientId: string
): Promise<void> => {
  try {
    await createTaskNotification(
      'task_completed',
      task.id,
      recipientId,
      task.title,
      'low'
    );
  } catch (error) {
    console.error('Error creating task completed notification:', error);
  }
};

/**
 * Trigger notification reminder for upcoming tasks
 * This should be called by a scheduled Appwrite Function
 */
export const triggerTaskReminderNotification = async (
  task: Task,
  volunteerId: string
): Promise<void> => {
  try {
    await createTaskNotification(
      'task_reminder',
      task.id,
      volunteerId,
      task.title,
      task.priority
    );
  } catch (error) {
    console.error('Error creating task reminder notification:', error);
  }
};

/**
 * Trigger notification when a medical alert is created
 */
export const triggerMedicalAlertNotification = async (
  animal: AnimalProfile,
  medicalRecord: MedicalRecord,
  volunteerIds: string[]
): Promise<void> => {
  try {
    const message = `${medicalRecord.type === 'emergency' ? 'EMERGENCY: ' : ''}${medicalRecord.description}`;

    // Create notifications for all relevant volunteers
    await Promise.all(
      volunteerIds.map(volunteerId =>
        createMedicalNotification(
          'medical_alert',
          animal.id,
          volunteerId,
          animal.name,
          message,
          medicalRecord.type === 'emergency' ? 'urgent' : 'high'
        )
      )
    );
  } catch (error) {
    console.error('Error creating medical alert notification:', error);
  }
};

/**
 * Trigger notification when a medical follow-up is required
 */
export const triggerMedicalFollowupNotification = async (
  animal: AnimalProfile,
  medicalRecord: MedicalRecord,
  volunteerId: string
): Promise<void> => {
  try {
    const message = `Follow-up required${medicalRecord.followUpDate ? ` by ${new Date(medicalRecord.followUpDate).toLocaleDateString()}` : ''}`;

    await createMedicalNotification(
      'medical_followup',
      animal.id,
      volunteerId,
      animal.name,
      message,
      'high'
    );
  } catch (error) {
    console.error('Error creating medical follow-up notification:', error);
  }
};

/**
 * Trigger notification for volunteer updates
 */
export const triggerVolunteerUpdateNotification = async (
  title: string,
  message: string,
  volunteerIds: string[],
  actionUrl?: string
): Promise<void> => {
  try {
    await Promise.all(
      volunteerIds.map(volunteerId =>
        createNotification({
          type: 'volunteer_update',
          priority: 'medium',
          title,
          message,
          recipientId: volunteerId,
          actionUrl,
          read: false,
        })
      )
    );
  } catch (error) {
    console.error('Error creating volunteer update notification:', error);
  }
};

/**
 * Trigger notification for system announcements
 */
export const triggerSystemAnnouncementNotification = async (
  title: string,
  message: string,
  volunteerIds: string[],
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
  actionUrl?: string
): Promise<void> => {
  try {
    await Promise.all(
      volunteerIds.map(volunteerId =>
        createNotification({
          type: 'system_announcement',
          priority,
          title,
          message,
          recipientId: volunteerId,
          actionUrl,
          read: false,
        })
      )
    );
  } catch (error) {
    console.error('Error creating system announcement notification:', error);
  }
};
