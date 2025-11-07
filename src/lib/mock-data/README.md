# Mock Data

This directory contains mock data used for development and testing when Appwrite is not available.

## Usage

The mock data is automatically used as a fallback when database operations fail (e.g., when Appwrite is not running).

## Files

### `animals.ts`

Contains 12 mock animal profiles with:
- Various dog and cat breeds
- Different statuses (healthy, needs_attention, under_treatment)
- Different locations across campus
- Profile photos from Unsplash
- Realistic data for testing UI components

## Adding Mock Data

When adding new collections, create corresponding mock data files:

1. Create a new file (e.g., `tasks.ts`)
2. Export an array of mock objects matching your type
3. Import and use in database operations as fallback

Example:
```typescript
import { mockAnimals } from '@/lib/mock-data/animals';

export const getAnimals = async () => {
  try {
    // Try Appwrite
    const response = await databases.listDocuments(...);
    return response.documents;
  } catch (error) {
    // Fallback to mock data
    console.warn('Using mock data');
    return mockAnimals;
  }
};
```

## Image Sources

All images are from Unsplash and are free to use:
- Dog photos: Various breeds from Unsplash
- Cat photos: Various breeds from Unsplash

## Notes

- Mock data is only used when Appwrite connection fails
- In production, ensure Appwrite is properly configured
- Mock data helps with:
  - Local development without Appwrite
  - UI testing and development
  - Demo purposes
  - Component development
