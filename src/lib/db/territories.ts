import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import { Territory, TerritoryDocument } from '@/types/territory';
import { createTerritorySchema, updateTerritorySchema } from '@/lib/validations/territory';
import { normalizePagination, calculatePaginationMeta, QUERY_LIMITS } from './query-config';

// Helper to convert Appwrite document to Territory
const documentToTerritory = (doc: TerritoryDocument): Territory => ({
  id: doc.$id,
  name: doc.name,
  boundaries: doc.boundaries,
  packSize: doc.packSize,
  animals: doc.animals,
  assignedVolunteers: doc.assignedVolunteers,
  lastUpdated: doc.$updatedAt,
});

// Create a new territory
export const createTerritory = async (data: Omit<Territory, 'id' | 'lastUpdated'>): Promise<Territory> => {
  // Validate data
  const validatedData = createTerritorySchema.parse(data);

  const document = await databases.createDocument<TerritoryDocument>(
    DATABASE_ID,
    COLLECTIONS.TERRITORIES,
    ID.unique(),
    validatedData
  );

  return documentToTerritory(document);
};

// Get a territory by ID
export const getTerritoryById = async (id: string): Promise<Territory | null> => {
  try {
    const document = await databases.getDocument<TerritoryDocument>(
      DATABASE_ID,
      COLLECTIONS.TERRITORIES,
      id
    );
    return documentToTerritory(document);
  } catch (error) {
    console.error('Error fetching territory:', error);
    return null;
  }
};

// Get all territories
export const getTerritories = async (filters?: {
  limit?: number;
  offset?: number;
}): Promise<{
  territories: Territory[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const { limit, offset } = normalizePagination({
    limit: filters?.limit || QUERY_LIMITS.TERRITORY_LIST,
    offset: filters?.offset,
  });

  const queries: string[] = [Query.limit(limit), Query.offset(offset)];

  const response = await databases.listDocuments<TerritoryDocument>(
    DATABASE_ID,
    COLLECTIONS.TERRITORIES,
    queries
  );

  const pagination = calculatePaginationMeta(response.total, limit, offset);

  return {
    territories: response.documents.map(documentToTerritory),
    total: response.total,
    pagination,
  };
};

// Update a territory
export const updateTerritory = async (
  id: string,
  data: Partial<Omit<Territory, 'id' | 'lastUpdated'>>
): Promise<Territory> => {
  // Validate data
  const validatedData = updateTerritorySchema.parse(data);

  const document = await databases.updateDocument<TerritoryDocument>(
    DATABASE_ID,
    COLLECTIONS.TERRITORIES,
    id,
    validatedData
  );

  return documentToTerritory(document);
};

// Delete a territory
export const deleteTerritory = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TERRITORIES, id);
};

// Get territories assigned to a volunteer
// Uses index: assignedVolunteers (assignedVolunteers ASC)
export const getTerritoriesByVolunteer = async (
  volunteerId: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  territories: Territory[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const { limit, offset } = normalizePagination({
    limit: options?.limit || QUERY_LIMITS.TERRITORY_LIST,
    offset: options?.offset,
  });

  const response = await databases.listDocuments<TerritoryDocument>(
    DATABASE_ID,
    COLLECTIONS.TERRITORIES,
    [
      Query.contains('assignedVolunteers', volunteerId),
      Query.limit(limit),
      Query.offset(offset),
    ]
  );

  const pagination = calculatePaginationMeta(response.total, limit, offset);

  return {
    territories: response.documents.map(documentToTerritory),
    total: response.total,
    pagination,
  };
};
