import { describe, it, expect } from 'vitest';
import {
  medicalRecordSchema,
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from '../medical';

describe('Medical Record Validation Schemas', () => {
  describe('medicalRecordSchema', () => {
    it('should validate a complete medical record', () => {
      const validRecord = {
        animalId: 'animal123',
        date: '2025-11-08T10:00:00.000Z',
        type: 'checkup' as const,
        description: 'Regular health checkup',
        veterinarian: 'Dr. Smith',
        medications: ['Antibiotic', 'Pain reliever'],
        documents: ['https://example.com/report.pdf'],
        followUpRequired: true,
        followUpDate: '2025-11-15T10:00:00.000Z',
      };

      const result = medicalRecordSchema.safeParse(validRecord);
      expect(result.success).toBe(true);
    });

    it('should reject invalid medical type', () => {
      const invalidRecord = {
        animalId: 'animal123',
        date: '2025-11-08T10:00:00.000Z',
        type: 'invalid',
        description: 'Test description',
        documents: [],
        followUpRequired: false,
      };

      const result = medicalRecordSchema.safeParse(invalidRecord);
      expect(result.success).toBe(false);
    });

    it('should reject empty description', () => {
      const invalidRecord = {
        animalId: 'animal123',
        date: '2025-11-08T10:00:00.000Z',
        type: 'vaccination',
        description: '',
        documents: [],
        followUpRequired: false,
      };

      const result = medicalRecordSchema.safeParse(invalidRecord);
      expect(result.success).toBe(false);
    });

    it('should validate record with optional fields omitted', () => {
      const minimalRecord = {
        animalId: 'animal123',
        date: '2025-11-08T10:00:00.000Z',
        type: 'emergency' as const,
        description: 'Emergency treatment for injury',
        documents: [],
        followUpRequired: false,
      };

      const result = medicalRecordSchema.safeParse(minimalRecord);
      expect(result.success).toBe(true);
    });

    it('should reject invalid document URLs', () => {
      const invalidRecord = {
        animalId: 'animal123',
        date: '2025-11-08T10:00:00.000Z',
        type: 'treatment',
        description: 'Treatment for infection',
        documents: ['not-a-url'],
        followUpRequired: false,
      };

      const result = medicalRecordSchema.safeParse(invalidRecord);
      expect(result.success).toBe(false);
    });
  });

  describe('updateMedicalRecordSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        animalId: 'animal123',
        followUpRequired: false,
      };

      const result = updateMedicalRecordSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should require animalId even in partial updates', () => {
      const invalidUpdate = {
        description: 'Updated description',
      };

      const result = updateMedicalRecordSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
