# Database Module

This module provides CRUD operations for all core data models in the CCF Animal Welfare system.

## Overview

The database module is built on top of Appwrite's database service and provides type-safe, validated operations for:

- **Animals**: Animal profiles with location, medical history, and photos
- **Territories**: Geographic areas with pack information and assigned volunteers
- **Tasks**: Volunteer tasks for feeding, medical care, and maintenance
- **Medical Records**: Health records, treatments, and veterinary visits

## Usage

### Animals

```typescript
import {
  createAnimal,
  getAnimalById,
  getAnimals,
  updateAnimal,
  deleteAnimal,
  searchAnimalsByName,
} from '@/lib/db/animals';

// Create a new animal
const animal = await createAnimal({
  name: 'Max',
  type: 'dog',
  age: 3,
  breed: 'Golden Retriever',
  location: {
    area: 'Main Campus',
    coordinates: [29.8543, 77.888],
  },
  medicalHistory: [],
  photos: {
    profile: 'https://example.com/max-profile.jpg',
    gallery: ['https://example.com/max-1.jpg'],
  },
  status: 'healthy',
});

// Get all dogs
const dogs = await getAnimals({ type: 'dog' });

// Search by name
const results = await searchAnimalsByName('Max');

// Update animal
await updateAnimal(animal.id, { status: 'needs_attention' });

// Delete animal
await deleteAnimal(animal.id);
```

### Territories

```typescript
import {
  createTerritory,
  getTerritoryById,
  getTerritories,
  updateTerritory,
  deleteTerritory,
  getTerritoriesByVolunteer,
} from '@/lib/db/territories';

// Create a territory
const territory = await createTerritory({
  name: 'North Campus',
  boundaries: [
    [29.8543, 77.888],
    [29.8553, 77.889],
    [29.8563, 77.887],
  ],
  packSize: 5,
  animals: ['animal-id-1', 'animal-id-2'],
  assignedVolunteers: ['volunteer-id-1'],
});

// Get territories for a volunteer
const myTerritories = await getTerritoriesByVolunteer('volunteer-id-1');
```

### Tasks

```typescript
import {
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask,
  completeTask,
  getUpcomingTasks,
} from '@/lib/db/tasks';

// Create a task
const task = await createTask({
  type: 'feeding',
  title: 'Morning feeding - North Campus',
  description: 'Feed all dogs in the north campus area',
  assignedTo: 'volunteer-id-1',
  territoryId: 'territory-id-1',
  scheduledDate: new Date().toISOString(),
  completed: false,
  priority: 'high',
});

// Get upcoming tasks for a volunteer
const upcomingTasks = await getUpcomingTasks('volunteer-id-1', 7);

// Mark task as completed
await completeTask(task.id);

// Get all incomplete tasks
const incompleteTasks = await getTasks({ completed: false });
```

### Medical Records

```typescript
import {
  createMedicalRecord,
  getMedicalRecordById,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getAnimalMedicalHistory,
  getFollowUpRecords,
} from '@/lib/db/medical';

// Create a medical record
const record = await createMedicalRecord({
  animalId: 'animal-id-1',
  date: new Date().toISOString(),
  type: 'vaccination',
  description: 'Annual rabies vaccination',
  veterinarian: 'Dr. Smith',
  medications: ['Rabies vaccine'],
  documents: ['https://example.com/vaccination-cert.pdf'],
  followUpRequired: true,
  followUpDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
});

// Get medical history for an animal
const history = await getAnimalMedicalHistory('animal-id-1');

// Get all records requiring follow-up
const followUps = await getFollowUpRecords();
```

## Storage

The storage module provides utilities for uploading and managing files:

```typescript
import {
  uploadAnimalPhoto,
  uploadMedicalDocument,
  deleteAnimalPhoto,
  deleteMedicalDocument,
  getFileUrl,
  getFilePreviewUrl,
  isValidImageFile,
  isValidDocumentFile,
  isValidFileSize,
} from '@/lib/storage';

// Upload an animal photo
const photo = await uploadAnimalPhoto(file, progress => {
  console.log(`Upload progress: ${progress.$id}`);
});

// Upload a medical document
const document = await uploadMedicalDocument(file);

// Get file URL
const url = getFileUrl('animal-photos', photo.id);

// Get preview URL with dimensions
const previewUrl = getFilePreviewUrl('animal-photos', photo.id, 400, 300, 80);

// Validate file before upload
if (isValidImageFile(file) && isValidFileSize(file, 10)) {
  await uploadAnimalPhoto(file);
}
```

## Data Validation

All create and update operations are validated using Zod schemas. Validation errors will throw with detailed error messages:

```typescript
import { createAnimal } from '@/lib/db/animals';

try {
  await createAnimal({
    name: '', // Invalid: name is required
    type: 'bird', // Invalid: must be 'dog' or 'cat'
    age: -1, // Invalid: age must be positive
    // ... other fields
  });
} catch (error) {
  // Handle validation error
  console.error(error);
}
```

## Error Handling

All database operations may throw errors. Always wrap them in try-catch blocks:

```typescript
try {
  const animal = await getAnimalById('invalid-id');
} catch (error) {
  console.error('Failed to fetch animal:', error);
  // Handle error appropriately
}
```

## Type Safety

All functions are fully typed with TypeScript. Use the exported types for type safety:

```typescript
import type { AnimalProfile, AnimalStatus } from '@/types/animal';
import type { Task, TaskType, TaskPriority } from '@/types/task';
import type { Territory } from '@/types/territory';
import type { MedicalRecord, MedicalRecordType } from '@/types/medical';
```

## Setup

Before using the database module, ensure you have:

1. Set up Appwrite database and collections (see `src/lib/setup/appwrite-setup.md`)
2. Configured environment variables in `.env.local`
3. Created the necessary teams in Appwrite (volunteers, admins)

## Best Practices

1. **Always validate data**: Use the provided Zod schemas for validation
2. **Handle errors**: Wrap database calls in try-catch blocks
3. **Use filters**: Leverage the filter options to reduce data transfer
4. **Pagination**: Use limit and offset for large datasets
5. **Type safety**: Use TypeScript types for compile-time safety
6. **File validation**: Always validate files before uploading
7. **Clean up**: Delete old files when updating or removing records
