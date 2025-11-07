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
    healthy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    needs_attention: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    under_treatment: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
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
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Link href={`/animals/${animal.id}`}>
        <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-64 w-full overflow-hidden bg-muted">
            {animal.photos.profile ? (
              <Image
                src={animal.photos.profile}
                alt={animal.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Heart className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[animal.status]}`}>
                {statusLabels[animal.status]}
              </span>
            </div>
          </div>
          
          <CardContent className="p-5">
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {animal.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {animal.breed || animal.type} • {animal.age} {animal.age === 1 ? 'year' : 'years'} old
                </p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{animal.location.area}</span>
                </div>
                
                {animal.currentFeeder && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Fed by {animal.currentFeeder}</span>
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
