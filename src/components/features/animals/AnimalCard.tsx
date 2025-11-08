'use client';

import { memo } from 'react';
import { AnimalProfile } from '@/types/animal';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, User, Heart, Calendar } from 'lucide-react';
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
    healthy: 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30',
    needs_attention: 'bg-amber-500/90 text-white shadow-lg shadow-amber-500/30',
    under_treatment: 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/30',
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
        <Card className="group h-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Image Container with 16:9 aspect ratio */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
            {animal.photos.profile ? (
              <>
                <Image
                  src={animal.photos.profile}
                  alt={`${animal.name}, a ${animal.age} year old ${animal.breed || animal.type} - ${statusLabels[animal.status]}`}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Heart className="h-20 w-20 text-purple-300 dark:text-purple-600" />
              </div>
            )}

            {/* Status Badge - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${statusColors[animal.status]}`}
              >
                {statusLabels[animal.status]}
              </motion.div>
            </div>

            {/* Favorite Icon - Top Left */}
            <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-10 w-10 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex items-center justify-center shadow-xl cursor-pointer"
              >
                <Heart className="h-5 w-5 text-pink-500" />
              </motion.div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-4">
            {/* Title and Breed */}
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                {animal.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium capitalize">
                {animal.breed || animal.type}
              </p>
            </div>

            {/* Info Grid */}
            <div className="space-y-3 text-sm">
              {/* Age */}
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">
                  {animal.age} {animal.age === 1 ? 'year' : 'years'} old
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium truncate">
                  {animal.location.area}
                </span>
              </div>

              {/* Current Feeder */}
              {animal.currentFeeder && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 flex items-center justify-center">
                    <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <span className="font-medium truncate">
                    Fed by {animal.currentFeeder}
                  </span>
                </div>
              )}
            </div>

            {/* View Details Link */}
            <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                View Details
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  →
                </motion.span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
});
