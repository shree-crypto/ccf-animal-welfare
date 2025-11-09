import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import { Task, TaskDocument, TaskType, TaskPriority } from '@/types/task';
import {
  createTaskSchema,
  updateTaskSchema,
  CreateTaskInput,
} from '@/lib/validations/task';
import {
  triggerTaskAssignedNotification,
  triggerTaskCompletedNotification,
} from '@/lib/notifications/triggers';
import {
  normalizePagination,
  calculatePaginationMeta,
  QUERY_LIMITS,
} from './query-config';

// Helper to convert Appwrite document to Task
const documentToTask = (doc: TaskDocument): Task => ({
  id: doc.$id,
  type: doc.type,
  title: doc.title,
  description: doc.description,
  assignedTo: doc.assignedTo,
  animalId: doc.animalId,
  territoryId: doc.territoryId,
  scheduledDate: doc.scheduledDate,
  completed: doc.completed,
  completedAt: doc.completedAt,
  priority: doc.priority,
});

// Create a new task
export const createTask = async (
  data: CreateTaskInput,
  options?: { sendNotification?: boolean }
): Promise<Task> => {
  // Validate data and apply defaults
  const validatedData = createTaskSchema.parse(data);

  const document = await databases.createDocument<TaskDocument>(
    DATABASE_ID,
    COLLECTIONS.TASKS,
    ID.unique(),
    validatedData
  );

  const task = documentToTask(document);

  // Send notification if enabled (default: true)
  if (options?.sendNotification !== false && task.assignedTo) {
    try {
      await triggerTaskAssignedNotification(task, task.assignedTo);
    } catch (error) {
      console.error('Failed to send task assignment notification:', error);
      // Don't fail task creation if notification fails
    }
  }

  return task;
};

// Get a task by ID
export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    const document = await databases.getDocument<TaskDocument>(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      id
    );
    return documentToTask(document);
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
};

// Get all tasks with optional filters
// Uses indexes:
// - assignedTo_completed_scheduledDate (assignedTo ASC, completed ASC, scheduledDate ASC)
// - type_priority_scheduledDate (type ASC, priority DESC, scheduledDate ASC)
// - animalId_completed (animalId ASC, completed ASC)
// - territoryId_scheduledDate (territoryId ASC, scheduledDate ASC)
export const getTasks = async (filters?: {
  type?: TaskType;
  assignedTo?: string;
  animalId?: string;
  territoryId?: string;
  completed?: boolean;
  priority?: TaskPriority;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  tasks: Task[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const queries: string[] = [];

  // Add filters in order that matches compound indexes
  // Index: assignedTo_completed_scheduledDate
  if (filters?.assignedTo) {
    queries.push(Query.equal('assignedTo', filters.assignedTo));
    if (filters?.completed !== undefined) {
      queries.push(Query.equal('completed', filters.completed));
    }
  }
  // Index: type_priority_scheduledDate
  else if (filters?.type) {
    queries.push(Query.equal('type', filters.type));
    if (filters?.priority) {
      queries.push(Query.equal('priority', filters.priority));
    }
  }
  // Index: animalId_completed
  else if (filters?.animalId) {
    queries.push(Query.equal('animalId', filters.animalId));
    if (filters?.completed !== undefined) {
      queries.push(Query.equal('completed', filters.completed));
    }
  }
  // Index: territoryId_scheduledDate
  else if (filters?.territoryId) {
    queries.push(Query.equal('territoryId', filters.territoryId));
  }
  // Index: completed_scheduledDate
  else if (filters?.completed !== undefined) {
    queries.push(Query.equal('completed', filters.completed));
  }

  // Date range filters
  if (filters?.startDate) {
    queries.push(Query.greaterThanEqual('scheduledDate', filters.startDate));
  }
  if (filters?.endDate) {
    queries.push(Query.lessThanEqual('scheduledDate', filters.endDate));
  }

  // Order by scheduled date ascending (earliest first)
  queries.push(Query.orderAsc('scheduledDate'));

  // Apply normalized pagination
  const { limit, offset } = normalizePagination({
    limit: filters?.limit || QUERY_LIMITS.TASK_LIST,
    offset: filters?.offset,
  });
  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  const response = await databases.listDocuments<TaskDocument>(
    DATABASE_ID,
    COLLECTIONS.TASKS,
    queries
  );

  const pagination = calculatePaginationMeta(response.total, limit, offset);

  return {
    tasks: response.documents.map(documentToTask),
    total: response.total,
    pagination,
  };
};

// Update a task
export const updateTask = async (
  id: string,
  data: Partial<Omit<Task, 'id'>>
): Promise<Task> => {
  // Validate data
  const validatedData = updateTaskSchema.parse(data);

  const document = await databases.updateDocument<TaskDocument>(
    DATABASE_ID,
    COLLECTIONS.TASKS,
    id,
    validatedData
  );

  return documentToTask(document);
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TASKS, id);
};

// Mark task as completed
export const completeTask = async (
  id: string,
  options?: { sendNotification?: boolean; notifyUserId?: string }
): Promise<Task> => {
  const completedAt = new Date().toISOString();
  const task = await updateTask(id, { completed: true, completedAt });

  // Send notification if enabled and recipient specified
  if (options?.sendNotification !== false && options?.notifyUserId) {
    try {
      await triggerTaskCompletedNotification(task, options.notifyUserId);
    } catch (error) {
      console.error('Failed to send task completion notification:', error);
      // Don't fail task completion if notification fails
    }
  }

  return task;
};

// Get upcoming tasks for a volunteer
// Uses index: assignedTo_completed_scheduledDate
export const getUpcomingTasks = async (
  volunteerId: string,
  days: number = 7,
  options?: { limit?: number; offset?: number }
): Promise<{
  tasks: Task[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return getTasks({
    assignedTo: volunteerId,
    completed: false,
    startDate: now.toISOString(),
    endDate: futureDate.toISOString(),
    limit: options?.limit || QUERY_LIMITS.TASK_LIST,
    offset: options?.offset,
  });
};

// Get overdue tasks for a volunteer
// Uses index: assignedTo_completed_scheduledDate
export const getOverdueTasks = async (
  volunteerId: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  tasks: Task[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const now = new Date().toISOString();

  return getTasks({
    assignedTo: volunteerId,
    completed: false,
    endDate: now,
    limit: options?.limit || QUERY_LIMITS.TASK_LIST,
    offset: options?.offset,
  });
};

// Get tasks by animal with pagination
export const getTasksByAnimal = async (
  animalId: string,
  options?: { completed?: boolean; limit?: number; offset?: number }
): Promise<{ tasks: Task[]; total: number }> => {
  return getTasks({
    animalId,
    completed: options?.completed,
    limit: options?.limit,
    offset: options?.offset,
  });
};

// Get tasks by territory with pagination
export const getTasksByTerritory = async (
  territoryId: string,
  options?: { completed?: boolean; limit?: number; offset?: number }
): Promise<{ tasks: Task[]; total: number }> => {
  return getTasks({
    territoryId,
    completed: options?.completed,
    limit: options?.limit,
    offset: options?.offset,
  });
};
