import { Models } from 'appwrite';

export type AnimalType = 'dog' | 'cat';
export type AnimalStatus = 'healthy' | 'needs_attention' | 'under_treatment';
export type TemperamentLevel = 'very_friendly' | 'friendly' | 'neutral' | 'shy' | 'fearful' | 'aggressive';
export type EnergyLevel = 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';

export interface AnimalLocation {
  area: string;
  coordinates: [number, number];
}

export interface AnimalPhotos {
  profile: string;
  gallery: string[];
}

export interface BehaviorProfile {
  temperament: TemperamentLevel;
  energyLevel: EnergyLevel;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  goodWithPeople: boolean;
  goodWithChildren: boolean;
  specialNeeds?: string;
  behavioralNotes?: string;
  lastUpdated: string;
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
  behavior?: BehaviorProfile;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

// Appwrite document type
export interface AnimalDocument
  extends Models.Document,
    Omit<AnimalProfile, 'id' | 'createdAt' | 'updatedAt'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
