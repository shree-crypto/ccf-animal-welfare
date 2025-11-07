import { Models } from 'appwrite';

export type TaskType = 'feeding' | 'medical' | 'maintenance';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  assignedTo: string;
  animalId?: string;
  territoryId?: string;
  scheduledDate: string;
  completed: boolean;
  completedAt?: string;
  priority: TaskPriority;
}

// Appwrite document type
export interface TaskDocument extends Models.Document, Omit<Task, 'id'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
