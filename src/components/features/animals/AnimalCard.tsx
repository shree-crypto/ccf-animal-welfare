'use client';

import { AnimalProfile } from '@/types/animal';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, User, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AnimalCardProps {
  animal: AnimalProfile;
  index?: number;
}

export function AnimalCard({ animal, index = 0 }: AnimalCardProps) {
  const statusColors = {
    healthy: 'bg-gradient-to-r from-emerald-200 to-teal-200 text-emerald-900 dark:from-emerald-800 dark:to-teal-800 dark:text-emerald-100 shadow-lg shadow-emerald-200/50',
    needs_attention: 'bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 dark:from-amber-800 dark:to-orange-800 dark:text-amber-100 shadow-lg shadow-amber-200/50',
    under_treatment: 'bg-gradient-to-r from-rose-200 to-pink-200 text-rose-900 dark:from-rose-800 dark:to-pink-800 dark:text-rose-100 shadow-lg shadow-rose-200/50',
  };

  const statusLabels = {
    healthy: 'Healthy',
    needs_attention: 'Needs Attention',
    under_treatment: 'Under Treatment',
  };

  const cardGradients = [
    'from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30',
    'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
    'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30',
    'from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30',
    'from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30',
  ];

  const cardGradient = cardGradients[index % cardGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Link href={`/animals/${animal.id}`} aria-label={`View details for ${animal.name}`}>
        <Card className={`group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 bg-gradient-to-br ${cardGradient} backdrop-blur-sm`}>
          <div className="relative h-64 w-full overflow-hidden">
            {animal.photos.profile ? (
              <>
                <Image
                  src={animal.photos.profile}
                  alt={`${animal.name}, a ${animal.age} year old ${animal.breed || animal.type} - ${statusLabels[animal.status]}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-pink-200/50 to-purple-200/50 dark:from-pink-900/30 dark:to-purple-900/30">
                <Heart className="h-16 w-16 text-purple-400/50 dark:text-purple-600/50" />
              </div>
            )}
            <div className="absolute top-3 right-3 z-10">
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${statusColors[animal.status]}`}
              >
                {statusLabels[animal.status]}
              </motion.span>
            </div>
            <div className="absolute top-3 left-3 z-10">
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
              >
                <Heart className="h-5 w-5 text-pink-500 fill-current" />
              </motion.div>
            </div>
          </div>
          
          <CardContent className="p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-purple-600 transition-all">
                  {animal.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">
                  {animal.breed || animal.type} • {animal.age} {animal.age === 1 ? 'year' : 'years'} old
                </p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <span className="truncate font-medium">{animal.location.area}</span>
                </div>
                
                {animal.currentFeeder && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 flex items-center justify-center">
                      <User className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="truncate font-medium">Fed by {animal.currentFeeder}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
