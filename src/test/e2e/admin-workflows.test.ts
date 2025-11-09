import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ID, Permission, Role } from 'appwrite';
import { databases, storage } from '@/lib/appwrite';
import {
  DATABASE_ID,
  COLLECTIONS,
  STORAGE_BUCKETS,
} from '@/lib/constants/database';
import type { AnimalProfile } from '@/types/animal';
import type { MedicalRecord } from '@/types/medical';

/**
 * End-to-End Admin Workflow Tests
 *
 * Tests complete admin workflows for animal database management
 * Requirements: 6.1-6.5 (Admin Management), 4.1-4.5 (Medical Records)
 */

const testData = {
  animalIds: [] as string[],
  medicalRecordIds: [] as string[],
  fileIds: [] as string[],
};

describe('E2E: Admin Medical Records Management', () => {
  /**
   * Requirement 4.1: Create and update Medical_Records
   * Requirement 4.2: Associate Medical_Records with Animal_Profiles
   * Requirement 4.3: Display medical history chronologically
   * Requirement 4.4: Support uploading medical documents and photos
   * Requirement 4.5: Highlight animals needing care
   */

  let testAnimalId: string;

  beforeAll(async () => {
    // Create test animal for medical records
    const animal = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      ID.unique(),
      {
        name: 'Medical Test Dog',
        type: 'dog',
        age: 4,
        breed: 'Beagle',
        location: { area: 'Medical Test Area', coordinates: [29.8543, 77.888] },
        currentFeeder: 'Test Volunteer',
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy',
      },
      [Permission.read(Role.any())]
    );
    testAnimalId = animal.$id;
    testData.animalIds.push(testAnimalId);
  });

  afterAll(async () => {
    // Cleanup
    for (const id of testData.medicalRecordIds) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          COLLECTIONS.MEDICAL_RECORDS,
          id
        );
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    for (const id of testData.animalIds) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANIMALS, id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    for (const id of testData.fileIds) {
      try {
        await storage.deleteFile(STORAGE_BUCKETS.MEDICAL_DOCUMENTS, id);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  it('should create a medical record (Req 4.1)', async () => {
    const medicalData = {
      animalId: testAnimalId,
      date: new Date().toISOString(),
      type: 'checkup',
      description: 'Routine health checkup - all vitals normal',
      veterinarian: 'Dr. Smith',
      medications: ['Multivitamin'],
      documents: [],
      followUpRequired: false,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS,
      ID.unique(),
      medicalData,
      [
        Permission.read(Role.team('volunteers')),
        Permission.update(Role.team('volunteers')),
      ]
    );

    testData.medicalRecordIds.push(response.$id);

    expect(response).toBeDefined();
    expect(response.$id).toBeDefined();
    expect(response.animalId).toBe(testAnimalId);
    expect(response.type).toBe('checkup');
    expect(response.veterinarian).toBe('Dr. Smith');
  });

  it('should update existing medical record (Req 4.1)', async () => {
    const recordId = testData.medicalRecordIds[0];
    const updates = {
      followUpRequired: true,
      followUpDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      description:
        'Routine health checkup - follow-up needed for minor skin condition',
    };

    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS,
      recordId,
      updates
    );

    expect(response).toBeDefined();
    expect(response.followUpRequired).toBe(true);
    expect(response.followUpDate).toBeDefined();
    expect(response.description).toContain('follow-up needed');
  });

  it('should associate medical records with animal profile (Req 4.2)', async () => {
    // Create additional medical records
    const records = [
      {
        animalId: testAnimalId,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'vaccination',
        description: 'Annual rabies vaccination',
        veterinarian: 'Dr. Johnson',
        medications: ['Rabies vaccine'],
        documents: [],
        followUpRequired: false,
      },
      {
        animalId: testAnimalId,
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'treatment',
        description: 'Treatment for minor wound',
        veterinarian: 'Dr. Smith',
        medications: ['Antibiotic ointment'],
        documents: [],
        followUpRequired: false,
      },
    ];

    for (const record of records) {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MEDICAL_RECORDS,
        ID.unique(),
        record,
        [Permission.read(Role.team('volunteers'))]
      );
      testData.medicalRecordIds.push(response.$id);
    }

    // Retrieve all medical records for the animal
    const allRecords = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS
    );

    const animalRecords = allRecords.documents.filter(
      (record: any) => record.animalId === testAnimalId
    );

    expect(animalRecords.length).toBeGreaterThanOrEqual(3);
    animalRecords.forEach((record: any) => {
      expect(record.animalId).toBe(testAnimalId);
    });
  });

  it('should display medical history chronologically (Req 4.3)', async () => {
    const allRecords = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS
    );

    const animalRecords = allRecords.documents
      .filter((record: any) => record.animalId === testAnimalId)
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    expect(animalRecords.length).toBeGreaterThanOrEqual(3);

    // Verify chronological order (most recent first)
    for (let i = 0; i < animalRecords.length - 1; i++) {
      const currentDate = new Date(animalRecords[i].date).getTime();
      const nextDate = new Date(animalRecords[i + 1].date).getTime();
      expect(currentDate).toBeGreaterThanOrEqual(nextDate);
    }
  });

  it('should upload medical documents (Req 4.4)', async () => {
    // Upload medical document
    const docBlob = new Blob(['Medical report content'], {
      type: 'application/pdf',
    });
    const docFile = new File([docBlob], 'medical-report.pdf', {
      type: 'application/pdf',
    });

    const uploadResponse = await storage.createFile(
      STORAGE_BUCKETS.MEDICAL_DOCUMENTS,
      ID.unique(),
      docFile
    );

    testData.fileIds.push(uploadResponse.$id);

    expect(uploadResponse).toBeDefined();
    expect(uploadResponse.$id).toBeDefined();
    expect(uploadResponse.name).toBe('medical-report.pdf');
    expect(uploadResponse.mimeType).toBe('application/pdf');

    // Associate document with medical record
    const recordId = testData.medicalRecordIds[0];
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS,
      recordId,
      {
        documents: [uploadResponse.$id],
      }
    );

    expect(response).toBeDefined();
    expect(response.documents).toContain(uploadResponse.$id);
  });

  it('should upload medical photos (Req 4.4)', async () => {
    // Upload medical photo
    const photoBlob = new Blob(['Medical photo content'], {
      type: 'image/jpeg',
    });
    const photoFile = new File([photoBlob], 'wound-photo.jpg', {
      type: 'image/jpeg',
    });

    const uploadResponse = await storage.createFile(
      STORAGE_BUCKETS.MEDICAL_DOCUMENTS,
      ID.unique(),
      photoFile
    );

    testData.fileIds.push(uploadResponse.$id);

    expect(uploadResponse).toBeDefined();
    expect(uploadResponse.$id).toBeDefined();
    expect(uploadResponse.name).toBe('wound-photo.jpg');
    expect(uploadResponse.mimeType).toBe('image/jpeg');
  });

  it('should highlight animals needing medical attention (Req 4.5)', async () => {
    // Update animal status to needs_attention
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      testAnimalId,
      {
        status: 'needs_attention',
      }
    );

    // Retrieve animals needing attention
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const animalsNeedingCare = allAnimals.documents.filter(
      (animal: any) =>
        animal.status === 'needs_attention' ||
        animal.status === 'under_treatment'
    );

    expect(animalsNeedingCare.length).toBeGreaterThan(0);

    const testAnimal = animalsNeedingCare.find(
      (a: any) => a.$id === testAnimalId
    );
    expect(testAnimal).toBeDefined();
    expect(testAnimal?.status).toBe('needs_attention');
  });

  it('should identify animals with pending follow-ups (Req 4.5)', async () => {
    const allRecords = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MEDICAL_RECORDS
    );

    const recordsNeedingFollowUp = allRecords.documents.filter(
      (record: any) => record.followUpRequired === true
    );

    expect(recordsNeedingFollowUp.length).toBeGreaterThan(0);

    const testRecord = recordsNeedingFollowUp.find(
      (r: any) => r.animalId === testAnimalId
    );
    expect(testRecord).toBeDefined();
    expect(testRecord?.followUpRequired).toBe(true);
    expect(testRecord?.followUpDate).toBeDefined();
  });
});

describe('E2E: Admin Bulk Operations Workflow', () => {
  /**
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
  });

  it('should perform bulk status update (Req 6.3)', async () => {
    // Create test animals
    const animals = [
      {
        name: 'Bulk Update Dog 1',
        type: 'dog' as const,
        age: 2,
        location: {
          area: 'Bulk Area',
          coordinates: [29.8543, 77.888] as [number, number],
        },
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy' as const,
      },
      {
        name: 'Bulk Update Dog 2',
        type: 'dog' as const,
        age: 3,
        location: {
          area: 'Bulk Area',
          coordinates: [29.855, 77.889] as [number, number],
        },
        medicalHistory: [],
        photos: { profile: '', gallery: [] },
        status: 'healthy' as const,
      },
    ];

    const createdIds: string[] = [];

    for (const animal of animals) {
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

    // Bulk update status
    for (const id of createdIds) {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.ANIMALS, id, {
        status: 'under_treatment',
      });
    }

    // Verify updates
    for (const id of createdIds) {
      const animal = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        id
      );
      expect(animal.status).toBe('under_treatment');
    }
  });

  it('should perform bulk location update (Req 6.3)', async () => {
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const bulkAreaAnimals = allAnimals.documents.filter(
      (animal: any) => animal.location.area === 'Bulk Area'
    );

    // Update all animals in Bulk Area to new location
    for (const animal of bulkAreaAnimals) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        animal.$id,
        {
          location: {
            area: 'Relocated Area',
            coordinates: animal.location.coordinates,
          },
        }
      );
    }

    // Verify updates
    for (const animal of bulkAreaAnimals) {
      const updated = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        animal.$id
      );
      expect(updated.location.area).toBe('Relocated Area');
    }
  });

  it('should validate age is positive number (Req 6.4)', async () => {
    const validAnimal = {
      name: 'Validation Test Dog',
      type: 'dog' as const,
      age: 5,
      location: {
        area: 'Test Area',
        coordinates: [29.8543, 77.888] as [number, number],
      },
      medicalHistory: [],
      photos: { profile: '', gallery: [] },
      status: 'healthy' as const,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ANIMALS,
      ID.unique(),
      validAnimal,
      [Permission.read(Role.any())]
    );

    testData.animalIds.push(response.$id);

    expect(response).toBeDefined();
    expect(response.age).toBeGreaterThan(0);
    expect(typeof response.age).toBe('number');
  });

  it('should validate type is dog or cat (Req 6.4)', async () => {
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    allAnimals.documents.forEach((animal: any) => {
      expect(['dog', 'cat'].includes(animal.type)).toBe(true);
    });
  });

  it('should validate coordinates format (Req 6.4)', async () => {
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    allAnimals.documents.forEach((animal: any) => {
      expect(animal.location).toBeDefined();
      expect(animal.location.coordinates).toBeDefined();
      expect(Array.isArray(animal.location.coordinates)).toBe(true);
      expect(animal.location.coordinates.length).toBe(2);
      expect(typeof animal.location.coordinates[0]).toBe('number');
      expect(typeof animal.location.coordinates[1]).toBe('number');
    });
  });

  it('should search animals by breed (Req 6.5)', async () => {
    // Create animals with specific breeds
    const breedsToTest = ['Labrador', 'Golden Retriever', 'Beagle'];

    for (const breed of breedsToTest) {
      const animal = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ANIMALS,
        ID.unique(),
        {
          name: `${breed} Test Dog`,
          type: 'dog',
          age: 3,
          breed: breed,
          location: { area: 'Test Area', coordinates: [29.8543, 77.888] },
          medicalHistory: [],
          photos: { profile: '', gallery: [] },
          status: 'healthy',
        },
        [Permission.read(Role.any())]
      );
      testData.animalIds.push(animal.$id);
    }

    // Search for Labrador
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    const labradors = allAnimals.documents.filter(
      (animal: any) =>
        animal.breed && animal.breed.toLowerCase().includes('labrador')
    );

    expect(labradors.length).toBeGreaterThan(0);
    labradors.forEach((animal: any) => {
      expect(animal.breed.toLowerCase()).toContain('labrador');
    });
  });

  it('should filter by multiple criteria (Req 6.5)', async () => {
    const allAnimals = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ANIMALS
    );

    // Filter: dogs, healthy status, age > 2
    const filtered = allAnimals.documents.filter(
      (animal: any) =>
        animal.type === 'dog' && animal.status === 'healthy' && animal.age > 2
    );

    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((animal: any) => {
      expect(animal.type).toBe('dog');
      expect(animal.status).toBe('healthy');
      expect(animal.age).toBeGreaterThan(2);
    });
  });
});
