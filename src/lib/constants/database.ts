// Appwrite Database and Collection IDs
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ccf-database';

export const COLLECTIONS = {
  ANIMALS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ANIMALS || 'animals',
  TERRITORIES:
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TERRITORIES || 'territories',
  TASKS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS || 'tasks',
  MEDICAL_RECORDS:
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_MEDICAL_RECORDS ||
    'medical-records',
  NOTIFICATIONS:
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATIONS ||
    'notifications',
  NOTIFICATION_PREFERENCES:
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATION_PREFERENCES ||
    'notification-preferences',
  IMPACT_METRICS:
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_IMPACT_METRICS ||
    'impact-metrics',
  RECENT_ACTIVITIES:
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_RECENT_ACTIVITIES ||
    'recent-activities',
} as const;

// Appwrite Storage Bucket IDs
export const STORAGE_BUCKETS = {
  ANIMAL_PHOTOS:
    process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ANIMAL_PHOTOS || 'animal-photos',
  MEDICAL_DOCUMENTS:
    process.env.NEXT_PUBLIC_APPWRITE_BUCKET_MEDICAL_DOCUMENTS ||
    'medical-documents',
} as const;

// Collection permissions
export const PERMISSIONS = {
  PUBLIC_READ: 'read("any")',
  VOLUNTEER_READ: 'read("team:volunteers")',
  VOLUNTEER_WRITE: 'write("team:volunteers")',
  ADMIN_READ: 'read("team:admins")',
  ADMIN_WRITE: 'write("team:admins")',
} as const;
