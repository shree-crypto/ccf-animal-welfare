'use client';

import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface EventType {
  value: string;
  label: string;
}

interface EventFilterProps {
  eventTypes: EventType[];
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function EventFilter({ eventTypes, selectedType, onTypeChange }: EventFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Filter className="h-5 w-5 text-muted-foreground mt-2" />
      {eventTypes.map(type => (
        <Button
          key={type.value}
          variant={selectedType === type.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange(type.value)}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}
