/**
 * Seed script for creating sample territory data
 * This is for development and testing purposes
 */

import { createTerritory } from './territories';

// Sample territories around IIT Roorkee campus
const sampleTerritories = [
  {
    name: 'Main Building Area',
    boundaries: [
      [29.865, 77.895],
      [29.865, 77.9],
      [29.86, 77.9],
      [29.86, 77.895],
    ] as [number, number][],
    packSize: 5,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Hostel Complex',
    boundaries: [
      [29.855, 77.89],
      [29.855, 77.895],
      [29.85, 77.895],
      [29.85, 77.89],
    ] as [number, number][],
    packSize: 8,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Sports Ground',
    boundaries: [
      [29.86, 77.885],
      [29.86, 77.89],
      [29.855, 77.89],
      [29.855, 77.885],
    ] as [number, number][],
    packSize: 3,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Academic Block',
    boundaries: [
      [29.865, 77.89],
      [29.865, 77.895],
      [29.86, 77.895],
      [29.86, 77.89],
    ] as [number, number][],
    packSize: 4,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Library Area',
    boundaries: [
      [29.858, 77.892],
      [29.858, 77.897],
      [29.853, 77.897],
      [29.853, 77.892],
    ] as [number, number][],
    packSize: 2,
    animals: [],
    assignedVolunteers: [],
  },
];

export async function seedTerritories() {
  console.log('Seeding territories...');

  try {
    for (const territory of sampleTerritories) {
      const created = await createTerritory(territory);
      console.log(`Created territory: ${created.name}`);
    }
    console.log('Territory seeding completed!');
  } catch (error) {
    console.error('Error seeding territories:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedTerritories()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
