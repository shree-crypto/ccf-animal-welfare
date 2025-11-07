'use client';

import { useState } from 'react';
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

export function FilterBar({ onSearchChange, onTypeFilter, searchValue, selectedType }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterButtons = [
    { value: 'all' as const, label: 'All Animals', icon: Filter },
    { value: 'dog' as const, label: 'Dogs', icon: Dog },
    { value: 'cat' as const, label: 'Cats', icon: Cat },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search animals by name..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedType === filter.value;
          
          return (
            <Button
              key={filter.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeFilter(filter.value)}
              className="transition-all duration-200"
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}
