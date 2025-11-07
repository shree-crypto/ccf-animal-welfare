import { describe, it, expect } from 'vitest';
import { taskSchema, createTaskSchema, updateTaskSchema } from '../task';

describe('Task Validation Schemas', () => {
  describe('taskSchema', () => {
    it('should validate a complete task', () => {
      const validTask = {
        type: 'feeding' as const,
        title: 'Feed dogs in Main Campus',
        description: 'Regular feeding schedule for the pack',
        assignedTo: 'user123',
        animalId: 'animal123',
        territoryId: 'territory123',
        scheduledDate: '2025-11-08T10:00:00.000Z',
        completed: false,
        priority: 'medium' as const,
      };

      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject invalid task type', () => {
      const invalidTask = {
        type: 'invalid',
        title: 'Test Task',
        description: 'Test description',
        assignedTo: 'user123',
        scheduledDate: '2025-11-08T10:00:00.000Z',
        completed: false,
        priority: 'medium',
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject empty title', () => {
      const invalidTask = {
        type: 'medical',
        title: '',
        description: 'Test description',
        assignedTo: 'user123',
        scheduledDate: '2025-11-08T10:00:00.000Z',
        completed: false,
        priority: 'high',
      };

      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should validate task with optional fields omitted', () => {
      const minimalTask = {
        type: 'maintenance' as const,
        title: 'Clean water bowls',
        description: 'Weekly maintenance task',
        assignedTo: 'user123',
        scheduledDate: '2025-11-08T10:00:00.000Z',
        completed: false,
        priority: 'low' as const,
      };

      const result = taskSchema.safeParse(minimalTask);
      expect(result.success).toBe(true);
    });
  });

  describe('createTaskSchema', () => {
    it('should default completed to false', () => {
      const newTask = {
        type: 'feeding' as const,
        title: 'Feed cats',
        description: 'Evening feeding',
        assignedTo: 'user123',
        scheduledDate: '2025-11-08T18:00:00.000Z',
        priority: 'medium' as const,
      };

      const result = createTaskSchema.safeParse(newTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completed).toBe(false);
      }
    });
  });

  describe('updateTaskSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        completed: true,
        completedAt: '2025-11-08T12:00:00.000Z',
      };

      const result = updateTaskSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate priority values', () => {
      const invalidUpdate = {
        priority: 'invalid',
      };

      const result = updateTaskSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
