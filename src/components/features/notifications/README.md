# Notification System

This directory contains the notification and communication system components for the CCF Animal Welfare Website.

## Components

### NotificationCenter
The main notification center component that displays all notifications in a dropdown panel.

**Features:**
- Real-time notification updates using Appwrite Realtime
- Unread notification badge
- Filter by all/unread notifications
- Mark individual notifications as read
- Mark all notifications as read
- Click notifications to navigate to related content
- Priority-based color coding
- Time-relative display (e.g., "2 hours ago")

**Usage:**
```tsx
import NotificationCenter from '@/components/features/notifications/NotificationCenter';

<NotificationCenter />
```

### NotificationPreferences
Component for managing user notification preferences.

**Features:**
- Toggle email notifications
- Toggle push notifications
- Configure notification types (tasks, medical alerts, etc.)
- Enable/disable daily digest
- Real-time preference updates

**Usage:**
```tsx
import NotificationPreferences from '@/components/features/notifications/NotificationPreferences';

<NotificationPreferences />
```

## Context

### NotificationContext
Provides notification state and functions throughout the app.

**Features:**
- Real-time notification synchronization
- Unread count tracking
- Mark as read functionality
- Automatic cleanup of expired notifications

**Usage:**
```tsx
import { useNotifications } from '@/contexts/NotificationContext';

const { notifications, unreadCount, markNotificationAsRead } = useNotifications();
```

## Database Functions

### Notification CRUD Operations
Located in `src/lib/db/notifications.ts`:

- `createNotification()` - Create a new notification
- `getUserNotifications()` - Get notifications for a user with filters
- `getUnreadCount()` - Get unread notification count
- `markAsRead()` - Mark a notification as read
- `markAllAsRead()` - Mark all notifications as read for a user
- `deleteNotification()` - Delete a notification
- `deleteExpiredNotifications()` - Clean up expired notifications

### Notification Preferences
- `getNotificationPreferences()` - Get user preferences
- `updateNotificationPreferences()` - Update user preferences
- `createNotificationPreferences()` - Create default preferences

### Helper Functions
- `createTaskNotification()` - Create task-related notifications
- `createMedicalNotification()` - Create medical-related notifications

## Notification Triggers

Located in `src/lib/notifications/triggers.ts`:

These functions should be called when events occur:

- `triggerTaskAssignedNotification()` - When a task is assigned
- `triggerTaskCompletedNotification()` - When a task is completed
- `triggerTaskReminderNotification()` - For upcoming task reminders
- `triggerMedicalAlertNotification()` - For urgent medical situations
- `triggerMedicalFollowupNotification()` - For medical follow-ups
- `triggerVolunteerUpdateNotification()` - For volunteer updates
- `triggerSystemAnnouncementNotification()` - For system announcements

**Example Usage:**
```tsx
import { triggerTaskAssignedNotification } from '@/lib/notifications/triggers';

// After creating a task
await triggerTaskAssignedNotification(task, volunteerId);
```

## Email Templates

Located in `src/lib/notifications/email-templates.ts`:

Email templates for Appwrite Functions:

- `generateTaskReminderEmail()` - Task reminder email
- `generateTaskAssignedEmail()` - Task assignment email
- `generateMedicalAlertEmail()` - Medical alert email
- `generateDailyDigestEmail()` - Daily digest email

These templates will be used by Appwrite Functions to send emails.

## Notification Types

- `task_reminder` - Reminder for upcoming tasks
- `task_assigned` - New task assignment
- `task_completed` - Task completion notification
- `medical_alert` - Urgent medical situation
- `medical_followup` - Medical follow-up required
- `system_announcement` - System-wide announcements
- `volunteer_update` - Volunteer-specific updates

## Priority Levels

- `urgent` - Red, requires immediate attention
- `high` - Orange, important but not critical
- `medium` - Blue, standard priority
- `low` - Gray, informational

## Real-time Updates

The notification system uses Appwrite Realtime to provide instant updates:

1. New notifications appear immediately
2. Read status updates in real-time
3. Unread count updates automatically
4. No page refresh required

## Appwrite Setup

### Collections Required

1. **notifications**
   - Attributes: type, priority, title, message, recipientId, relatedEntityId, relatedEntityType, read, readAt, actionUrl, expiresAt
   - Indexes: recipientId, read, type, priority, createdAt
   - Permissions: Users can read their own notifications

2. **notification-preferences**
   - Attributes: userId, emailNotifications, pushNotifications, taskReminders, medicalAlerts, volunteerUpdates, systemAnnouncements, dailyDigest
   - Indexes: userId
   - Permissions: Users can read/write their own preferences

### Appwrite Functions (Future Implementation)

1. **Task Reminder Function**
   - Scheduled to run daily
   - Checks for tasks scheduled in the next 24 hours
   - Creates reminder notifications
   - Sends email notifications if enabled

2. **Daily Digest Function**
   - Scheduled to run daily (morning)
   - Compiles upcoming tasks and recent alerts
   - Sends digest email to users with preference enabled

3. **Email Notification Function**
   - Triggered on notification creation
   - Checks user preferences
   - Sends email using email templates
   - Integrates with email service (SendGrid, AWS SES, etc.)

## Integration Guide

### 1. Add NotificationProvider to App Layout

```tsx
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}
```

### 2. Add NotificationCenter to Header

```tsx
import NotificationCenter from '@/components/features/notifications/NotificationCenter';

export default function Header() {
  return (
    <header>
      {/* Other header content */}
      <NotificationCenter />
    </header>
  );
}
```

### 3. Trigger Notifications in Your Code

```tsx
import { triggerTaskAssignedNotification } from '@/lib/notifications/triggers';

// When creating a task
const newTask = await createTask(taskData);
await triggerTaskAssignedNotification(newTask, newTask.assignedTo);
```

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATIONS=notifications
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATION_PREFERENCES=notification-preferences
```

## Future Enhancements

1. **Push Notifications**: Implement browser push notifications using Web Push API
2. **Email Integration**: Set up Appwrite Functions with email service
3. **SMS Notifications**: Add SMS support for urgent alerts
4. **Notification Grouping**: Group similar notifications
5. **Notification Sound**: Add sound alerts for urgent notifications
6. **Notification History**: Archive old notifications
7. **Advanced Filtering**: More filter options (date range, entity type, etc.)
