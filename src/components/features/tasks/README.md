# Task Management Components

This directory contains components for the volunteer task management system.

## Components

### TaskCard

Displays individual task information with status tracking and action buttons.

**Features:**

- Visual task type indicators (feeding, medical, maintenance)
- Priority badges with color coding
- Completion status tracking
- Overdue task highlighting
- Quick actions (complete, edit, delete)

**Props:**

- `task`: Task object
- `onComplete`: Callback for marking task complete
- `onEdit`: Callback for editing task
- `onDelete`: Callback for deleting task

### TaskCalendar

Interactive calendar view for task scheduling and visualization.

**Features:**

- Calendar with task date highlighting
- Selected date task list
- Task filtering by date
- Visual indicators for dates with tasks

**Props:**

- `tasks`: Array of tasks
- `onDateSelect`: Callback when date is selected

### QuickActions

Dialog-based form for rapid task creation.

**Features:**

- Quick task creation form
- Form validation with Zod
- All task fields supported
- Auto-assignment to current user

**Props:**

- `onCreateTask`: Callback for creating new task
- `currentUserId`: Current user's ID for auto-assignment

## Usage

```tsx
import { TaskCard } from '@/components/features/tasks/TaskCard';
import { TaskCalendar } from '@/components/features/tasks/TaskCalendar';
import { QuickActions } from '@/components/features/tasks/QuickActions';

// In your component
<QuickActions onCreateTask={handleCreate} currentUserId={userId} />
<TaskCalendar tasks={tasks} onDateSelect={handleDateSelect} />
<TaskCard task={task} onComplete={handleComplete} onDelete={handleDelete} />
```

## Real-time Synchronization

The tasks page implements real-time synchronization using Appwrite Realtime:

```typescript
const unsubscribe = client.subscribe(
  `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
  response => {
    loadTasks(); // Reload tasks on any change
  }
);
```

This ensures all volunteers see task updates immediately without manual refresh.

## Task Filtering

The task list supports three filter modes:

- **All**: Shows all tasks
- **Pending**: Shows incomplete tasks only
- **Completed**: Shows completed tasks only

## Priority System

Tasks use a four-level priority system:

- **Low**: Gray badge
- **Medium**: Blue badge
- **High**: Orange badge
- **Urgent**: Red badge

## Overdue Detection

Tasks are automatically marked as overdue if:

- Task is not completed
- Scheduled date is in the past
- Visual indicator: Red border and "Overdue" badge
