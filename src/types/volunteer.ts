import { Models } from 'appwrite';

export type VolunteerSkill =
  | 'animal_handling'
  | 'medical_assistance'
  | 'photography'
  | 'administration'
  | 'fundraising'
  | 'social_media'
  | 'training'
  | 'grooming';

export type BadgeType =
  | 'first_task'
  | 'week_streak'
  | 'month_streak'
  | 'emergency_responder'
  | '10_hours'
  | '50_hours'
  | '100_hours'
  | 'animal_champion'
  | 'medical_hero'
  | 'super_volunteer';

export interface VolunteerHours {
  volunteerId: string;
  taskId: string;
  animalId?: string;
  territoryId?: string;
  hours: number;
  date: string;
  taskType: string;
  notes?: string;
}

export interface VolunteerStats {
  volunteerId: string;
  totalHours: number;
  tasksCompleted: number;
  animalsHelped: number;
  badges: BadgeType[];
  joinDate: string;
  lastActiveDate: string;
  skills: VolunteerSkill[];
  preferredTaskTypes: string[];
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

// Appwrite document types
export interface VolunteerHoursDocument
  extends Models.Document,
    Omit<VolunteerHours, 'id'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface VolunteerStatsDocument
  extends Models.Document,
    Omit<VolunteerStats, 'id'> {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
