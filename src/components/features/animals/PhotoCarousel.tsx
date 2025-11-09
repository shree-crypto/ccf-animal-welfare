'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoCarouselProps {
  photos: string[];
  animalName: string;
}

export function PhotoCarousel({ photos, animalName }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No photos available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  return (
    <>
      {/* Main Carousel */}
      <div className="relative w-full" onKeyDown={handleKeyDown} tabIndex={0}>
        {/* Main Image */}
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            >
              <Image
                src={photos[currentIndex]}
                alt={`${animalName} - Photo ${currentIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={goToPrevious}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={goToNext}
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Photo Counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-primary scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative w-full h-full max-w-7xl max-h-screen p-4">
              <Image
                src={photos[currentIndex]}
                alt={`${animalName} - Photo ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={e => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={e => {
                    e.stopPropagation();
                    goToNext();
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
