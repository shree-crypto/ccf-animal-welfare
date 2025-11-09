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
    healthy: 'bg-emerald-500 text-white',
    needs_attention: 'bg-amber-500 text-white',
    under_treatment: 'bg-rose-500 text-white',
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
        <Card className="group h-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header Background Pattern */}
          <div className="relative h-24 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
            {/* Favorite Icon - Top Right */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-9 w-9 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex items-center justify-center shadow-lg cursor-pointer"
              >
                <Heart className="h-4 w-4 text-pink-500" />
              </motion.div>
            </div>
          </div>

          {/* Circular Profile Picture */}
          <div className="flex justify-center -mt-16 px-6 relative z-10">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
              >
                {animal.photos.profile ? (
                  <Image
                    src={animal.photos.profile}
                    alt={`${animal.name}, a ${animal.age} year old ${animal.breed || animal.type} - ${statusLabels[animal.status]}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    sizes="128px"
                    priority={index < 3}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Heart className="h-12 w-12 text-purple-300 dark:text-purple-600" />
                  </div>
                )}
              </motion.div>

              {/* Status Badge on Profile Picture */}
              <div className="absolute -bottom-1 -right-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg ${statusColors[animal.status]}`}
                >
                  {statusLabels[animal.status]}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 pt-4 space-y-4 flex-1 flex flex-col">
            {/* Title and Breed - Centered */}
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {animal.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium capitalize">
                {animal.breed || animal.type}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-700" />

            {/* Info Grid */}
            <div className="space-y-3 text-sm flex-1">
              {/* Age */}
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">
                  {animal.age} {animal.age === 1 ? 'year' : 'years'} old
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium truncate">
                  {animal.location.area}
                </span>
              </div>

              {/* Current Feeder */}
              {animal.currentFeeder && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <span className="font-medium truncate">
                    Fed by {animal.currentFeeder}
                  </span>
                </div>
              )}
            </div>

            {/* View Details Button */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-700 group-hover:to-pink-700 text-white text-center text-sm font-semibold transition-all duration-300 shadow-md group-hover:shadow-lg flex items-center justify-center gap-2"
              >
                View Profile
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
              </motion.div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
});
