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
        const animalPromises = territory.animals.map((id) => getAnimalById(id));
        const fetchedAnimals = await Promise.all(animalPromises);
        setAnimals(fetchedAnimals.filter((a): a is AnimalProfile => a !== null));
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
    <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl z-[1000] max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900">{territory.name}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {/* Territory Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Pack Size</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{territory.packSize}</p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium">Animals</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{territory.animals.length}</p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {formatDate(territory.lastUpdated)}</span>
        </div>

        {/* Assigned Volunteers */}
        {territory.assignedVolunteers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Assigned Volunteers</h4>
            <div className="space-y-1">
              {territory.assignedVolunteers.map((volunteerId) => (
                <div
                  key={volunteerId}
                  className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                >
                  Volunteer ID: {volunteerId.slice(0, 8)}...
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Animals List */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Animals in Territory</h4>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 h-16 rounded animate-pulse" />
              ))}
            </div>
          ) : animals.length > 0 ? (
            <div className="space-y-2">
              {animals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {animal.photos.profile && (
                      <img
                        src={animal.photos.profile}
                        alt={animal.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{animal.name}</p>
                      <p className="text-xs text-gray-600">
                        {animal.type} • {animal.age} {animal.age === 1 ? 'year' : 'years'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{animal.location.area}</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        animal.status === 'healthy'
                          ? 'bg-green-100 text-green-700'
                          : animal.status === 'needs_attention'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {animal.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No animals in this territory</p>
          )}
        </div>
      </div>
    </div>
  );
}
