# Quick Start: Notification System

This guide will help you get started with the notification and communication system.

## Overview

The notification system provides:

- Real-time notifications for tasks, medical alerts, and updates
- Notification center with unread badge
- User preferences for notification types
- Email notifications (via Appwrite Functions)
- Daily digest option

## Prerequisites

- User account (volunteer or admin)
- Logged in to the application
- Appwrite database configured with notifications collection

## Accessing Notifications

### Notification Center

1. Look for the bell icon in the top right of the header
2. The badge shows the number of unread notifications
3. Click the bell icon to open the notification panel

### Notification Panel Features

- **All/Unread Toggle**: Filter notifications
- **Mark as Read**: Click individual notifications
- **Mark All as Read**: Clear all unread notifications
- **Click to Navigate**: Click notification to go to related content
- **Time Display**: Shows relative time (e.g., "2 hours ago")

## Notification Types

### Task Notifications

**Task Assigned**

- Triggered when a task is assigned to you
- Shows task title and due date
- Click to view task details

**Task Reminder**

- Sent before task due date
- Helps you stay on schedule
- Configurable in preferences

**Task Completed**

- Notifies when someone completes a task
- Useful for coordinators
- Shows who completed it

### Medical Notifications

**Medical Alert**

- Urgent medical situations
- High priority (red badge)
- Immediate attention required

**Medical Follow-up**

- Scheduled follow-up reminders
- Shows animal name and date
- Click to view medical record

### System Notifications

**Volunteer Updates**

- Important announcements for volunteers
- Schedule changes
- Policy updates

**System Announcements**

- General system messages
- New features
- Maintenance notices

## Managing Notification Preferences

### Accessing Preferences

1. Click your profile icon in the header
2. Select "Notifications" from the dropdown
3. Or navigate to `/notifications`

### Preference Options

**Delivery Methods**

- **Email Notifications**: Receive emails for important notifications
- **Push Notifications**: Browser push notifications (coming soon)

**Notification Types**

- **Task Reminders**: Upcoming task notifications
- **Medical Alerts**: Urgent medical situations
- **Volunteer Updates**: Important volunteer announcements
- **System Announcements**: General system messages

**Digest Options**

- **Daily Digest**: Receive a summary email once per day

### Updating Preferences

1. Toggle switches to enable/disable notification types
2. Changes are saved automatically
3. Green checkmark confirms save
4. Preferences apply immediately

## Notification Priority Levels

### Low (Gray)

- General information
- Non-urgent updates
- Can be reviewed later

### Medium (Blue)

- Standard notifications
- Task assignments
- Regular updates

### High (Orange)

- Important notifications
- Upcoming deadlines
- Requires attention soon

### Urgent (Red)

- Critical alerts
- Medical emergencies
- Immediate action required

## Real-time Updates

### How It Works

- Notifications appear instantly when created
- No page refresh needed
- WebSocket connection for real-time updates
- Works across multiple tabs

### Connection Status

- Automatic reconnection if connection drops
- Notifications sync when reconnected
- No notifications lost during disconnection

## Email Notifications

### Setup Required

Email notifications require Appwrite Functions to be configured. See [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md) for details.

### Email Types

**Immediate Emails**

- Task assignments
- Medical alerts
- Urgent notifications

**Daily Digest**

- Summary of all notifications from the day
- Sent at 8:00 AM
- Includes unread notifications only

### Email Content

- Professional HTML formatting
- Action buttons to view details
- Plain text fallback
- CCF branding

## Using Notifications in Your Workflow

### For Volunteers

1. **Check notifications daily**
   - Review unread notifications each morning
   - Mark as read after taking action
   - Use notifications to prioritize tasks

2. **Enable task reminders**
   - Get notified before deadlines
   - Never miss an assignment
   - Stay organized

3. **Subscribe to volunteer updates**
   - Stay informed about changes
   - Know about new opportunities
   - Receive important announcements

### For Admins

1. **Monitor medical alerts**
   - Enable high-priority medical notifications
   - Respond quickly to emergencies
   - Track follow-up requirements

2. **Send system announcements**
   - Use notification triggers to inform volunteers
   - Broadcast important messages
   - Coordinate activities

3. **Review notification patterns**
   - Check which notifications are most useful
   - Adjust notification triggers as needed
   - Improve volunteer engagement

## Notification Actions

### Clickable Notifications

Most notifications include action URLs:

- **Task notifications**: Navigate to task details
- **Medical notifications**: Open medical record
- **Animal notifications**: View animal profile
- **Territory notifications**: Show territory map

### Marking as Read

- **Individual**: Click the notification
- **All**: Click "Mark all as read" button
- **Automatic**: Notifications auto-mark when you visit the related page

### Deleting Notifications

- Notifications auto-delete after 30 days
- Expired notifications are cleaned up automatically
- No manual deletion needed

## Troubleshooting

### Not Receiving Notifications

1. **Check preferences**
   - Ensure notification types are enabled
   - Verify email notifications are on
   - Check spam folder for emails

2. **Check connection**
   - Refresh the page
   - Check internet connection
   - Look for connection errors in console

3. **Verify permissions**
   - Ensure you have correct role
   - Check Appwrite permissions
   - Contact admin if issues persist

### Notifications Not Updating

1. **Refresh the page**
2. **Clear browser cache**
3. **Check browser console for errors**
4. **Try different browser**

### Email Notifications Not Working

1. **Verify Appwrite Functions are deployed**
2. **Check email service configuration**
3. **Review function logs in Appwrite Console**
4. **Ensure email preferences are enabled**

## Best Practices

### For All Users

- Check notifications regularly
- Mark notifications as read after action
- Enable relevant notification types only
- Use daily digest to reduce email volume
- Click notifications to navigate quickly

### For Admins

- Use appropriate priority levels
- Include clear, actionable messages
- Don't over-notify volunteers
- Test notifications before sending to all
- Monitor notification engagement

## API Usage (For Developers)

### Creating Notifications

```typescript
import { createNotification } from '@/lib/db/notifications';

await createNotification({
  type: 'task_assigned',
  priority: 'medium',
  title: 'New Task Assigned',
  message: 'You have been assigned to feed animals at Main Gate',
  recipientId: userId,
  relatedEntityId: taskId,
  relatedEntityType: 'task',
  actionUrl: `/tasks/${taskId}`,
});
```

### Using Notification Context

```typescript
import { useNotifications } from '@/contexts/NotificationContext';

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(notification => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          {notification.title}
        </div>
      ))}
    </div>
  );
}
```

## Next Steps

- [Task Management](./QUICK_START_TASKS.md)
- [Medical Records](./QUICK_START_MEDICAL.md)
- [Notification Setup Guide](./NOTIFICATION_SETUP.md)

## Additional Resources

- [Notification Component Documentation](../src/components/features/notifications/README.md)
- [Notification Data Models](../src/types/notification.ts)
- [Notification Triggers](../src/lib/notifications/triggers.ts)
- [Email Templates](../src/lib/notifications/email-templates.ts)
