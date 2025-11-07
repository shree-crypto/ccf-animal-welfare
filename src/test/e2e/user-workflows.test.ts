import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ID, Permission, Role } from 'appwrite';
import { databases, storage } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS, STORAGE_BUCKETS } from '@/lib/constants/database';
import type { AnimalProfile } from '@/types/animal';
import type { Task } from '@/types/task';
import type { MedicalRecord } from '@/types/medical';

/**
 * End-to-End User Workflow Tests
 * 
 * Tests complete user journeys from animal browsing to task management
 * Requirements: 1.1-1.5 (Animal Browsing), 3.1-3.5 (Task Management), 6.1-6.5 (Admin Management)
 */

// Test data storage
const testData = {
  animalIds: [] as string[],
  taskIds: [] as string[],
  medicalRecordIds: [] as string[],
  fileIds: [] as string[],
};

describe('E2E: Public User Animal Browsing Journey', () => {
  /**
   * Requirement 1.1: Display all Animal_Profiles in a responsive card grid layout
   * Requirement 1.2: Navigate to detailed profile page
   * Requirement 1.3: Display animal information on cards
   * Requirement 1.4: Support filtering by animal type
   * Requirement 1.5: Load additional photos in detailed view
   */

  beforeAll(async () => {
    // Create test animals for browsing
    const testAnimals = [
      {
        name: 'E2E Test Dog Alpha',
        type: 'dog' as const,
        age: 3,
        breed: 'Golden Retriever',
        location: { area: 'Main Campus', coordinates: [29.8543, 77.8880] as [number, number] },
        currentFeeder: 'Test Volunteer',
        medicalHistory: [],
        photos: { profile: 'profile1.jpg', gallery: ['gallery1.jpg', 'gallery2.jpg'] },
        status: 'healthy' as const,
      },
      {
        name: 'E2E Test Cat Beta',
        type: 'cat' as const,
        age: 2,
        breed: 'Persian',
        location: { area: 'Library Area', coordinates: [29.8550, 77.8890] as [number, number] },
        currentFeeder: 'Test Volunteer',
        medicalHistory: [],
        photos: { profile: 'profile2.jpg', gallery: ['gallery3.jpg'] },
        status: 'healthy' as const,
      },
      {
        name: 'E2E Test Dog Gamma',
        type: 'dog' as const,
        age: 5,
        breed: 'Labrador',
        location: { area: 'Sports Complex', coordinates: [29.8560, 77.8900] as [number, number] },
        currentFeeder: 'Test Volunteer',
        medicalHistory: [],
        photos: { profile: 'profile3.jpg', gallery: [] },
        status: 'needs_attention' as const,
      },
    ];

    for (const animal of testAnimals) {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        ID.unique(),
        animal,
        [Permission.read(Role.any())]
      );
      testData.animalIds.push(response.$id);
    }
  });

  afterAll(async () => {
    // Cleanup test animals
    for (const id of testData.animalIds) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  it('should list all animals in card grid format (Req 1.1)', async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    expect(response).toBeDefined();
    expect(response.documents).toBeDefined();
    expect(response.documents.length).toBeGreaterThanOrEqual(3);
    
    // Verify card data structure
    const animal = response.documents[0] as unknown as AnimalProfile;
    expect(animal.name).toBeDefined();
    expect(animal.type).toBeDefined();
    expect(animal.photos).toBeDefined();
  });

  it('should retrieve detailed animal profile (Req 1.2)', async () => {
    const animalId = testData.animalIds[0];
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      animalId
    );

    expect(response).toBeDefined();
    expect(response.$id).toBe(animalId);
    expect(response.name).toBe('E2E Test Dog Alpha');
    expect(response.breed).toBe('Golden Retriever');
  });

  it('should display animal card information (Req 1.3)', async () => {
    const animalId = testData.animalIds[0];
    const animal = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      animalId
    ) as unknown as AnimalProfile;

    // Verify all required card fields
    expect(animal.name).toBe('E2E Test Dog Alpha');
    expect(animal.age).toBe(3);
    expect(animal.location.area).toBe('Main Campus');
    expect(animal.currentFeeder).toBe('Test Volunteer');
    expect(animal.photos.profile).toBe('profile1.jpg');
  });

  it('should filter animals by type - dogs only (Req 1.4)', async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const dogs = response.documents.filter((doc: any) => doc.type === 'dog');
    expect(dogs.length).toBeGreaterThanOrEqual(2);
    
    dogs.forEach((dog: any) => {
      expect(dog.type).toBe('dog');
    });
  });

  it('should filter animals by type - cats only (Req 1.4)', async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const cats = response.documents.filter((doc: any) => doc.type === 'cat');
    expect(cats.length).toBeGreaterThanOrEqual(1);
    
    cats.forEach((cat: any) => {
      expect(cat.type).toBe('cat');
    });
  });

  it('should load additional photos in gallery (Req 1.5)', async () => {
    const animalId = testData.animalIds[0];
    const animal = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      animalId
    ) as unknown as AnimalProfile;

    expect(animal.photos.gallery).toBeDefined();
    expect(Array.isArray(animal.photos.gallery)).toBe(true);
    expect(animal.photos.gallery.length).toBe(2);
    expect(animal.photos.gallery).toContain('gallery1.jpg');
    expect(animal.photos.gallery).toContain('gallery2.jpg');
  });
});

describe('E2E: Volunteer Task Management Journey', () => {
  /**
   * Requirement 3.1: Display Volunteer_Dashboard after authentication
   * Requirement 3.2: Create and modify Feeding_Schedule entries
   * Requirement 3.3: Display tasks in shared calendar interface
   * Requirement 3.4: Track task completion status
   * Requirement 3.5: Track volunteer assignments
   */

  let testAnimalId: string;

  beforeAll(async () => {
    // Create a test animal for task association
    const animal = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      ID.unique(),
      {
        name: 'Task Test Dog',
        type: 'dog',
        age: 4,
        location: { area: 'Test Area', coordinates: [29.8543, 77.8880] },
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy',
      },
      [Permission.read(Role.any())]
    );
    testAnimalId = animal.$id;
  });

  afterAll(async () => {
    // Cleanup
    for (const id of testData.taskIds) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TASKS, id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, testAnimalId);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should create a feeding schedule task (Req 3.2)', async () => {
    const taskData = {
      type: 'feeding',
      title: 'Morning Feeding - Main Campus',
      description: 'Feed dogs in main campus area',
      assignedTo: 'volunteer-user-id',
      animalId: testAnimalId,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      priority: 'high',
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      ID.unique(),
      taskData,
      [
        Permission.read(Role.team('volunteers')),
        Permission.update(Role.team('volunteers')),
      ]
    );

    testData.taskIds.push(response.$id);

    expect(response).toBeDefined();
    expect(response.$id).toBeDefined();
    expect(response.type).toBe('feeding');
    expect(response.title).toBe('Morning Feeding - Main Campus');
    expect(response.assignedTo).toBe('volunteer-user-id');
  });

  it('should modify existing feeding schedule (Req 3.2)', async () => {
    const taskId = testData.taskIds[0];
    const updatedData = {
      title: 'Evening Feeding - Main Campus',
      scheduledDate: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
    };

    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      taskId,
      updatedData
    );

    expect(response).toBeDefined();
    expect(response.title).toBe('Evening Feeding - Main Campus');
    expect(response.priority).toBe('medium');
  });

  it('should list all volunteer tasks for calendar view (Req 3.3)', async () => {
    // Create additional tasks for calendar
    const tasks = [
      {
        type: 'medical',
        title: 'Vaccination Schedule',
        description: 'Annual vaccination for campus dogs',
        assignedTo: 'volunteer-user-id',
        scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        completed: false,
        priority: 'high',
      },
      {
        type: 'maintenance',
        title: 'Clean Feeding Area',
        description: 'Clean and sanitize feeding stations',
        assignedTo: 'volunteer-user-id',
        scheduledDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        completed: false,
        priority: 'low',
      },
    ];

    for (const task of tasks) {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TASKS,
        ID.unique(),
        task,
        [Permission.read(Role.team('volunteers'))]
      );
      testData.taskIds.push(response.$id);
    }

    const allTasks = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TASKS
    );

    expect(allTasks).toBeDefined();
    expect(allTasks.documents.length).toBeGreaterThanOrEqual(3);
    
    // Verify calendar data structure
    allTasks.documents.forEach((task: any) => {
      expect(task.scheduledDate).toBeDefined();
      expect(task.title).toBeDefined();
      expect(task.type).toBeDefined();
    });
  });

  it('should track task completion status (Req 3.4)', async () => {
    const taskId = testData.taskIds[0];
    
    // Mark task as completed
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      taskId,
      {
        completed: true,
        completedAt: new Date().toISOString(),
      }
    );

    expect(response).toBeDefined();
    expect(response.completed).toBe(true);
    expect(response.completedAt).toBeDefined();
  });

  it('should track volunteer assignments (Req 3.5)', async () => {
    const taskId = testData.taskIds[1];
    
    // Reassign task to different volunteer
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      taskId,
      {
        assignedTo: 'different-volunteer-id',
      }
    );

    expect(response).toBeDefined();
    expect(response.assignedTo).toBe('different-volunteer-id');
  });

  it('should filter tasks by assignment (Req 3.5)', async () => {
    const allTasks = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TASKS
    );

    const volunteerTasks = allTasks.documents.filter(
      (task: any) => task.assignedTo === 'volunteer-user-id'
    );

    expect(volunteerTasks.length).toBeGreaterThan(0);
    volunteerTasks.forEach((task: any) => {
      expect(task.assignedTo).toBe('volunteer-user-id');
    });
  });
});

describe('E2E: Admin Animal Database Management Journey', () => {
  /**
   * Requirement 6.1: Create new Animal_Profiles
   * Requirement 6.2: Edit existing Animal_Profile information including photos
   * Requirement 6.3: Bulk upload and editing of animal data
   * Requirement 6.4: Validate animal data entries
   * Requirement 6.5: Search and filter capabilities
   */

  afterAll(async () => {
    // Cleanup
    for (const id of testData.animalIds) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    for (const id of testData.fileIds) {
      try {
        await storage.deleteFile(STORAGE_BUCKETS.ANIMAL_PHOTOS, id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  it('should create new animal profile (Req 6.1)', async () => {
    const newAnimal = {
      name: 'Admin Created Dog',
      type: 'dog' as const,
      age: 2,
      breed: 'German Shepherd',
      location: {
        area: 'Admin Test Area',
        coordinates: [29.8543, 77.8880] as [number, number],
      },
      currentFeeder: 'Admin User',
      medicalHistory: [],
      photos: {
        profile: '',
        gallery: [],
      },
      status: 'healthy' as const,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      ID.unique(),
      newAnimal,
      [
        Permission.read(Role.any()),
        Permission.update(Role.team('admins')),
        Permission.delete(Role.team('admins')),
      ]
    );

    testData.animalIds.push(response.$id);

    expect(response).toBeDefined();
    expect(response.$id).toBeDefined();
    expect(response.name).toBe('Admin Created Dog');
    expect(response.type).toBe('dog');
    expect(response.breed).toBe('German Shepherd');
  });

  it('should edit existing animal profile information (Req 6.2)', async () => {
    const animalId = testData.animalIds[0];
    const updates = {
      age: 3,
      breed: 'German Shepherd Mix',
      status: 'needs_attention' as const,
      currentFeeder: 'Updated Volunteer',
    };

    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      animalId,
      updates
    );

    expect(response).toBeDefined();
    expect(response.age).toBe(3);
    expect(response.breed).toBe('German Shepherd Mix');
    expect(response.status).toBe('needs_attention');
    expect(response.currentFeeder).toBe('Updated Volunteer');
  });

  it('should upload and associate photos with animal profile (Req 6.2)', async () => {
    // Upload profile photo
    const profileBlob = new Blob(['profile photo content'], { type: 'image/jpeg' });
    const profileFile = new File([profileBlob], 'admin-dog-profile.jpg', {
      type: 'image/jpeg',
    });

    const uploadResponse = await storage.createFile(
      STORAGE_BUCKETS.ANIMAL_PHOTOS,
      ID.unique(),
      profileFile
    );

    testData.fileIds.push(uploadResponse.$id);

    // Update animal with photo URL
    const animalId = testData.animalIds[0];
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      animalId,
      {
        photos: {
          profile: uploadResponse.$id,
          gallery: [],
        },
      }
    );

    expect(response).toBeDefined();
    expect(response.photos.profile).toBe(uploadResponse.$id);
  });

  it('should bulk create multiple animal profiles (Req 6.3)', async () => {
    const bulkAnimals = [
      {
        name: 'Bulk Dog 1',
        type: 'dog' as const,
        age: 1,
        location: { area: 'Bulk Area 1', coordinates: [29.8543, 77.8880] as [number, number] },
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy' as const,
      },
      {
        name: 'Bulk Dog 2',
        type: 'dog' as const,
        age: 2,
        location: { area: 'Bulk Area 2', coordinates: [29.8550, 77.8890] as [number, number] },
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy' as const,
      },
      {
        name: 'Bulk Cat 1',
        type: 'cat' as const,
        age: 1,
        location: { area: 'Bulk Area 3', coordinates: [29.8560, 77.8900] as [number, number] },
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy' as const,
      },
    ];

    const createdIds: string[] = [];

    for (const animal of bulkAnimals) {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        ID.unique(),
        animal,
        [Permission.read(Role.any())]
      );
      createdIds.push(response.$id);
      testData.animalIds.push(response.$id);
    }

    expect(createdIds.length).toBe(3);
    
    // Verify all were created
    for (const id of createdIds) {
      const animal = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        id
      );
      expect(animal).toBeDefined();
      expect(animal.$id).toBe(id);
    }
  });

  it('should validate animal data completeness (Req 6.4)', async () => {
    const animalId = testData.animalIds[0];
    const animal = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      animalId
    ) as unknown as AnimalProfile;

    // Validate required fields
    expect(animal.name).toBeDefined();
    expect(animal.name.length).toBeGreaterThan(0);
    expect(animal.type).toBeDefined();
    expect(['dog', 'cat'].includes(animal.type)).toBe(true);
    expect(animal.age).toBeDefined();
    expect(animal.age).toBeGreaterThan(0);
    expect(animal.location).toBeDefined();
    expect(animal.location.area).toBeDefined();
    expect(animal.location.coordinates).toBeDefined();
    expect(animal.location.coordinates.length).toBe(2);
    expect(animal.status).toBeDefined();
    expect(['healthy', 'needs_attention', 'under_treatment'].includes(animal.status)).toBe(true);
  });

  it('should search animals by name (Req 6.5)', async () => {
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const searchResults = allAnimals.documents.filter((animal: any) =>
      animal.name.toLowerCase().includes('bulk dog')
    );

    expect(searchResults.length).toBeGreaterThanOrEqual(2);
    searchResults.forEach((animal: any) => {
      expect(animal.name.toLowerCase()).toContain('bulk dog');
    });
  });

  it('should filter animals by status (Req 6.5)', async () => {
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const healthyAnimals = allAnimals.documents.filter(
      (animal: any) => animal.status === 'healthy'
    );

    expect(healthyAnimals.length).toBeGreaterThan(0);
    healthyAnimals.forEach((animal: any) => {
      expect(animal.status).toBe('healthy');
    });
  });

  it('should filter animals by location area (Req 6.5)', async () => {
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const bulkAreaAnimals = allAnimals.documents.filter((animal: any) =>
      animal.location.area.includes('Bulk Area')
    );

    expect(bulkAreaAnimals.length).toBeGreaterThanOrEqual(3);
    bulkAreaAnimals.forEach((animal: any) => {
      expect(animal.location.area).toContain('Bulk Area');
    });
  });
});
