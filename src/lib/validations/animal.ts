import { z } from 'zod';

export const animalLocationSchema = z.object({
  area: z.string().min(1, 'Area is required'),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const animalPhotosSchema = z.object({
  profile: z.string().url('Profile photo must be a valid URL'),
  gallery: z.array(z.string().url('Gallery photos must be valid URLs')),
});

export const animalProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  type: z.enum(['dog', 'cat'], { message: 'Type must be either dog or cat' }),
  age: z
    .number()
    .min(0, 'Age must be positive')
    .max(30, 'Age must be less than 30 years'),
  breed: z
    .string()
    .max(100, 'Breed must be less than 100 characters')
    .optional(),
  location: animalLocationSchema,
  currentFeeder: z.string().optional(),
  medicalHistory: z.array(z.string()),
  photos: animalPhotosSchema,
  packId: z.string().optional(),
  status: z.enum(['healthy', 'needs_attention', 'under_treatment'], {
    message: 'Status must be healthy, needs_attention, or under_treatment',
  }),
});

export const createAnimalSchema = animalProfileSchema;

export const updateAnimalSchema = animalProfileSchema.partial();

export type AnimalProfileFormData = z.infer<typeof animalProfileSchema>;
export type CreateAnimalFormData = z.infer<typeof createAnimalSchema>;
export type UpdateAnimalFormData = z.infer<typeof updateAnimalSchema>;
