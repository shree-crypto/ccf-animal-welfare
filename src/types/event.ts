export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  type:
    | 'feeding'
    | 'medical'
    | 'training'
    | 'fundraiser'
    | 'awareness'
    | 'other';
  volunteersNeeded: number;
  volunteersRegistered: number;
  organizer: string;
  imageUrl?: string;
  registrationDeadline?: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  animalId?: string;
  animalName?: string;
  animalPhoto?: string;
  date: Date;
  images: string[];
  category: 'rescue' | 'recovery' | 'adoption' | 'milestone' | 'community';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
