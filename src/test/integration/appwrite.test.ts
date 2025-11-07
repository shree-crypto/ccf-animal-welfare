import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ID, Permission, Role, Query } from 'appwrite';
import { databases, storage, account } from '@/lib/appwrite';
import { DATABASE_ID, COLLECTIONS, STORAGE_BUCKETS } from '@/lib/constants/database';
import type { AnimalProfile } from '@/types/animal';

// Test data
const testAnimalData = {
  name: 'Test Dog',
  type: 'dog' as const,
  age: 3,
  breed: 'Labrador',
  location: {
    area: 'Test Area',
    coordinates: [29.8543, 77.8880] as [number, number],
  },
  currentFeeder: 'Test Volunteer',
  medicalHistory: [],
  photos: {
    profile: '',
    gallery: [],
  },
  status: 'healthy' as const,
};

// Store IDs for cleanup
let testAnimalId: string;
let testFileId: string;

describe('Appwrite Database Integration Tests', () => {
  describe('Animal CRUD Operations', () => {
    it('should create an animal document', async () => {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        ID.unique(),
        testAnimalData,
        [
          Permission.read(Role.any()),
          Permission.update(Role.team('volunteers')),
          Permission.delete(Role.team('admins')),
        ]
      );

      testAnimalId = response.$id;

      expect(response).toBeDefined();
      expect(response.$id).toBeDefined();
      expect(response.name).toBe(testAnimalData.name);
      expect(response.type).toBe(testAnimalData.type);
      expect(response.age).toBe(testAnimalData.age);
    });

    it('should read an animal document', async () => {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        testAnimalId
      );

      expect(response).toBeDefined();
      expect(response.$id).toBe(testAnimalId);
      expect(response.name).toBe(testAnimalData.name);
    });

    it('should update an animal document', async () => {
      const updatedData = {
        age: 4,
        status: 'needs_attention' as const,
      };

      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        testAnimalId,
        updatedData
      );

      expect(response).toBeDefined();
      expect(response.age).toBe(updatedData.age);
      expect(response.status).toBe(updatedData.status);
    });

    it('should list animal documents', async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ANIMALS
      );

      expect(response).toBeDefined();
      expect(response.documents).toBeDefined();
      expect(Array.isArray(response.documents)).toBe(true);
      expect(response.documents.length).toBeGreaterThan(0);
    });

    it('should delete an animal document', async () => {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        testAnimalId
      );

      // Verify deletion by attempting to fetch
      await expect(
        databases.getDocument(DATABASE_ID, COLLECTIONS.ANIMALS, testAnimalId)
      ).rejects.toThrow();
    });
  });
});

describe('Appwrite Task CRUD Operations', () => {
  let testTaskId: string;

  const testTaskData = {
    type: 'feeding',
    title: 'Test Feeding Task',
    description: 'Feed dogs in Test Area',
    assignedTo: 'test-user-id',
    scheduledDate: new Date().toISOString(),
    completed: false,
    priority: 'medium',
  };

  it('should create a task document', async () => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      ID.unique(),
      testTaskData,
      [
        Permission.read(Role.team('volunteers')),
        Permission.update(Role.team('volunteers')),
        Permission.delete(Role.team('admins')),
      ]
    );

    testTaskId = response.$id;

    expect(response).toBeDefined();
    expect(response.$id).toBeDefined();
    expect(response.title).toBe(testTaskData.title);
    expect(response.type).toBe(testTaskData.type);
  });

  it('should update task completion status', async () => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      testTaskId,
      {
        completed: true,
        completedAt: new Date().toISOString(),
      }
    );

    expect(response).toBeDefined();
    expect(response.completed).toBe(true);
    expect(response.completedAt).toBeDefined();
  });

  it('should delete a task document', async () => {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      testTaskId
    );

    await expect(
      databases.getDocument(DATABASE_ID, COLLECTIONS.TASKS, testTaskId)
    ).rejects.toThrow();
  });
});

describe('Appwrite Medical Record CRUD Operations', () => {
  let testMedicalRecordId: string;

  const testMedicalData = {
    animalId: 'test-animal-id',
    date: new Date().toISOString(),
    type: 'checkup',
    description: 'Routine health checkup',
    veterinarian: 'Dr. Test',
    medications: ['Vitamin supplements'],
    documents: [],
    followUpRequired: false,
  };

  it('should create a medical record document', async () => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS,
      ID.unique(),
      testMedicalData,
      [
        Permission.read(Role.team('volunteers')),
        Permission.update(Role.team('volunteers')),
        Permission.delete(Role.team('admins')),
      ]
    );

    testMedicalRecordId = response.$id;

    expect(response).toBeDefined();
    expect(response.$id).toBeDefined();
    expect(response.type).toBe(testMedicalData.type);
    expect(response.description).toBe(testMedicalData.description);
  });

  it('should update medical record with follow-up', async () => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS,
      testMedicalRecordId,
      {
        followUpRequired: true,
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    );

    expect(response).toBeDefined();
    expect(response.followUpRequired).toBe(true);
    expect(response.followUpDate).toBeDefined();
  });

  it('should delete a medical record document', async () => {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS,
      testMedicalRecordId
    );

    await expect(
      databases.getDocument(DATABASE_ID, COLLECTIONS.MEDICAL_RECORDS, testMedicalRecordId)
    ).rejects.toThrow();
  });
});

describe('Appwrite Storage Integration Tests', () => {
  describe('File Upload Operations', () => {
    it('should upload a file to animal photos bucket', async () => {
      // Create a test file blob
      const testContent = 'test image content';
      const blob = new Blob([testContent], { type: 'image/jpeg' });
      const file = new File([blob], 'test-animal.jpg', { type: 'image/jpeg' });

      const response = await storage.createFile(
        STORAGE_BUCKETS.ANIMAL_PHOTOS,
        ID.unique(),
        file
      );

      testFileId = response.$id;

      expect(response).toBeDefined();
      expect(response.$id).toBeDefined();
      expect(response.name).toBe('test-animal.jpg');
      expect(response.mimeType).toBe('image/jpeg');
    });

    it('should retrieve file metadata', async () => {
      const response = await storage.getFile(
        STORAGE_BUCKETS.ANIMAL_PHOTOS,
        testFileId
      );

      expect(response).toBeDefined();
      expect(response.$id).toBe(testFileId);
      expect(response.name).toBe('test-animal.jpg');
    });

    it('should list files in bucket', async () => {
      const response = await storage.listFiles(STORAGE_BUCKETS.ANIMAL_PHOTOS);

      expect(response).toBeDefined();
      expect(response.files).toBeDefined();
      expect(Array.isArray(response.files)).toBe(true);
      expect(response.files.length).toBeGreaterThan(0);
    });

    it('should delete a file from storage', async () => {
      await storage.deleteFile(STORAGE_BUCKETS.ANIMAL_PHOTOS, testFileId);

      // Verify deletion
      await expect(
        storage.getFile(STORAGE_BUCKETS.ANIMAL_PHOTOS, testFileId)
      ).rejects.toThrow();
    });
  });

  describe('Medical Document Upload Operations', () => {
    let medicalDocId: string;

    it('should upload a PDF document to medical documents bucket', async () => {
      const testContent = 'test medical document content';
      const blob = new Blob([testContent], { type: 'application/pdf' });
      const file = new File([blob], 'test-medical-report.pdf', {
        type: 'application/pdf',
      });

      const response = await storage.createFile(
        STORAGE_BUCKETS.MEDICAL_DOCUMENTS,
        ID.unique(),
        file
      );

      medicalDocId = response.$id;

      expect(response).toBeDefined();
      expect(response.$id).toBeDefined();
      expect(response.name).toBe('test-medical-report.pdf');
      expect(response.mimeType).toBe('application/pdf');
    });

    it('should delete medical document', async () => {
      await storage.deleteFile(STORAGE_BUCKETS.MEDICAL_DOCUMENTS, medicalDocId);

      await expect(
        storage.getFile(STORAGE_BUCKETS.MEDICAL_DOCUMENTS, medicalDocId)
      ).rejects.toThrow();
    });
  });
});

describe('Appwrite Permission Tests', () => {
  let testDocId: string;

  it('should create document with public read permission', async () => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      ID.unique(),
      {
        name: 'Public Test Dog',
        type: 'dog',
        age: 2,
        location: { area: 'Test', coordinates: [0, 0] },
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy',
      },
      [Permission.read(Role.any())]
    );

    testDocId = response.$id;

    expect(response).toBeDefined();
    expect(response.$permissions).toBeDefined();
    expect(response.$permissions.length).toBeGreaterThan(0);
  });

  it('should create document with team-based permissions', async () => {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TASKS,
      ID.unique(),
      {
        type: 'feeding',
        title: 'Permission Test Task',
        description: 'Test task for permissions',
        assignedTo: 'test-user',
        scheduledDate: new Date().toISOString(),
        completed: false,
        priority: 'low',
      },
      [
        Permission.read(Role.team('volunteers')),
        Permission.update(Role.team('volunteers')),
        Permission.delete(Role.team('admins')),
      ]
    );

    expect(response).toBeDefined();
    expect(response.$permissions).toBeDefined();
    expect(response.$permissions.length).toBeGreaterThan(0);

    // Cleanup
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TASKS, response.$id);
  });

  it('should update document permissions', async () => {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      testDocId,
      {},
      [
        Permission.read(Role.any()),
        Permission.update(Role.team('volunteers')),
        Permission.delete(Role.team('admins')),
      ]
    );

    expect(response).toBeDefined();
    expect(response.$permissions).toBeDefined();
    expect(response.$permissions.length).toBeGreaterThan(0);

    // Cleanup
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, testDocId);
  });
});

describe('Appwrite Query and Filter Tests', () => {
  let testAnimalIds: string[] = [];

  beforeAll(async () => {
    // Create multiple test animals for querying
    const animals = [
      { name: 'Query Dog 1', type: 'dog', age: 2, status: 'healthy' },
      { name: 'Query Dog 2', type: 'dog', age: 5, status: 'needs_attention' },
      { name: 'Query Cat 1', type: 'cat', age: 3, status: 'healthy' },
    ];

    for (const animal of animals) {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        ID.unique(),
        {
          ...animal,
          location: { area: 'Query Test Area', coordinates: [0, 0] },
          medicalHistory: [],
          photos: { profile: '', gallery: [] },
        },
        [Permission.read(Role.any())]
      );
      testAnimalIds.push(response.$id);
    }
  });

  afterAll(async () => {
    // Cleanup test animals
    for (const id of testAnimalIds) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, id);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });

  it('should query documents with pagination', async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      [Query.limit(2)]
    );

    expect(response).toBeDefined();
    expect(response.documents).toBeDefined();
    expect(response.documents.length).toBeLessThanOrEqual(2);
    expect(response.total).toBeGreaterThan(0);
  });

  it('should handle empty query results', async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      [Query.equal('name', 'NonExistentAnimal')]
    );

    expect(response).toBeDefined();
    expect(response.documents).toBeDefined();
    expect(response.documents.length).toBe(0);
  });
});
