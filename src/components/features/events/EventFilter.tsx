'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface EventType {
  value: string;
  label: string;
}

interface EventFilterProps {
  eventTypes: EventType[];
  selectedType: string;
}

export function EventFilter({ eventTypes, selectedType }: EventFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }

    const queryString = params.toString();
    router.push(queryString ? `/events?${queryString}` : '/events');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Filter className="h-5 w-5 text-muted-foreground mt-2" />
      {eventTypes.map(type => (
        <Button
          key={type.value}
          variant={selectedType === type.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTypeChange(type.value)}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}
