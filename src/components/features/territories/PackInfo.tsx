'use client';

import { Territory } from '@/types/territory';
import { X, Users, MapPin, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAnimalById } from '@/lib/db/animals';
import { AnimalProfile } from '@/types/animal';

interface PackInfoProps {
  territory: Territory;
  onClose: () => void;
}

export function PackInfo({ territory, onClose }: PackInfoProps) {
  const [animals, setAnimals] = useState<AnimalProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const animalPromises = territory.animals.map(id => getAnimalById(id));
        const fetchedAnimals = await Promise.all(animalPromises);
        setAnimals(
          fetchedAnimals.filter((a): a is AnimalProfile => a !== null)
        );
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [territory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="absolute top-20 right-4 w-72 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl z-[1000] max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{territory.name}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto flex-1">
        {/* Territory Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 p-2 rounded">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">Pack Size</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{territory.packSize}</p>
          </div>

          <div className="bg-gray-50 p-2 rounded">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">Animals</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{territory.animals.length}</p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(territory.lastUpdated)}</span>
        </div>

        {/* Assigned Volunteers */}
        {territory.assignedVolunteers.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-900 mb-1">Volunteers</h4>
            <div className="space-y-1">
              {territory.assignedVolunteers.map(volunteerId => (
                <div
                  key={volunteerId}
                  className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                >
                  {volunteerId.slice(0, 8)}...
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Animals List */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-1">Animals</h4>
          {loading ? (
            <div className="space-y-1">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-100 h-12 rounded animate-pulse" />
              ))}
            </div>
          ) : animals.length > 0 ? (
            <div className="space-y-1">
              {animals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {animal.photos.profile && (
                      <img
                        src={animal.photos.profile}
                        alt={animal.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{animal.name}</p>
                      <p className="text-xs text-gray-600">
                        {animal.type} • {animal.age}y
                      </p>
                    </div>
                    <div
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        animal.status === 'healthy'
                          ? 'bg-green-100 text-green-700'
                          : animal.status === 'needs_attention'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {animal.status === 'healthy' ? '✓' : '!'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-3">No animals</p>
          )}
        </div>
      </div>
    </div>
  );
}
