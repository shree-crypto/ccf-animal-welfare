'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AnimalProfile, AnimalType } from '@/types/animal';
import { getAnimals, searchAnimalsByName } from '@/lib/db/animals';
import { AnimalGrid } from '@/components/features/animals/AnimalGrid';
import { FilterBar } from '@/components/features/animals/FilterBar';
import { Loader2 } from 'lucide-react';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<AnimalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AnimalType | 'all'>('all');

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        const { animals: fetchedAnimals } = await getAnimals();
        setAnimals(fetchedAnimals);
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Filter animals based on search and type
  const filteredAnimals = useMemo(() => {
    let filtered = animals;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((animal) => animal.type === selectedType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((animal) =>
        animal.name.toLowerCase().includes(search) ||
        animal.breed?.toLowerCase().includes(search) ||
        animal.location.area.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [animals, selectedType, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Meet Our Animals
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the wonderful animals under CCF's care. Each one has a unique story and personality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filters */}
          <FilterBar
            searchValue={searchTerm}
            selectedType={selectedType}
            onSearchChange={setSearchTerm}
            onTypeFilter={setSelectedType}
          />

          {/* Results Count */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              Showing {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal' : 'animals'}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Animal Grid */}
          {!loading && <AnimalGrid animals={filteredAnimals} />}
        </div>
      </section>
    </div>
  );
}
