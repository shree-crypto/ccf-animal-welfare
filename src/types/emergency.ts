import { Models } from 'appwrite';

export type EmergencyType = 
  | 'injured_animal'
  | 'aggressive_behavior'
  | 'lost_animal'
  | 'medical_emergency'
  | 'safety_concern'
  | 'severe_weather'
  | 'other';

export type EmergencyPriority = 'critical' | 'high' | 'medium' | 'low';
export type EmergencyStatus = 'open' | 'in_progress' | 'resolved' | 'false_alarm';

export interface EmergencyAlert {
  id: string;
  type: EmergencyType;
  priority: EmergencyPriority;
  status: EmergencyStatus;
  title: string;
  description: string;
  animalId?: string;
  territoryId?: string;
  location: {
    area: string;
    coordinates?: [number, number];
  };
  reportedBy: string;
  reportedAt: string;
  respondedBy?: string;
  respondedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
  photos?: string[];
  notifiedVolunteers: string[];
}

export interface CommunityReport {
  id: string;
  reportType: 'sighting' | 'concern' | 'injured' | 'lost' | 'other';
  animalDescription?: string;
  location: string;
  coordinates?: [number, number];
  description: string;
  reporterName?: string;
  reporterContact?: string;
  photos?: string[];
  status: 'new' | 'reviewing' | 'investigating' | 'resolved' | 'dismissed';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Appwrite document types
export interface EmergencyAlertDocument extends Models.Document, Omit<EmergencyAlert, 'id'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface CommunityReportDocument extends Models.Document, Omit<CommunityReport, 'id' | 'createdAt' | 'updatedAt'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
