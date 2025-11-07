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
      [29.8650, 77.8950],
      [29.8650, 77.9000],
      [29.8600, 77.9000],
      [29.8600, 77.8950],
    ] as [number, number][],
    packSize: 5,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Hostel Complex',
    boundaries: [
      [29.8550, 77.8900],
      [29.8550, 77.8950],
      [29.8500, 77.8950],
      [29.8500, 77.8900],
    ] as [number, number][],
    packSize: 8,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Sports Ground',
    boundaries: [
      [29.8600, 77.8850],
      [29.8600, 77.8900],
      [29.8550, 77.8900],
      [29.8550, 77.8850],
    ] as [number, number][],
    packSize: 3,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Academic Block',
    boundaries: [
      [29.8650, 77.8900],
      [29.8650, 77.8950],
      [29.8600, 77.8950],
      [29.8600, 77.8900],
    ] as [number, number][],
    packSize: 4,
    animals: [],
    assignedVolunteers: [],
  },
  {
    name: 'Library Area',
    boundaries: [
      [29.8580, 77.8920],
      [29.8580, 77.8970],
      [29.8530, 77.8970],
      [29.8530, 77.8920],
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
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
