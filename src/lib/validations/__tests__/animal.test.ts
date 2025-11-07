import { describe, it, expect } from 'vitest';
import {
  animalProfileSchema,
  createAnimalSchema,
  updateAnimalSchema,
} from '../animal';

describe('Animal Validation Schemas', () => {
  describe('animalProfileSchema', () => {
    it('should validate a complete animal profile', () => {
      const validAnimal = {
        name: 'Buddy',
        type: 'dog' as const,
        age: 5,
        breed: 'Golden Retriever',
        location: {
          area: 'Main Campus',
          coordinates: [29.8543, 77.8880] as [number, number],
        },
        currentFeeder: 'user123',
        medicalHistory: ['record1', 'record2'],
        photos: {
          profile: 'https://example.com/profile.jpg',
          gallery: ['https://example.com/photo1.jpg'],
        },
        packId: 'pack123',
        status: 'healthy' as const,
      };

      const result = animalProfileSchema.safeParse(validAnimal);
      expect(result.success).toBe(true);
    });

    it('should reject invalid animal type', () => {
      const invalidAnimal = {
        name: 'Buddy',
        type: 'bird',
        age: 5,
        location: {
          area: 'Main Campus',
          coordinates: [29.8543, 77.8880],
        },
        medicalHistory: [],
        photos: {
          profile: 'https://example.com/profile.jpg',
          gallery: [],
        },
        status: 'healthy',
      };

      const result = animalProfileSchema.safeParse(invalidAnimal);
      expect(result.success).toBe(false);
    });

    it('should reject negative age', () => {
      const invalidAnimal = {
        name: 'Buddy',
        type: 'dog',
        age: -1,
        location: {
          area: 'Main Campus',
          coordinates: [29.8543, 77.8880],
        },
        medicalHistory: [],
        photos: {
          profile: 'https://example.com/profile.jpg',
          gallery: [],
        },
        status: 'healthy',
      };

      const result = animalProfileSchema.safeParse(invalidAnimal);
      expect(result.success).toBe(false);
    });

    it('should reject invalid photo URLs', () => {
      const invalidAnimal = {
        name: 'Buddy',
        type: 'dog',
        age: 5,
        location: {
          area: 'Main Campus',
          coordinates: [29.8543, 77.8880],
        },
        medicalHistory: [],
        photos: {
          profile: 'not-a-url',
          gallery: [],
        },
        status: 'healthy',
      };

      const result = animalProfileSchema.safeParse(invalidAnimal);
      expect(result.success).toBe(false);
    });

    it('should validate animal with optional fields omitted', () => {
      const minimalAnimal = {
        name: 'Buddy',
        type: 'cat' as const,
        age: 3,
        location: {
          area: 'Library Area',
          coordinates: [29.8543, 77.8880] as [number, number],
        },
        medicalHistory: [],
        photos: {
          profile: 'https://example.com/profile.jpg',
          gallery: [],
        },
        status: 'needs_attention' as const,
      };

      const result = animalProfileSchema.safeParse(minimalAnimal);
      expect(result.success).toBe(true);
    });
  });

  describe('updateAnimalSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        name: 'Updated Name',
        status: 'under_treatment' as const,
      };

      const result = updateAnimalSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate updated fields', () => {
      const invalidUpdate = {
        age: -5,
      };

      const result = updateAnimalSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
