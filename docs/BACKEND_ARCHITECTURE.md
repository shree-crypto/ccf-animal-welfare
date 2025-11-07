# Backend Architecture

## Overview

The backend uses Appwrite as a Backend-as-a-Service (BaaS) solution, providing database, authentication, storage, and real-time capabilities. The application layer abstracts Appwrite operations through a well-organized database layer.

## Appwrite Setup

### Configuration

**Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=ccf-animal-welfare
NEXT_PUBLIC_APPWRITE_DATABASE_ID=ccf-database

# Collections
NEXT_PUBLIC_APPWRITE_COLLECTION_ANIMALS=animals
NEXT_PUBLIC_APPWRITE_COLLECTION_TERRITORIES=territories
NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS=tasks
NEXT_PUBLIC_APPWRITE_COLLECTION_MEDICAL_RECORDS=medical-records
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATIONS=notifications
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATION_PREFERENCES=notification-preferences

# Storage Buckets
NEXT_PUBLIC_APPWRITE_BUCKET_ANIMAL_PHOTOS=animal-photos
NEXT_PUBLIC_APPWRITE_BUCKET_MEDICAL_DOCUMENTS=medical-documents

# Teams
NEXT_PUBLIC_APPWRITE_VOLUNTEER_TEAM_ID=volunteer-team
NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID=admin-team
```

### Client Initialization

**Location**: `src/lib/appwrite.ts`

```typescript
import { Client, Account, Databases, Storage, Teams } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export { client };
```

### Local Development

**Docker Compose** (`docker-compose.yml`):
```bash
# Start Appwrite
docker-compose up -d

# Stop Appwrite
docker-compose down

# View logs
docker-compose logs -f
```

Appwrite Console: `http://localhost`

## Database Layer

### Architecture

The database layer (`src/lib/db/`) provides abstraction over Appwrite operations:

```
Application Code
    ↓
Database Functions (lib/db/*.ts)
    ↓
Validation (Zod schemas)
    ↓
Appwrite SDK
    ↓
Appwrite Database
```

### Database Operations

#### Animals (`src/lib/db/animals.ts`)

**Create Animal:**
```typescript
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
```

**Get Animals with Filters:**
```typescript
export const getAnimals = async (filters?: {
  type?: 'dog' | 'cat';
  status?: 'healthy' | 'needs_attention' | 'under_treatment';
  packId?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: PaginationMeta;
}> => {
  const queries: string[] = [];

  // Add filters in order that matches compound indexes
  if (filters?.type) {
    queries.push(Query.equal('type', filters.type));
  }
  if (filters?.status) {
    queries.push(Query.equal('status', filters.status));
  }
  if (filters?.packId) {
    queries.push(Query.equal('packId', filters.packId));
  }

  // Add ordering
  queries.push(Query.orderDesc('$createdAt'));

  // Apply pagination
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
};
```

**Update Animal:**
```typescript
export const updateAnimal = async (
  id: string,
  data: Partial<Omit<AnimalProfile, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<AnimalProfile> => {
  const validatedData = updateAnimalSchema.parse(data);

  const document = await databases.updateDocument<AnimalDocument>(
    DATABASE_ID,
    COLLECTIONS.ANIMALS,
    id,
    validatedData
  );

  return documentToAnimal(document);
};
```

**Delete Animal:**
```typescript
export const deleteAnimal = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, id);
};
```

**Search Animals:**
```typescript
// Uses fulltext index: name_fulltext
export const searchAnimalsByName = async (
  searchTerm: string,
  options?: { limit?: number; offset?: number }
): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: PaginationMeta;
}> => {
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
};
```

**Get Animals Needing Attention:**
```typescript
// Uses index: status_createdAt (status ASC, $createdAt DESC)
export const getAnimalsNeedingAttention = async (
  options?: { limit?: number; offset?: number }
): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: PaginationMeta;
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
```


#### Tasks (`src/lib/db/tasks.ts`)

**Key Functions:**
- `createTask()`: Create new task
- `getTasks()`: Get tasks with filters (assignedTo, completed, type, priority)
- `getTaskById()`: Get single task
- `updateTask()`: Update task
- `deleteTask()`: Delete task
- `getTasksByAnimal()`: Get tasks for specific animal
- `getTasksByTerritory()`: Get tasks for specific territory
- `getUpcomingTasks()`: Get upcoming tasks for dashboard

**Index Usage:**
- `assignedTo_completed_scheduledDate`: For volunteer task lists
- `type_priority_scheduledDate`: For task prioritization
- `animalId_completed`: For animal-specific tasks
- `territoryId_scheduledDate`: For territory-specific tasks

#### Medical Records (`src/lib/db/medical.ts`)

**Key Functions:**
- `createMedicalRecord()`: Create new medical record
- `getMedicalRecords()`: Get records with filters (animalId, type, followUpRequired)
- `getMedicalRecordById()`: Get single record
- `updateMedicalRecord()`: Update record
- `deleteMedicalRecord()`: Delete record
- `getAnimalMedicalHistory()`: Get complete history for an animal
- `getRecordsNeedingFollowUp()`: Get records with pending follow-ups

**Index Usage:**
- `animalId_date`: For animal medical history
- `type_date`: For filtering by record type
- `followUpRequired_followUpDate`: For follow-up tracking
- `animalId_type_date`: For combined filtering

#### Notifications (`src/lib/db/notifications.ts`)

**Key Functions:**
- `createNotification()`: Create new notification
- `getUserNotifications()`: Get notifications for a user
- `getNotificationById()`: Get single notification
- `markAsRead()`: Mark notification as read
- `markAllAsRead()`: Mark all user notifications as read
- `deleteNotification()`: Delete notification
- `getUnreadCount()`: Get unread notification count
- `cleanupExpiredNotifications()`: Remove expired notifications

**Index Usage:**
- `recipientId_read_createdAt`: For user notification lists
- `recipientId_type_createdAt`: For filtering by type
- `recipientId_priority_read`: For priority sorting
- `expiresAt`: For cleanup operations

**Real-time Integration:**
Notifications use Appwrite's real-time subscriptions in `NotificationContext` to automatically update the UI when notifications are created, updated, or deleted.

### Query Configuration

**Location**: `src/lib/db/query-config.ts`

**Pagination Defaults:**
```typescript
export const PAGINATION = {
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;
```

**Query Limits:**
```typescript
export const QUERY_LIMITS = {
  SEARCH_RESULTS: 50,
  DASHBOARD_ITEMS: 10,
  NOTIFICATION_BATCH: 20,
  MEDICAL_HISTORY: 50,
  TASK_LIST: 25,
  ANIMAL_GALLERY: 25,
  TERRITORY_LIST: 50,
} as const;
```

**Normalize Pagination:**
```typescript
export function normalizePagination(options?: {
  limit?: number;
  offset?: number;
}): { limit: number; offset: number } {
  const limit = Math.min(
    Math.max(options?.limit || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  );
  const offset = Math.max(options?.offset || PAGINATION.DEFAULT_OFFSET, 0);

  return { limit, offset };
}
```

**Calculate Pagination Metadata:**
```typescript
export function calculatePaginationMeta(
  total: number,
  limit: number,
  offset: number
): {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
} {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasMore = offset + limit < total;

  return {
    total,
    limit,
    offset,
    hasMore,
    currentPage,
    totalPages,
  };
}
```

### Database Indexes

**Location**: `src/lib/setup/create-indexes.ts`

Comprehensive index configuration for optimal query performance. Each collection has multiple indexes designed for specific query patterns.

**Example: Animals Collection Indexes**
```typescript
[COLLECTIONS.ANIMALS]: [
  {
    key: 'type_status',
    type: 'key',
    attributes: ['type', 'status'],
    orders: ['ASC', 'ASC'],
  },
  {
    key: 'packId',
    type: 'key',
    attributes: ['packId'],
    orders: ['ASC'],
  },
  {
    key: 'status_createdAt',
    type: 'key',
    attributes: ['status', '$createdAt'],
    orders: ['ASC', 'DESC'],
  },
  {
    key: 'name_fulltext',
    type: 'fulltext',
    attributes: ['name'],
  },
]
```

**Index Creation:**
Indexes must be created manually in Appwrite Console or using Appwrite CLI. The script provides:
1. Detailed index configurations
2. CLI commands for automation
3. Documentation for manual creation

**Run the script:**
```bash
npx tsx src/lib/setup/create-indexes.ts
```

See `docs/QUERY_OPTIMIZATION.md` for detailed information.

## Authentication

### AuthService

**Location**: `src/lib/auth.ts`

**Class Methods:**

**Register:**
```typescript
async register(email: string, password: string, name: string) {
  const user = await account.create(ID.unique(), email, password, name);
  await account.createEmailPasswordSession(email, password);
  return user;
}
```

**Login:**
```typescript
async login(email: string, password: string) {
  const session = await account.createEmailPasswordSession(email, password);
  return session;
}
```

**Logout:**
```typescript
async logout() {
  await account.deleteSession('current');
}
```

**Get Current User:**
```typescript
async getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
}
```

**Get User Role:**
```typescript
async getUserRole(): Promise<UserRole> {
  const teamsList = await teams.list();
  
  // Check if user is in admin team
  const isAdmin = teamsList.teams.some(team => team.$id === TEAM_IDS.ADMIN);
  if (isAdmin) return 'admin';
  
  // Check if user is in volunteer team
  const isVolunteer = teamsList.teams.some(team => team.$id === TEAM_IDS.VOLUNTEER);
  if (isVolunteer) return 'volunteer';
  
  return 'public';
}
```

**Check Role:**
```typescript
checkRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
```

### Role Hierarchy

**Location**: `src/lib/constants/teams.ts`

```typescript
export const ROLE_HIERARCHY = {
  public: 0,
  volunteer: 1,
  admin: 2,
} as const;
```

### Team-based Permissions

Appwrite uses teams for role-based access control:
- **Public**: No team membership required
- **Volunteer**: Member of volunteer team
- **Admin**: Member of admin team

Admins automatically have volunteer permissions due to role hierarchy.

## Storage

### Storage Service

**Location**: `src/lib/storage/index.ts`

**Upload File:**
```typescript
export const uploadFile = async ({
  file,
  bucketId,
  fileId = ID.unique(),
  onProgress,
}: UploadFileOptions): Promise<FileInfo> => {
  const uploadedFile = await storage.createFile(
    bucketId,
    fileId,
    file,
    undefined,
    onProgress
  );

  const fileUrl = getFileUrl(bucketId, uploadedFile.$id);

  return {
    id: uploadedFile.$id,
    name: uploadedFile.name,
    size: uploadedFile.sizeOriginal,
    mimeType: uploadedFile.mimeType,
    url: fileUrl,
  };
};
```

**Get File URL:**
```typescript
export const getFileUrl = (bucketId: string, fileId: string): string => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};
```

**Get File Preview URL (for images):**
```typescript
export const getFilePreviewUrl = (
  bucketId: string,
  fileId: string,
  width?: number,
  height?: number,
  quality?: number
): string => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  
  let url = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}`;
  
  if (width) url += `&width=${width}`;
  if (height) url += `&height=${height}`;
  if (quality) url += `&quality=${quality}`;
  
  return url;
};
```

**Delete File:**
```typescript
export const deleteFile = async (bucketId: string, fileId: string): Promise<void> => {
  await storage.deleteFile(bucketId, fileId);
};
```

### Specialized Upload Functions

**Upload Animal Photo:**
```typescript
export const uploadAnimalPhoto = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<FileInfo> => {
  return uploadFile({
    file,
    bucketId: STORAGE_BUCKETS.ANIMAL_PHOTOS,
    onProgress,
  });
};
```

**Upload Medical Document:**
```typescript
export const uploadMedicalDocument = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<FileInfo> => {
  return uploadFile({
    file,
    bucketId: STORAGE_BUCKETS.MEDICAL_DOCUMENTS,
    onProgress,
  });
};
```

### File Validation

**Image Validation:**
```typescript
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};
```

**Document Validation:**
```typescript
export const isValidDocumentFile = (file: File): boolean => {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return validTypes.includes(file.type);
};
```

**Size Validation:**
```typescript
export const isValidFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
```

### Storage Buckets

Two storage buckets are configured:
1. **animal-photos**: For animal profile and gallery photos
2. **medical-documents**: For medical records and documents

## Real-time Features

### Appwrite Subscriptions

Appwrite provides real-time updates through WebSocket subscriptions.

**Example: Notification Subscriptions**
```typescript
const unsubscribe = client.subscribe(
  `databases.${DATABASE_ID}.collections.${COLLECTIONS.NOTIFICATIONS}.documents`,
  (response) => {
    const payload = response.payload as any;

    // Only process notifications for the current user
    if (payload.recipientId !== user.$id) return;

    if (response.events.includes('*.create')) {
      // Handle new notification
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    } else if (response.events.includes('*.update')) {
      // Handle notification update
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === payload.$id ? updatedNotification : notif
        )
      );
    } else if (response.events.includes('*.delete')) {
      // Handle notification deletion
      setNotifications(prev =>
        prev.filter(notif => notif.id !== payload.$id)
      );
    }
  }
);

// Cleanup
return () => unsubscribe();
```

### Subscription Patterns

**Channel Patterns:**
- `databases.[DATABASE_ID].collections.[COLLECTION_ID].documents`: All documents in collection
- `databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.[DOCUMENT_ID]`: Specific document

**Event Types:**
- `*.create`: Document created
- `*.update`: Document updated
- `*.delete`: Document deleted

## Validation

### Zod Schemas

All data validation uses Zod for type-safe validation.

**Location**: `src/lib/validations/`

**Example: Animal Validation**
```typescript
import { z } from 'zod';

export const animalLocationSchema = z.object({
  area: z.string().min(1, 'Area is required'),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const animalPhotosSchema = z.object({
  profile: z.string().url('Profile photo must be a valid URL'),
  gallery: z.array(z.string().url('Gallery photos must be valid URLs')),
});

export const animalProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['dog', 'cat'], { message: 'Type must be either dog or cat' }),
  age: z.number().min(0, 'Age must be positive').max(30),
  breed: z.string().max(100).optional(),
  location: animalLocationSchema,
  currentFeeder: z.string().optional(),
  medicalHistory: z.array(z.string()),
  photos: animalPhotosSchema,
  packId: z.string().optional(),
  status: z.enum(['healthy', 'needs_attention', 'under_treatment']),
});

export const createAnimalSchema = animalProfileSchema;
export const updateAnimalSchema = animalProfileSchema.partial();

export type AnimalProfileFormData = z.infer<typeof animalProfileSchema>;
```

### Validation in Database Operations

```typescript
export const createAnimal = async (data: CreateAnimalInput): Promise<AnimalProfile> => {
  // Validate data before database operation
  const validatedData = createAnimalSchema.parse(data);

  const document = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ANIMALS,
    ID.unique(),
    validatedData
  );

  return documentToAnimal(document);
};
```

## Error Handling

### Database Errors

```typescript
export const getAnimalById = async (id: string): Promise<AnimalProfile | null> => {
  try {
    const document = await databases.getDocument<AnimalDocument>(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      id
    );
    return documentToAnimal(document);
  } catch (error) {
    console.error('Error fetching animal:', error);
    return null;
  }
};
```

### Validation Errors

Zod throws validation errors with detailed messages:
```typescript
try {
  const validatedData = animalProfileSchema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    // error.errors contains detailed validation errors
    console.error(error.errors);
  }
}
```

### Appwrite Errors

Appwrite throws `AppwriteException` with error codes:
```typescript
try {
  await databases.createDocument(...);
} catch (error) {
  if (error instanceof AppwriteException) {
    console.error(error.code, error.message);
  }
}
```

## Utilities

### Notification Utilities

**Location**: `src/lib/notifications/`

Helper functions for creating notifications:
- `createTaskNotification()`: Notify about task assignments
- `createMedicalNotification()`: Notify about medical updates
- `createSystemNotification()`: System announcements

### General Utilities

**Location**: `src/lib/utils.ts`

**cn() - Class Name Utility:**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage:
```typescript
<div className={cn('base-class', isActive && 'active-class', className)} />
```
