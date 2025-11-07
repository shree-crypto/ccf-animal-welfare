'use client';

import { AnimalProfile } from '@/types/animal';
import { AnimalCard } from './AnimalCard';

interface AnimalGridProps {
  animals: AnimalProfile[];
}

export function AnimalGrid({ animals }: AnimalGridProps) {
  if (animals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">No animals found</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {animals.map((animal, index) => (
        <AnimalCard key={animal.id} animal={animal} index={index} />
      ))}
    </div>
  );
}
