import { z } from 'zod';

export const territorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  boundaries: z.array(z.tuple([z.number(), z.number()])).min(3, 'Territory must have at least 3 boundary points'),
  packSize: z.number().min(0, 'Pack size must be positive'),
  animals: z.array(z.string()),
  assignedVolunteers: z.array(z.string()),
});

export const createTerritorySchema = territorySchema;

export const updateTerritorySchema = territorySchema.partial();

export type TerritoryFormData = z.infer<typeof territorySchema>;
export type CreateTerritoryFormData = z.infer<typeof createTerritorySchema>;
export type UpdateTerritoryFormData = z.infer<typeof updateTerritorySchema>;
