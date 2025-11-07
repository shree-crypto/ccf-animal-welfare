import type { AnimalProfile } from '@/types/animal';

/**
 * Mock animal data for development and testing
 * Used when Appwrite is not available
 */
export const mockAnimals: AnimalProfile[] = [
  {
    id: 'mock_1',
    name: 'Max',
    type: 'dog',
    age: 3,
    breed: 'Golden Retriever',
    location: {
      area: 'Main Campus',
      coordinates: [29.8543, 77.8880],
    },
    currentFeeder: 'John Doe',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
      ],
    },
    packId: 'pack_1',
    status: 'healthy',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'mock_2',
    name: 'Luna',
    type: 'cat',
    age: 2,
    breed: 'Persian',
    location: {
      area: 'Library Area',
      coordinates: [29.8545, 77.8882],
    },
    currentFeeder: 'Jane Smith',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
      ],
    },
    status: 'healthy',
    createdAt: '2024-01-14T10:00:00.000Z',
    updatedAt: '2024-01-14T10:00:00.000Z',
  },
  {
    id: 'mock_3',
    name: 'Rocky',
    type: 'dog',
    age: 5,
    breed: 'German Shepherd',
    location: {
      area: 'Sports Complex',
      coordinates: [29.8547, 77.8878],
    },
    currentFeeder: 'Mike Johnson',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&h=600&fit=crop',
      ],
    },
    packId: 'pack_2',
    status: 'needs_attention',
    createdAt: '2024-01-13T10:00:00.000Z',
    updatedAt: '2024-01-13T10:00:00.000Z',
  },
  {
    id: 'mock_4',
    name: 'Bella',
    type: 'dog',
    age: 1,
    breed: 'Labrador',
    location: {
      area: 'Hostel Area',
      coordinates: [29.8550, 77.8885],
    },
    currentFeeder: 'Sarah Williams',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop',
      ],
    },
    packId: 'pack_1',
    status: 'healthy',
    createdAt: '2024-01-12T10:00:00.000Z',
    updatedAt: '2024-01-12T10:00:00.000Z',
  },
  {
    id: 'mock_5',
    name: 'Whiskers',
    type: 'cat',
    age: 4,
    breed: 'Siamese',
    location: {
      area: 'Academic Block',
      coordinates: [29.8548, 77.8883],
    },
    currentFeeder: 'Emily Brown',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop',
      ],
    },
    status: 'healthy',
    createdAt: '2024-01-11T10:00:00.000Z',
    updatedAt: '2024-01-11T10:00:00.000Z',
  },
  {
    id: 'mock_6',
    name: 'Charlie',
    type: 'dog',
    age: 6,
    breed: 'Beagle',
    location: {
      area: 'Cafeteria Area',
      coordinates: [29.8546, 77.8881],
    },
    currentFeeder: 'David Lee',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop',
      ],
    },
    packId: 'pack_2',
    status: 'under_treatment',
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z',
  },
  {
    id: 'mock_7',
    name: 'Mittens',
    type: 'cat',
    age: 3,
    breed: 'Tabby',
    location: {
      area: 'Garden Area',
      coordinates: [29.8549, 77.8884],
    },
    currentFeeder: 'Lisa Anderson',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800&h=600&fit=crop',
      ],
    },
    status: 'healthy',
    createdAt: '2024-01-09T10:00:00.000Z',
    updatedAt: '2024-01-09T10:00:00.000Z',
  },
  {
    id: 'mock_8',
    name: 'Buddy',
    type: 'dog',
    age: 4,
    breed: 'Husky',
    location: {
      area: 'Parking Area',
      coordinates: [29.8544, 77.8879],
    },
    currentFeeder: 'Tom Wilson',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop',
      ],
    },
    packId: 'pack_1',
    status: 'healthy',
    createdAt: '2024-01-08T10:00:00.000Z',
    updatedAt: '2024-01-08T10:00:00.000Z',
  },
  {
    id: 'mock_9',
    name: 'Shadow',
    type: 'cat',
    age: 5,
    breed: 'Black Cat',
    location: {
      area: 'Administration Block',
      coordinates: [29.8551, 77.8886],
    },
    currentFeeder: 'Rachel Green',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&h=600&fit=crop',
      ],
    },
    status: 'needs_attention',
    createdAt: '2024-01-07T10:00:00.000Z',
    updatedAt: '2024-01-07T10:00:00.000Z',
  },
  {
    id: 'mock_10',
    name: 'Duke',
    type: 'dog',
    age: 7,
    breed: 'Rottweiler',
    location: {
      area: 'Security Gate',
      coordinates: [29.8542, 77.8877],
    },
    currentFeeder: 'Chris Martin',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=800&h=600&fit=crop',
      ],
    },
    packId: 'pack_2',
    status: 'healthy',
    createdAt: '2024-01-06T10:00:00.000Z',
    updatedAt: '2024-01-06T10:00:00.000Z',
  },
  {
    id: 'mock_11',
    name: 'Snowball',
    type: 'cat',
    age: 1,
    breed: 'White Persian',
    location: {
      area: 'Faculty Housing',
      coordinates: [29.8552, 77.8887],
    },
    currentFeeder: 'Anna Taylor',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=600&fit=crop',
      ],
    },
    status: 'healthy',
    createdAt: '2024-01-05T10:00:00.000Z',
    updatedAt: '2024-01-05T10:00:00.000Z',
  },
  {
    id: 'mock_12',
    name: 'Rex',
    type: 'dog',
    age: 8,
    breed: 'Doberman',
    location: {
      area: 'Workshop Area',
      coordinates: [29.8541, 77.8876],
    },
    currentFeeder: 'Mark Davis',
    medicalHistory: [],
    photos: {
      profile: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&h=600&fit=crop',
      ],
    },
    packId: 'pack_2',
    status: 'under_treatment',
    createdAt: '2024-01-04T10:00:00.000Z',
    updatedAt: '2024-01-04T10:00:00.000Z',
  },
];
