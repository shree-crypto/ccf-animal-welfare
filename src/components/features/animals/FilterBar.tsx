'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Search, Dog, Cat, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimalType } from '@/types/animal';

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onTypeFilter: (type: AnimalType | 'all') => void;
  searchValue: string;
  selectedType: AnimalType | 'all';
}

export const FilterBar = memo(function FilterBar({ onSearchChange, onTypeFilter, searchValue, selectedType }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterButtons = [
    { 
      value: 'all' as const, 
      label: 'All Animals', 
      icon: Filter,
      gradient: 'from-purple-400 to-pink-400',
      hoverGradient: 'hover:from-purple-500 hover:to-pink-500'
    },
    { 
      value: 'dog' as const, 
      label: 'Dogs', 
      icon: Dog,
      gradient: 'from-blue-400 to-cyan-400',
      hoverGradient: 'hover:from-blue-500 hover:to-cyan-500'
    },
    { 
      value: 'cat' as const, 
      label: 'Cats', 
      icon: Cat,
      gradient: 'from-orange-400 to-amber-400',
      hoverGradient: 'hover:from-orange-500 hover:to-amber-500'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
          <Search className="h-5 w-5 text-purple-700 dark:text-purple-300" />
        </div>
        <Input
          type="search"
          placeholder="Search animals by name, breed, or location..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-16 h-14 text-base border-2 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg"
          aria-label="Search animals"
          role="searchbox"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {filterButtons.map((filter, index) => {
          const Icon = filter.icon;
          const isActive = selectedType === filter.value;
          
          return (
            <motion.div
              key={filter.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={isActive ? 'default' : 'outline'}
                size="lg"
                onClick={() => onTypeFilter(filter.value)}
                className={`
                  transition-all duration-300 rounded-xl font-semibold
                  ${isActive 
                    ? `bg-gradient-to-r ${filter.gradient} text-white shadow-lg ${filter.hoverGradient} border-0` 
                    : 'border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
                  }
                `}
                aria-label={`Filter by ${filter.label}`}
                aria-pressed={isActive}
              >
                <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                {filter.label}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
});
