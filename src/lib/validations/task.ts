import { z } from 'zod';

export const taskSchema = z.object({
  type: z.enum(['feeding', 'medical', 'maintenance'], {
    message: 'Type must be feeding, medical, or maintenance',
  }),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  assignedTo: z.string().min(1, 'Assigned user is required'),
  animalId: z.string().optional(),
  territoryId: z.string().optional(),
  scheduledDate: z.string().datetime('Invalid date format'),
  completed: z.boolean(),
  completedAt: z.string().datetime('Invalid date format').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    message: 'Priority must be low, medium, high, or urgent',
  }),
});

export const createTaskSchema = taskSchema.omit({ completedAt: true }).extend({
  completed: z.boolean().default(false),
});

export const updateTaskSchema = taskSchema.partial();

export type TaskFormData = z.infer<typeof taskSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type CreateTaskInput = z.input<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
