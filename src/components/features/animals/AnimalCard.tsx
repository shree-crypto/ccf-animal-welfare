'use client';

import { memo } from 'react';
import { AnimalProfile } from '@/types/animal';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, User, Heart, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AnimalCardProps {
  animal: AnimalProfile;
  index?: number;
}

export const AnimalCard = memo(function AnimalCard({
  animal,
  index = 0,
}: AnimalCardProps) {
  const statusColors = {
    healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
    needs_attention: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
    under_treatment: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900',
  };

  const statusLabels = {
    healthy: 'Healthy',
    needs_attention: 'Needs Attention',
    under_treatment: 'Under Treatment',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        href={`/animals/${animal.id}`}
        aria-label={`View details for ${animal.name}`}
      >
        <Card className="group h-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          {/* Circular Profile Picture Section */}
          <div className="p-6 pb-4 flex flex-col items-center">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-800"
              >
                {animal.photos.profile ? (
                  <Image
                    src={animal.photos.profile}
                    alt={`${animal.name}, a ${animal.age} year old ${animal.breed || animal.type} - ${statusLabels[animal.status]}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    sizes="112px"
                    priority={index < 3}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Heart className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </motion.div>

              {/* Favorite Icon Overlay */}
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <Heart className="h-4 w-4 text-pink-500" />
                </motion.div>
              </div>
            </div>

            {/* Status Badge Below Profile */}
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[animal.status]}`}>
                {statusLabels[animal.status]}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-6 pb-6 space-y-4">
            {/* Title and Breed - Centered */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {animal.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {animal.breed || animal.type}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Info List */}
            <div className="space-y-2.5 text-sm">
              {/* Age */}
              <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <span>
                  {animal.age} {animal.age === 1 ? 'year' : 'years'} old
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <span className="truncate">{animal.location.area}</span>
              </div>

              {/* Current Feeder */}
              {animal.currentFeeder && (
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="truncate">Fed by {animal.currentFeeder}</span>
                </div>
              )}
            </div>

            {/* View Details Link */}
            <div className="pt-2">
              <div className="w-full py-2 text-center text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors flex items-center justify-center gap-1.5">
                View Profile
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
});
