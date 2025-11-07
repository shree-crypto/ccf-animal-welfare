import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';
import { MedicalRecord, MedicalRecordDocument, MedicalRecordType } from '@/types/medical';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from '@/lib/validations/medical';
import { triggerMedicalAlertNotification, triggerMedicalFollowupNotification } from '@/lib/notifications/triggers';
import { getAnimalById } from './animals';
import { normalizePagination, calculatePaginationMeta, QUERY_LIMITS } from './query-config';

// Helper to convert Appwrite document to MedicalRecord
const documentToMedicalRecord = (doc: MedicalRecordDocument): MedicalRecord => ({
  id: doc.$id,
  animalId: doc.animalId,
  date: doc.date,
  type: doc.type,
  description: doc.description,
  veterinarian: doc.veterinarian,
  medications: doc.medications,
  documents: doc.documents,
  followUpRequired: doc.followUpRequired,
  followUpDate: doc.followUpDate,
});

// Create a new medical record
export const createMedicalRecord = async (
  data: Omit<MedicalRecord, 'id'>,
  options?: { sendNotification?: boolean; notifyUserIds?: string[] }
): Promise<MedicalRecord> => {
  // Validate data
  const validatedData = createMedicalRecordSchema.parse(data);

  const document = await databases.createDocument<MedicalRecordDocument>(
    DATABASE_ID,
    COLLECTIONS.MEDICAL_RECORDS,
    ID.unique(),
    validatedData
  );

  const medicalRecord = documentToMedicalRecord(document);

  // Send notifications if enabled (default: true for emergency/treatment types)
  const shouldNotify =
    options?.sendNotification !== false &&
    (medicalRecord.type === 'emergency' || medicalRecord.type === 'treatment');

  if (shouldNotify && options?.notifyUserIds && options.notifyUserIds.length > 0) {
    try {
      const animal = await getAnimalById(medicalRecord.animalId);
      if (animal) {
        await triggerMedicalAlertNotification(animal, medicalRecord, options.notifyUserIds);
      }
    } catch (error) {
      console.error('Failed to send medical alert notification:', error);
      // Don't fail record creation if notification fails
    }
  }

  // Send follow-up notification if required
  if (medicalRecord.followUpRequired && options?.notifyUserIds && options.notifyUserIds.length > 0) {
    try {
      const animal = await getAnimalById(medicalRecord.animalId);
      if (animal) {
        // Send to first user in the list (typically the assigned caretaker)
        await triggerMedicalFollowupNotification(animal, medicalRecord, options.notifyUserIds[0]);
      }
    } catch (error) {
      console.error('Failed to send medical follow-up notification:', error);
    }
  }

  return medicalRecord;
};

// Get a medical record by ID
export const getMedicalRecordById = async (id: string): Promise<MedicalRecord | null> => {
  try {
    const document = await databases.getDocument<MedicalRecordDocument>(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS,
      id
    );
    return documentToMedicalRecord(document);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    return null;
  }
};

// Get all medical records with optional filters
// Uses indexes:
// - animalId_date (animalId ASC, date DESC)
// - type_date (type ASC, date DESC)
// - followUpRequired_followUpDate (followUpRequired ASC, followUpDate ASC)
// - animalId_type_date (animalId ASC, type ASC, date DESC)
export const getMedicalRecords = async (filters?: {
  animalId?: string;
  type?: MedicalRecordType;
  followUpRequired?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  records: MedicalRecord[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const queries: string[] = [];

  // Add filters in order that matches compound indexes
  // Index: animalId_type_date or animalId_date
  if (filters?.animalId) {
    queries.push(Query.equal('animalId', filters.animalId));
    if (filters?.type) {
      queries.push(Query.equal('type', filters.type));
    }
  }
  // Index: type_date
  else if (filters?.type) {
    queries.push(Query.equal('type', filters.type));
  }
  // Index: followUpRequired_followUpDate
  else if (filters?.followUpRequired !== undefined) {
    queries.push(Query.equal('followUpRequired', filters.followUpRequired));
  }

  // Date range filters
  if (filters?.startDate) {
    queries.push(Query.greaterThanEqual('date', filters.startDate));
  }
  if (filters?.endDate) {
    queries.push(Query.lessThanEqual('date', filters.endDate));
  }

  // Order by date descending (most recent first)
  queries.push(Query.orderDesc('date'));

  // Apply normalized pagination
  const { limit, offset } = normalizePagination({
    limit: filters?.limit || QUERY_LIMITS.MEDICAL_HISTORY,
    offset: filters?.offset,
  });
  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  const response = await databases.listDocuments<MedicalRecordDocument>(
    DATABASE_ID,
    COLLECTIONS.MEDICAL_RECORDS,
    queries
  );

  const pagination = calculatePaginationMeta(response.total, limit, offset);

  return {
    records: response.documents.map(documentToMedicalRecord),
    total: response.total,
    pagination,
  };
};

// Update a medical record
export const updateMedicalRecord = async (
  id: string,
  data: Partial<Omit<MedicalRecord, 'id'>>
): Promise<MedicalRecord> => {
  // Validate data
  const validatedData = updateMedicalRecordSchema.parse(data);

  const document = await databases.updateDocument<MedicalRecordDocument>(
    DATABASE_ID,
    COLLECTIONS.MEDICAL_RECORDS,
    id,
    validatedData
  );

  return documentToMedicalRecord(document);
};

// Delete a medical record
export const deleteMedicalRecord = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MEDICAL_RECORDS, id);
};

// Get medical history for an animal
// Uses index: animalId_date
export const getAnimalMedicalHistory = async (
  animalId: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  records: MedicalRecord[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  return getMedicalRecords({
    animalId,
    limit: options?.limit,
    offset: options?.offset,
  });
};

// Get animals requiring follow-up
// Uses index: followUpRequired_followUpDate
export const getFollowUpRecords = async (options?: {
  limit?: number;
  offset?: number;
}): Promise<{
  records: MedicalRecord[];
  total: number;
  pagination: ReturnType<typeof calculatePaginationMeta>;
}> => {
  const now = new Date().toISOString();
  return getMedicalRecords({
    followUpRequired: true,
    endDate: now,
    limit: options?.limit || QUERY_LIMITS.DASHBOARD_ITEMS,
    offset: options?.offset,
  });
};
