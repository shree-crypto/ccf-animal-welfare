import { Models } from 'appwrite';

export interface Territory {
  id: string;
  name: string;
  boundaries: [number, number][];
  packSize: number;
  animals: string[]; // Animal IDs
  assignedVolunteers: string[];
  lastUpdated: string;
}

// Appwrite document type
export interface TerritoryDocument extends Models.Document, Omit<Territory, 'id' | 'lastUpdated'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
