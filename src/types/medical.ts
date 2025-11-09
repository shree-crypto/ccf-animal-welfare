import { Models } from 'appwrite';

export type MedicalRecordType =
  | 'checkup'
  | 'vaccination'
  | 'treatment'
  | 'emergency';

export interface MedicalRecord {
  id: string;
  animalId: string;
  date: string;
  type: MedicalRecordType;
  description: string;
  veterinarian?: string;
  medications?: string[];
  documents: string[]; // File URLs
  followUpRequired: boolean;
  followUpDate?: string;
}

// Appwrite document type
export interface MedicalRecordDocument
  extends Models.Document,
    Omit<MedicalRecord, 'id'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
