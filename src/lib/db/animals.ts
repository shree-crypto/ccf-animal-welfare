import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import { AnimalProfile, AnimalDocument } from '@/types/animal';
import {
  createAnimalSchema,
  updateAnimalSchema,
} from '@/lib/validations/animal';
import {
  normalizePagination,
  calculatePaginationMeta,
  QUERY_LIMITS,
} from './query-config';
import { mockAnimals } from '@/lib/mock-data/animals';

// Helper to convert Appwrite document to AnimalProfile
const documentToAnimal = (doc: AnimalDocument): AnimalProfile => ({
  id: doc.$id,
  name: doc.name,
  type: doc.type,
  age: doc.age,
  breed: doc.breed,
  location: doc.location,
  currentFeeder: doc.currentFeeder,
  medicalHistory: doc.medicalHistory,
  photos: doc.photos,
  packId: doc.packId,
  status: doc.status,
  createdAt: doc.$createdAt,
  updatedAt: doc.$updatedAt,
});

// Create a new animal
export const createAnimal = async (
  data: Omit<AnimalProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AnimalProfile> => {
  // Validate data
  const validatedData = createAnimalSchema.parse(data);

  const document = await databases.createDocument<AnimalDocument>(
    DATABASE_ID,
    COLLECTIONS.ANIMALS,
    ID.unique(),
    validatedData
  );

  return documentToAnimal(document);
};

// Get an animal by ID
export const getAnimalById = async (
  id: string
): Promise<AnimalProfile | null> => {
  try {
    const document = await databases.getDocument<AnimalDocument>(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      id
    );
    return documentToAnimal(document);
  } catch (error) {
    console.warn('Appwrite not available, using mock data:', error);
    // Fallback to mock data
    const mockAnimal = mockAnimals.find(animal => animal.id === id);
    return mockAnimal || null;
  }
};

// Get all animals with optional filters
export const getAnimals = async (filters?: {
  type?: 'dog' | 'cat';
  status?: 'healthy' | 'needs_attention' | 'under_treatment';
  packId?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  try {
    const queries: string[] = [];

    // Add filters in order that matches compound indexes
    // Index: type_status (type ASC, status ASC)
    if (filters?.type) {
      queries.push(Query.equal('type', filters.type));
    }
    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }

    // Index: packId (packId ASC)
    if (filters?.packId) {
      queries.push(Query.equal('packId', filters.packId));
    }

    // Add ordering for consistent results
    queries.push(Query.orderDesc('$createdAt'));

    // Apply normalized pagination
    const { limit, offset } = normalizePagination({
      limit: filters?.limit || QUERY_LIMITS.ANIMAL_GALLERY,
      offset: filters?.offset,
    });
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));

    const response = await databases.listDocuments<AnimalDocument>(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      queries
    );

    const pagination = calculatePaginationMeta(response.total, limit, offset);

    return {
      animals: response.documents.map(documentToAnimal),
      total: response.total,
      pagination,
    };
  } catch (error) {
    console.warn('Appwrite not available, using mock data:', error);

    // Use mock data as fallback
    let filtered = [...mockAnimals];

    // Apply filters
    if (filters?.type) {
      filtered = filtered.filter(animal => animal.type === filters.type);
    }
    if (filters?.status) {
      filtered = filtered.filter(animal => animal.status === filters.status);
    }
    if (filters?.packId) {
      filtered = filtered.filter(animal => animal.packId === filters.packId);
    }

    // Apply pagination
    const { limit, offset } = normalizePagination({
      limit: filters?.limit || QUERY_LIMITS.ANIMAL_GALLERY,
      offset: filters?.offset,
    });

    const total = filtered.length;
    const paginatedAnimals = filtered.slice(offset, offset + limit);
    const pagination = calculatePaginationMeta(total, limit, offset);

    return {
      animals: paginatedAnimals,
      total,
      pagination,
    };
  }
};

// Update an animal
export const updateAnimal = async (
  id: string,
  data: Partial<Omit<AnimalProfile, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<AnimalProfile> => {
  // Validate data
  const validatedData = updateAnimalSchema.parse(data);

  const document = await databases.updateDocument<AnimalDocument>(
    DATABASE_ID,
    COLLECTIONS.ANIMALS,
    id,
    validatedData
  );

  return documentToAnimal(document);
};

// Delete an animal
export const deleteAnimal = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, id);
};

// Search animals by name
// Uses fulltext index: name_fulltext
export const searchAnimalsByName = async (
  searchTerm: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  try {
    const { limit, offset } = normalizePagination({
      limit: options?.limit || QUERY_LIMITS.SEARCH_RESULTS,
      offset: options?.offset,
    });

    const queries = [
      Query.search('name', searchTerm),
      Query.limit(limit),
      Query.offset(offset),
    ];

    const response = await databases.listDocuments<AnimalDocument>(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      queries
    );

    const pagination = calculatePaginationMeta(response.total, limit, offset);

    return {
      animals: response.documents.map(documentToAnimal),
      total: response.total,
      pagination,
    };
  } catch (error) {
    console.warn('Appwrite not available, using mock data:', error);

    // Fallback to mock data with simple search
    const { limit, offset } = normalizePagination({
      limit: options?.limit || QUERY_LIMITS.SEARCH_RESULTS,
      offset: options?.offset,
    });

    const searchLower = searchTerm.toLowerCase();
    const filtered = mockAnimals.filter(
      animal =>
        animal.name.toLowerCase().includes(searchLower) ||
        animal.breed?.toLowerCase().includes(searchLower)
    );

    const total = filtered.length;
    const paginatedAnimals = filtered.slice(offset, offset + limit);
    const pagination = calculatePaginationMeta(total, limit, offset);

    return {
      animals: paginatedAnimals,
      total,
      pagination,
    };
  }
};

// Get animals needing attention (optimized for medical alerts)
// Uses index: status_createdAt (status ASC, $createdAt DESC)
export const getAnimalsNeedingAttention = async (options?: {
  limit?: number;
  offset?: number;
}): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const { limit, offset } = normalizePagination({
    limit: options?.limit || QUERY_LIMITS.DASHBOARD_ITEMS,
    offset: options?.offset,
  });

  const queries = [
    Query.equal('status', ['needs_attention', 'under_treatment']),
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
    Query.offset(offset),
  ];

  const response = await databases.listDocuments<AnimalDocument>(
    DATABASE_ID,
    COLLECTIONS.ANIMALS,
    queries
  );

  const pagination = calculatePaginationMeta(response.total, limit, offset);

  return {
    animals: response.documents.map(documentToAnimal),
    total: response.total,
    pagination,
  };
};

// Get animals by pack with pagination
// Uses index: packId (packId ASC)
export const getAnimalsByPack = async (
  packId: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const { limit, offset } = normalizePagination(options);

  const queries = [
    Query.equal('packId', packId),
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
    Query.offset(offset),
  ];

  const response = await databases.listDocuments<AnimalDocument>(
    DATABASE_ID,
    COLLECTIONS.ANIMALS,
    queries
  );

  const pagination = calculatePaginationMeta(response.total, limit, offset);

  return {
    animals: response.documents.map(documentToAnimal),
    total: response.total,
    pagination,
  };
};
