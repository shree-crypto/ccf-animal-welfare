import { AnimalProfile } from '@/types/animal';

export function exportAnimalsToCSV(animals: AnimalProfile[]): void {
  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Type',
    'Age',
    'Breed',
    'Location Area',
    'Latitude',
    'Longitude',
    'Current Feeder',
    'Status',
    'Pack ID',
    'Created At',
    'Updated At',
  ];

  // Convert animals to CSV rows
  const rows = animals.map(animal => [
    animal.id,
    animal.name,
    animal.type,
    animal.age,
    animal.breed || '',
    animal.location.area,
    animal.location.coordinates[0],
    animal.location.coordinates[1],
    animal.currentFeeder || '',
    animal.status,
    animal.packId || '',
    animal.createdAt,
    animal.updatedAt,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `animals_export_${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAnimalsToJSON(animals: AnimalProfile[]): void {
  const jsonContent = JSON.stringify(animals, null, 2);

  const blob = new Blob([jsonContent], {
    type: 'application/json;charset=utf-8;',
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `animals_export_${new Date().toISOString().split('T')[0]}.json`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
