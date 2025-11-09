# Database Schema

## Overview

The application uses Appwrite Database with six main collections. Each collection is optimized with indexes for common query patterns.

## Collections

### 1. Animals Collection

**Collection ID**: `animals`

**Purpose**: Store animal profiles and information

**Schema:**

| Field                | Type   | Required | Description                                        |
| -------------------- | ------ | -------- | -------------------------------------------------- |
| name                 | string | Yes      | Animal's name                                      |
| type                 | string | Yes      | 'dog' or 'cat'                                     |
| age                  | number | Yes      | Age in years (0-30)                                |
| breed                | string | No       | Breed information                                  |
| location             | object | Yes      | Location details                                   |
| location.area        | string | Yes      | Area name                                          |
| location.coordinates | array  | Yes      | [latitude, longitude]                              |
| currentFeeder        | string | No       | Current feeder's name                              |
| medicalHistory       | array  | Yes      | Array of medical record IDs                        |
| photos               | object | Yes      | Photo URLs                                         |
| photos.profile       | string | Yes      | Profile photo URL                                  |
| photos.gallery       | array  | Yes      | Array of gallery photo URLs                        |
| packId               | string | No       | Territory/pack ID                                  |
| status               | string | Yes      | 'healthy', 'needs_attention', or 'under_treatment' |

**Indexes:**

- `type_status` (type ASC, status ASC): For filtering by type and status
- `packId` (packId ASC): For pack-based queries
- `status_createdAt` (status ASC, $createdAt DESC): For status-based sorting
- `name_fulltext` (fulltext): For name search

**Example Document:**

```json
{
  "$id": "animal_123",
  "name": "Max",
  "type": "dog",
  "age": 3,
  "breed": "Golden Retriever",
  "location": {
    "area": "Main Campus",
    "coordinates": [29.8543, 77.888]
  },
  "currentFeeder": "John Doe",
  "medicalHistory": ["med_001", "med_002"],
  "photos": {
    "profile": "https://...",
    "gallery": ["https://...", "https://..."]
  },
  "packId": "pack_001",
  "status": "healthy",
  "$createdAt": "2024-01-01T00:00:00.000Z",
  "$updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Territories Collection

**Collection ID**: `territories`

**Purpose**: Store territory/pack information

**Schema:**

| Field              | Type   | Required | Description                                 |
| ------------------ | ------ | -------- | ------------------------------------------- |
| name               | string | Yes      | Territory name                              |
| description        | string | No       | Territory description                       |
| boundaries         | array  | Yes      | Array of coordinate pairs defining boundary |
| packSize           | number | Yes      | Number of animals in pack                   |
| assignedVolunteers | array  | Yes      | Array of volunteer user IDs                 |
| feedingSchedule    | object | No       | Feeding schedule details                    |
| notes              | string | No       | Additional notes                            |

**Indexes:**

- `assignedVolunteers` (assignedVolunteers ASC): For volunteer assignments
- `packSize_updatedAt` (packSize DESC, $updatedAt DESC): For sorting by pack size

**Example Document:**

```json
{
  "$id": "territory_001",
  "name": "Main Campus Pack",
  "description": "Dogs near the main academic buildings",
  "boundaries": [
    [29.8543, 77.888],
    [29.8545, 77.8882],
    [29.8547, 77.8878]
  ],
  "packSize": 5,
  "assignedVolunteers": ["user_001", "user_002"],
  "feedingSchedule": {
    "morning": "08:00",
    "evening": "18:00"
  },
  "notes": "Friendly pack, no aggressive behavior",
  "$createdAt": "2024-01-01T00:00:00.000Z",
  "$updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Tasks Collection

**Collection ID**: `tasks`

**Purpose**: Store volunteer tasks and schedules

**Schema:**

| Field         | Type    | Required | Description                                             |
| ------------- | ------- | -------- | ------------------------------------------------------- |
| title         | string  | Yes      | Task title                                              |
| description   | string  | No       | Task description                                        |
| type          | string  | Yes      | 'feeding', 'medical', 'grooming', 'monitoring', 'other' |
| priority      | string  | Yes      | 'low', 'medium', 'high', 'urgent'                       |
| status        | string  | Yes      | 'pending', 'in_progress', 'completed', 'cancelled'      |
| scheduledDate | string  | Yes      | ISO date string                                         |
| scheduledTime | string  | No       | Time in HH:MM format                                    |
| assignedTo    | string  | No       | User ID of assigned volunteer                           |
| animalId      | string  | No       | Related animal ID                                       |
| territoryId   | string  | No       | Related territory ID                                    |
| completed     | boolean | Yes      | Completion status                                       |
| completedAt   | string  | No       | ISO date string                                         |
| completedBy   | string  | No       | User ID who completed                                   |
| notes         | string  | No       | Task notes                                              |

**Indexes:**

- `assignedTo_completed_scheduledDate` (assignedTo ASC, completed ASC, scheduledDate ASC): For volunteer task lists
- `type_priority_scheduledDate` (type ASC, priority DESC, scheduledDate ASC): For task prioritization
- `animalId_completed` (animalId ASC, completed ASC): For animal-specific tasks
- `territoryId_scheduledDate` (territoryId ASC, scheduledDate ASC): For territory tasks
- `completed_scheduledDate` (completed ASC, scheduledDate ASC): For general task lists

**Example Document:**

```json
{
  "$id": "task_001",
  "title": "Morning Feeding - Main Campus",
  "description": "Feed the main campus pack",
  "type": "feeding",
  "priority": "high",
  "status": "pending",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "08:00",
  "assignedTo": "user_001",
  "animalId": null,
  "territoryId": "territory_001",
  "completed": false,
  "completedAt": null,
  "completedBy": null,
  "notes": "Bring extra food",
  "$createdAt": "2024-01-01T00:00:00.000Z",
  "$updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Medical Records Collection

**Collection ID**: `medical-records`

**Purpose**: Store medical history and records

**Schema:**

| Field            | Type    | Required | Description                                                            |
| ---------------- | ------- | -------- | ---------------------------------------------------------------------- |
| animalId         | string  | Yes      | Related animal ID                                                      |
| type             | string  | Yes      | 'checkup', 'vaccination', 'treatment', 'surgery', 'emergency', 'other' |
| date             | string  | Yes      | ISO date string                                                        |
| veterinarian     | string  | No       | Veterinarian name                                                      |
| diagnosis        | string  | No       | Diagnosis details                                                      |
| treatment        | string  | No       | Treatment provided                                                     |
| medications      | array   | No       | Array of medication names                                              |
| notes            | string  | No       | Additional notes                                                       |
| followUpRequired | boolean | Yes      | Whether follow-up is needed                                            |
| followUpDate     | string  | No       | ISO date string for follow-up                                          |
| documents        | array   | No       | Array of document file IDs                                             |
| cost             | number  | No       | Cost in rupees                                                         |

**Indexes:**

- `animalId_date` (animalId ASC, date DESC): For animal medical history
- `type_date` (type ASC, date DESC): For filtering by record type
- `followUpRequired_followUpDate` (followUpRequired ASC, followUpDate ASC): For follow-up tracking
- `animalId_type_date` (animalId ASC, type ASC, date DESC): For combined filtering

**Example Document:**

```json
{
  "$id": "medical_001",
  "animalId": "animal_123",
  "type": "vaccination",
  "date": "2024-01-10",
  "veterinarian": "Dr. Smith",
  "diagnosis": "Routine vaccination",
  "treatment": "Rabies vaccine administered",
  "medications": ["Rabies Vaccine"],
  "notes": "No adverse reactions",
  "followUpRequired": true,
  "followUpDate": "2025-01-10",
  "documents": ["doc_001"],
  "cost": 500,
  "$createdAt": "2024-01-10T00:00:00.000Z",
  "$updatedAt": "2024-01-10T00:00:00.000Z"
}
```

### 5. Notifications Collection

**Collection ID**: `notifications`

**Purpose**: Store user notifications

**Schema:**

| Field             | Type    | Required | Description                                                                                  |
| ----------------- | ------- | -------- | -------------------------------------------------------------------------------------------- |
| type              | string  | Yes      | 'task_assigned', 'task_reminder', 'medical_alert', 'volunteer_update', 'system_announcement' |
| priority          | string  | Yes      | 'low', 'medium', 'high', 'urgent'                                                            |
| title             | string  | Yes      | Notification title                                                                           |
| message           | string  | Yes      | Notification message                                                                         |
| recipientId       | string  | Yes      | User ID of recipient                                                                         |
| relatedEntityId   | string  | No       | ID of related entity (task, animal, etc.)                                                    |
| relatedEntityType | string  | No       | Type of related entity                                                                       |
| read              | boolean | Yes      | Read status                                                                                  |
| readAt            | string  | No       | ISO date string when read                                                                    |
| actionUrl         | string  | No       | URL for notification action                                                                  |
| expiresAt         | string  | No       | ISO date string for expiration                                                               |

**Indexes:**

- `recipientId_read_createdAt` (recipientId ASC, read ASC, $createdAt DESC): For user notification lists
- `recipientId_type_createdAt` (recipientId ASC, type ASC, $createdAt DESC): For filtering by type
- `recipientId_priority_read` (recipientId ASC, priority DESC, read ASC): For priority sorting
- `expiresAt` (expiresAt ASC): For cleanup operations

**Example Document:**

```json
{
  "$id": "notif_001",
  "type": "task_assigned",
  "priority": "high",
  "title": "New Task Assigned",
  "message": "You have been assigned to morning feeding at Main Campus",
  "recipientId": "user_001",
  "relatedEntityId": "task_001",
  "relatedEntityType": "task",
  "read": false,
  "readAt": null,
  "actionUrl": "/tasks/task_001",
  "expiresAt": "2024-01-20T00:00:00.000Z",
  "$createdAt": "2024-01-15T00:00:00.000Z",
  "$updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### 6. Notification Preferences Collection

**Collection ID**: `notification-preferences`

**Purpose**: Store user notification preferences

**Schema:**

| Field               | Type    | Required | Description                 |
| ------------------- | ------- | -------- | --------------------------- |
| userId              | string  | Yes      | User ID (unique)            |
| emailNotifications  | boolean | Yes      | Enable email notifications  |
| pushNotifications   | boolean | Yes      | Enable push notifications   |
| taskReminders       | boolean | Yes      | Enable task reminders       |
| medicalAlerts       | boolean | Yes      | Enable medical alerts       |
| volunteerUpdates    | boolean | Yes      | Enable volunteer updates    |
| systemAnnouncements | boolean | Yes      | Enable system announcements |
| dailyDigest         | boolean | Yes      | Enable daily digest email   |

**Indexes:**

- `userId_unique` (userId ASC, unique): Ensure one preference per user

**Example Document:**

```json
{
  "$id": "pref_001",
  "userId": "user_001",
  "emailNotifications": true,
  "pushNotifications": true,
  "taskReminders": true,
  "medicalAlerts": true,
  "volunteerUpdates": true,
  "systemAnnouncements": false,
  "dailyDigest": true,
  "$createdAt": "2024-01-01T00:00:00.000Z",
  "$updatedAt": "2024-01-15T00:00:00.000Z"
}
```

## Storage Buckets

### 1. Animal Photos Bucket

**Bucket ID**: `animal-photos`

**Purpose**: Store animal profile and gallery photos

**Allowed File Types:**

- image/jpeg
- image/jpg
- image/png
- image/webp

**Max File Size**: 10 MB

**Permissions:**

- Read: Public (anyone can view)
- Write: Volunteers and Admins only

### 2. Medical Documents Bucket

**Bucket ID**: `medical-documents`

**Purpose**: Store medical records and documents

**Allowed File Types:**

- image/jpeg
- image/jpg
- image/png
- image/webp
- application/pdf
- application/msword
- application/vnd.openxmlformats-officedocument.wordprocessingml.document

**Max File Size**: 10 MB

**Permissions:**

- Read: Volunteers and Admins only
- Write: Volunteers and Admins only

## Relationships

### Animal → Medical Records

- One-to-Many relationship
- `animals.medicalHistory` contains array of medical record IDs
- `medical-records.animalId` references animal

### Animal → Territory

- Many-to-One relationship
- `animals.packId` references territory
- `territories.packSize` tracks number of animals

### Task → Animal

- Many-to-One relationship (optional)
- `tasks.animalId` references animal

### Task → Territory

- Many-to-One relationship (optional)
- `tasks.territoryId` references territory

### Task → User (Volunteer)

- Many-to-One relationship
- `tasks.assignedTo` references user ID

### Territory → Users (Volunteers)

- Many-to-Many relationship
- `territories.assignedVolunteers` contains array of user IDs

### Notification → User

- Many-to-One relationship
- `notifications.recipientId` references user ID

### Notification → Entity (Generic)

- Many-to-One relationship (optional)
- `notifications.relatedEntityId` + `relatedEntityType` references any entity

## Data Flow Examples

### Creating an Animal with Photo

1. Upload photo to `animal-photos` bucket
2. Get file URL from storage
3. Create animal document with photo URL in `photos.profile`
4. Return animal profile

### Assigning a Task

1. Create task document with `assignedTo` user ID
2. Create notification for assigned user
3. Real-time subscription updates user's notification list
4. User sees notification in UI

### Recording Medical Visit

1. Upload documents to `medical-documents` bucket (if any)
2. Create medical record with document IDs
3. Add medical record ID to animal's `medicalHistory` array
4. If follow-up required, create notification for reminder
5. Update animal status if needed

### Completing a Task

1. Update task document: `completed = true`, `completedAt`, `completedBy`
2. If task has related animal, check for other pending tasks
3. Create notification for task creator/admin
4. Update dashboard statistics

## Query Patterns

### Get Animals by Type and Status

```typescript
Query.equal('type', 'dog');
Query.equal('status', 'needs_attention');
Query.orderDesc('$createdAt');
```

Uses index: `type_status`

### Get Volunteer's Upcoming Tasks

```typescript
Query.equal('assignedTo', userId);
Query.equal('completed', false);
Query.orderAsc('scheduledDate');
```

Uses index: `assignedTo_completed_scheduledDate`

### Get Animal Medical History

```typescript
Query.equal('animalId', animalId);
Query.orderDesc('date');
```

Uses index: `animalId_date`

### Get Unread Notifications

```typescript
Query.equal('recipientId', userId);
Query.equal('read', false);
Query.orderDesc('$createdAt');
```

Uses index: `recipientId_read_createdAt`

### Get Records Needing Follow-up

```typescript
Query.equal('followUpRequired', true);
Query.lessThanEqual('followUpDate', today);
```

Uses index: `followUpRequired_followUpDate`

## Performance Considerations

### Pagination

All list queries should use pagination:

```typescript
Query.limit(25);
Query.offset(0);
```

### Index Usage

- Always filter in the same order as compound indexes
- Use indexes for sorting when possible
- Avoid queries that don't use indexes

### Denormalization

Some data is denormalized for performance:

- `animals.medicalHistory`: Array of IDs for quick access
- `territories.packSize`: Cached count
- `territories.assignedVolunteers`: Array for quick lookup

### Real-time Subscriptions

- Subscribe only to necessary collections
- Filter events by user/entity
- Unsubscribe when component unmounts

## Data Integrity

### Validation

All data is validated using Zod schemas before database operations.

### Constraints

- Unique indexes ensure data uniqueness
- Required fields prevent incomplete data
- Enum fields restrict values to valid options

### Cascading Deletes

When deleting entities, related data should be handled:

- Deleting animal: Delete medical records, update tasks
- Deleting territory: Update animals' packId
- Deleting user: Reassign tasks, update territories

### Backup and Recovery

- Regular database backups via Appwrite
- Export functionality for critical data
- Audit logs for tracking changes

## Migration Guide

### Adding New Fields

1. Update TypeScript types in `src/types/`
2. Update Zod schemas in `src/lib/validations/`
3. Update database operations in `src/lib/db/`
4. Update UI components to display new fields
5. Create migration script if needed

### Adding New Indexes

1. Update `src/lib/setup/create-indexes.ts`
2. Run script to generate CLI commands
3. Create indexes in Appwrite Console or via CLI
4. Update query functions to use new indexes
5. Document in `docs/QUERY_OPTIMIZATION.md`

### Schema Changes

1. Plan backward compatibility
2. Update validation schemas
3. Update database operations
4. Test thoroughly
5. Deploy with migration script
6. Monitor for errors
