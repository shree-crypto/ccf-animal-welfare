import { z } from 'zod';

export const medicalRecordSchema = z.object({
  animalId: z.string().min(1, 'Animal ID is required'),
  date: z.string().datetime('Invalid date format'),
  type: z.enum(['checkup', 'vaccination', 'treatment', 'emergency'], {
    message: 'Type must be checkup, vaccination, treatment, or emergency',
  }),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  veterinarian: z
    .string()
    .max(200, 'Veterinarian name must be less than 200 characters')
    .optional(),
  medications: z
    .array(
      z.string().max(200, 'Medication name must be less than 200 characters')
    )
    .optional(),
  documents: z.array(z.string().url('Documents must be valid URLs')),
  followUpRequired: z.boolean(),
  followUpDate: z.string().datetime('Invalid date format').optional(),
});

export const createMedicalRecordSchema = medicalRecordSchema;

export const updateMedicalRecordSchema = medicalRecordSchema.partial().extend({
  animalId: z.string().min(1, 'Animal ID is required'),
});

export type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;
export type CreateMedicalRecordFormData = z.infer<
  typeof createMedicalRecordSchema
>;
export type UpdateMedicalRecordFormData = z.infer<
  typeof updateMedicalRecordSchema
>;
