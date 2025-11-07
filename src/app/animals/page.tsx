'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AnimalProfile, AnimalType } from '@/types/animal';
import { getAnimals } from '@/lib/db/animals';
import { AnimalGrid } from '@/components/features/animals/AnimalGrid';
import { FilterBar } from '@/components/features/animals/FilterBar';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { SparklesCore } from '@/components/ui/sparkles';
import { Loader2, Heart, Sparkles } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Note: Metadata should be added in a separate metadata file or converted to Server Component
// For now, using client component with dynamic title update via useEffect

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<AnimalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AnimalType | 'all'>('all');

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handleTypeFilter = useCallback((type: AnimalType | 'all') => {
    setSelectedType(type);
  }, []);

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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
        <AnimatedGradient className="pointer-events-none" />
      
      {/* Hero Section with Sparkles */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <SparklesCore
            background="transparent"
            minSize={0.6}
            size={1.4}
            density={50}
            className="w-full h-full"
            color="#A78BFA"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-200/80 to-purple-200/80 dark:from-pink-900/50 dark:to-purple-900/50 backdrop-blur-sm"
            >
              <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400 fill-current" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Caring for Campus Animals
              </span>
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Meet Our Animals
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover the wonderful animals under CCF's care. Each one has a unique story and personality waiting to be shared.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filters with Glass Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-2xl p-6 shadow-xl border border-purple-200/50 dark:border-purple-800/50"
          >
            <FilterBar
              searchValue={searchTerm}
              selectedType={selectedType}
              onSearchChange={handleSearchChange}
              onTypeFilter={handleTypeFilter}
            />
          </motion.div>

          {/* Results Count */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse" />
              Showing {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal' : 'animals'}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-purple-400/30" />
              </div>
              <p className="text-purple-700 dark:text-purple-300 font-medium">Loading our furry friends...</p>
            </div>
          )}

          {/* Animal Grid */}
          {!loading && <AnimalGrid animals={filteredAnimals} />}
        </div>
      </section>
    </div>
    </ErrorBoundary>
  );
}
