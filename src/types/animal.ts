import { Models } from 'appwrite';

export type AnimalType = 'dog' | 'cat';
export type AnimalStatus = 'healthy' | 'needs_attention' | 'under_treatment';

export interface AnimalLocation {
  area: string;
  coordinates: [number, number];
}

export interface AnimalPhotos {
  profile: string;
  gallery: string[];
}

export interface AnimalProfile {
  id: string;
  name: string;
  type: AnimalType;
  age: number;
  breed?: string;
  location: AnimalLocation;
  currentFeeder?: string;
  medicalHistory: string[]; // Array of MedicalRecord IDs
  photos: AnimalPhotos;
  packId?: string;
  status: AnimalStatus;
  createdAt: string;
  updatedAt: string;
}

// Appwrite document type
export interface AnimalDocument extends Models.Document, Omit<AnimalProfile, 'id' | 'createdAt' | 'updatedAt'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
